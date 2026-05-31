import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Route as RouteIcon, Search, Building2, ChevronDown, Repeat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { useLiveBuses } from "@/lib/hooks";
import { ROUTES, CITIES, getCity, haversineKm, type BusRoute, type CityId } from "@/lib/buses";
import { translatePlace } from "@/lib/places";
import { BusMap } from "@/components/BusMap";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Route Planner — SmartFlow" },
      { name: "description", content: "Plan your bus journey across Indian cities. Get the best direct and transfer bus options." },
    ],
  }),
  component: Planner,
});

type DirectOption = {
  kind: "direct";
  route: BusRoute;
  fromIdx: number;
  toIdx: number;
  stopsBetween: number;
};

type TransferOption = {
  kind: "transfer";
  leg1: { route: BusRoute; fromIdx: number; transferIdx: number };
  leg2: { route: BusRoute; transferIdx: number; toIdx: number };
  transferName: string;
  stopsBetween: number;
};

type Option = DirectOption | TransferOption;

function findStop(query: string, cityRoutes: BusRoute[], lang: Parameters<typeof translatePlace>[1]) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const stops = new Map<string, { name: string; lat: number; lng: number }>();
  cityRoutes.forEach((r) => r.stops.forEach((s) => {
    if (!stops.has(s.name)) stops.set(s.name, s);
  }));
  // exact name match (en or translated), else substring
  for (const s of stops.values()) {
    if (s.name.toLowerCase() === q) return s;
    if (translatePlace(s.name, lang).toLowerCase() === q) return s;
  }
  for (const s of stops.values()) {
    if (s.name.toLowerCase().includes(q)) return s;
    if (translatePlace(s.name, lang).toLowerCase().includes(q)) return s;
  }
  return null;
}

