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

type Leg = { route: BusRoute; fromIdx: number; toIdx: number };
type Option = { legs: Leg[]; totalStops: number };

function findStop(query: string, cityRoutes: BusRoute[], lang: Parameters<typeof translatePlace>[1]) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const stops = new Map<string, { name: string; lat: number; lng: number }>();
  cityRoutes.forEach((r) => r.stops.forEach((s) => {
    if (!stops.has(s.name)) stops.set(s.name, s);
  }));
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

// BFS over stops: each "edge" is a single bus leg (any forward segment of one route).
// Returns options up to maxLegs transfers, sorted by leg count then stop count.
function planRoutes(fromName: string, toName: string, cityRoutes: BusRoute[], maxLegs = 4): Option[] {
  if (fromName === toName) return [];
  const results: Option[] = [];
  type State = { stop: string; legs: Leg[]; usedRoutes: Set<string>; visitedStops: Set<string> };
  const queue: State[] = [{
    stop: fromName, legs: [], usedRoutes: new Set(), visitedStops: new Set([fromName]),
  }];
  const bestLegsToStop = new Map<string, number>([[fromName, 0]]);

  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.legs.length >= maxLegs) continue;
    // Try each route that passes through current stop (and we haven't used yet).
    for (const r of cityRoutes) {
      if (cur.usedRoutes.has(r.id)) continue;
      const fromIdx = r.stops.findIndex((s) => s.name === cur.stop);
      if (fromIdx === -1) continue;
      // Each forward stop on the route is a possible alighting point for this leg.
      for (let j = fromIdx + 1; j < r.stops.length; j++) {
        const nextStop = r.stops[j].name;
        if (cur.visitedStops.has(nextStop)) continue;
        const legs = [...cur.legs, { route: r, fromIdx, toIdx: j }];
        if (nextStop === toName) {
          const totalStops = legs.reduce((sum, l) => sum + (l.toIdx - l.fromIdx), 0);
          results.push({ legs, totalStops });
          continue;
        }
        // Prune: only explore further if we can still beat / equal best known leg count.
        const nextLegCount = legs.length;
        const best = bestLegsToStop.get(nextStop) ?? Infinity;
        if (nextLegCount > best) continue;
        bestLegsToStop.set(nextStop, Math.min(best, nextLegCount));
        queue.push({
          stop: nextStop,
          legs,
          usedRoutes: new Set([...cur.usedRoutes, r.id]),
          visitedStops: new Set([...cur.visitedStops, nextStop]),
        });
      }
    }
  }

  // Dedupe by route-sequence + transfer points.
  const seen = new Set<string>();
  const unique = results.filter((o) => {
    const key = o.legs.map((l) => `${l.route.id}:${l.fromIdx}-${l.toIdx}`).join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => {
    if (a.legs.length !== b.legs.length) return a.legs.length - b.legs.length;
    return a.totalStops - b.totalStops;
  });
  return unique.slice(0, 8);
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
    const ids = new Set(selected.legs.map((l) => l.route.id));
    return buses.filter((b) => ids.has(b.routeId));
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