function planRoutes(fromName: string, toName: string, cityRoutes: BusRoute[]): Option[] {
  const opts: Option[] = [];
  // Direct
  for (const r of cityRoutes) {
    const fromIdx = r.stops.findIndex((s) => s.name === fromName);
    const toIdx = r.stops.findIndex((s) => s.name === toName);
    if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
      opts.push({ kind: "direct", route: r, fromIdx, toIdx, stopsBetween: toIdx - fromIdx });
    }
  }
  // Transfer (1 hop)
  if (opts.length < 4) {
    for (const r1 of cityRoutes) {
      const fromIdx = r1.stops.findIndex((s) => s.name === fromName);
      if (fromIdx === -1) continue;
      for (const r2 of cityRoutes) {
        if (r2.id === r1.id) continue;
        const toIdx = r2.stops.findIndex((s) => s.name === toName);
        if (toIdx === -1) continue;
        // find shared stop after fromIdx on r1 and before toIdx on r2
        for (let i = fromIdx + 1; i < r1.stops.length; i++) {
          const s = r1.stops[i];
          const j = r2.stops.findIndex((x) => x.name === s.name);
          if (j !== -1 && j < toIdx) {
            opts.push({
              kind: "transfer",
              leg1: { route: r1, fromIdx, transferIdx: i },
              leg2: { route: r2, transferIdx: j, toIdx },
              transferName: s.name,
              stopsBetween: (i - fromIdx) + (toIdx - j),
            });
            break;
          }
        }
      }
    }
  }
  // Dedupe transfer combos
  const seen = new Set<string>();
  const unique = opts.filter((o) => {
    const k = o.kind === "direct"
      ? `d:${o.route.id}:${o.fromIdx}:${o.toIdx}`
      : `t:${o.leg1.route.id}:${o.leg2.route.id}:${o.transferName}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  unique.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "direct" ? -1 : 1;
    return a.stopsBetween - b.stopsBetween;
  });
  return unique.slice(0, 6);
}

function Planner() {
  const { t, lang, city, setCity, cityName } = useI18n();
  const buses = useLiveBuses(2000, city);
  const cityRoutes = useMemo(() => ROUTES.filter((r) => r.cityId === city), [city]);
  const cityCenter = getCity(city).center;

  const [fromQ, setFromQ] = useState("");
  const [toQ, setToQ] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fromStop = useMemo(() => findStop(fromQ, cityRoutes, lang), [fromQ, cityRoutes, lang]);
  const toStop = useMemo(() => findStop(toQ, cityRoutes, lang), [toQ, cityRoutes, lang]);

  const options = useMemo(() => {
    if (!submitted || !fromStop || !toStop) return [];
    return planRoutes(fromStop.name, toStop.name, cityRoutes);
  }, [submitted, fromStop, toStop, cityRoutes]);

  const stopNames = useMemo(() => {
    const set = new Set<string>();
    cityRoutes.forEach((r) => r.stops.forEach((s) => set.add(s.name)));
    return Array.from(set).sort();
  }, [cityRoutes]);

  const selected = options[selectedIdx];
  const focusBuses = useMemo(() => {
    if (!selected) return buses;
    const ids = selected.kind === "direct"
      ? [selected.route.id]
      : [selected.leg1.route.id, selected.leg2.route.id];
    return buses.filter((b) => ids.includes(b.routeId));
  }, [buses, selected]);

  const swap = () => { setFromQ(toQ); setToQ(fromQ); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t("planner_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("planner_sub")}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Building2 className="h-4 w-4" />
              {cityName(city)}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
            {CITIES.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => { setCity(c.id as CityId); setSubmitted(false); }}
                className={city === c.id ? "bg-accent" : ""}
              >
                {cityName(c.id as CityId)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); setSelectedIdx(0); }}
          className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto]"
        >
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
            <Input
              list="planner-stops"
              value={fromQ}
              onChange={(e) => setFromQ(e.target.value)}
              placeholder={t("planner_from_placeholder")}
              className="pl-9"
            />
          </div>
          <Button type="button" variant="outline" size="icon" onClick={swap} aria-label="Swap">
            <Repeat className="h-4 w-4" />
          </Button>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
            <Input
              list="planner-stops"
              value={toQ}
              onChange={(e) => setToQ(e.target.value)}
              placeholder={t("planner_to_placeholder")}
              className="pl-9"
            />
          </div>
          <Button type="submit" className="gap-2">
            <Search className="h-4 w-4" />
            {t("planner_search")}
          </Button>
          <datalist id="planner-stops">
            {stopNames.map((n) => (
              <option key={n} value={translatePlace(n, lang)} />
            ))}
          </datalist>
        </form>
        {submitted && (!fromStop || !toStop) && (
          <p className="mt-3 text-sm text-destructive">{t("planner_unknown_stop")}</p>
        )}
        {submitted && fromStop && toStop && (
          <p className="mt-3 text-xs text-muted-foreground">
            {translatePlace(fromStop.name, lang)} → {translatePlace(toStop.name, lang)} ·{" "}
            ~{haversineKm([fromStop.lat, fromStop.lng], [toStop.lat, toStop.lng]).toFixed(1)} km
          </p>
        )}
      </Card>

      {submitted && fromStop && toStop && (
        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            {options.length === 0 ? (
              <Card className="p-6 text-center text-sm text-muted-foreground">
                {t("planner_no_results")}
              </Card>
            ) : (
              options.map((o, idx) => (
                <OptionCard
                  key={idx}
                  option={o}
                  active={idx === selectedIdx}
                  onSelect={() => setSelectedIdx(idx)}
                />
              ))
            )}
          </div>
          <div className="lg:col-span-3">
            <BusMap
              buses={focusBuses}
              center={cityCenter}
              height={520}
              focusBusRouteId={selected?.kind === "direct" ? selected.route.id : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function OptionCard({ option, active, onSelect }: { option: Option; active: boolean; onSelect: () => void }) {
  const { t, lang } = useI18n();
  if (option.kind === "direct") {
    const { route, fromIdx, toIdx, stopsBetween } = option;
    return (
      <Card
        onClick={onSelect}
        className={`cursor-pointer p-4 transition ${active ? "border-primary ring-2 ring-primary/30" : "hover:border-muted-foreground/40"}`}
      >
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1">
            <RouteIcon className="h-3 w-3" /> {t("planner_direct")}
          </Badge>
          <span
            className="rounded-md px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: route.color }}
          >
            {route.number}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <span>{translatePlace(route.stops[fromIdx].name, lang)}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{translatePlace(route.stops[toIdx].name, lang)}</span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {stopsBetween} {t("planner_stops")} · ~{stopsBetween * 3} {t("min")}
        </div>
      </Card>
    );
  }
  const { leg1, leg2, transferName, stopsBetween } = option;
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer p-4 transition ${active ? "border-primary ring-2 ring-primary/30" : "hover:border-muted-foreground/40"}`}
    >
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="gap-1">
          <Repeat className="h-3 w-3" /> {t("planner_transfer")}
        </Badge>
        <div className="flex gap-1">
          <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ background: leg1.route.color }}>
            {leg1.route.number}
          </span>
          <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ background: leg2.route.color }}>
            {leg2.route.number}
          </span>
        </div>
      </div>
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{translatePlace(leg1.route.stops[leg1.fromIdx].name, lang)}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{translatePlace(transferName, lang)}</span>
          <span className="text-xs text-muted-foreground">({leg1.route.number})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{translatePlace(transferName, lang)}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{translatePlace(leg2.route.stops[leg2.toIdx].name, lang)}</span>
          <span className="text-xs text-muted-foreground">({leg2.route.number})</span>
        </div>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {stopsBetween} {t("planner_stops")} · ~{stopsBetween * 3 + 4} {t("min")}
      </div>
    </Card>
  );
}
