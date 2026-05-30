import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Bus, MapPin, Shield, Globe, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useLiveBuses, useUserLocation } from "@/lib/hooks";
import { getCity } from "@/lib/buses";
import { BusMap } from "@/components/BusMap";
import { BusCard } from "@/components/BusCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartFlow — Live Bus Tracking across India" },
      { name: "description", content: "Track city buses across India in real time, see crowd levels, find the nearest stop, and travel safely — in 9 Indian languages." },
      { property: "og:title", content: "SmartFlow — Live Bus Tracking" },
      { property: "og:description", content: "Real-time GPS, crowd insight and footboard safety — in your language." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, city, cityName } = useI18n();
  const buses = useLiveBuses(1500, city);
  const { coords } = useUserLocation();
  const [query, setQuery] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const cityCenter = getCity(city).center;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buses;
    return buses.filter((b) =>
      b.number.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.from.toLowerCase().includes(q) ||
      b.to.toLowerCase().includes(q) ||
      b.nextStop.toLowerCase().includes(q),
    );
  }, [buses, query]);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Badge className="mb-4 bg-white/15 text-white hover:bg-white/15">
            <span className="relative mr-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            {t("live")} — {cityName(city)}
          </Badge>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">{t("hero_title")}</h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 md:text-lg">{t("hero_sub")}</p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex max-w-2xl items-center gap-2 rounded-xl bg-white p-2 shadow-lg"
          >
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="border-0 text-foreground shadow-none focus-visible:ring-0"
            />
            <Button type="submit">{t("search_button")}</Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link to="/tracking">
                <Bus className="mr-2 h-4 w-4" /> {t("cta_track")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link to="/stops">
                <MapPin className="mr-2 h-4 w-4" /> {t("cta_stops")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live map + search results */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">{t("nearby_buses")} — {cityName(city)}</h2>
            <p className="text-sm text-muted-foreground">{t("tracking_sub")}</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            {t("live")}
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BusMap
              buses={filtered}
              userLocation={coords}
              focusBusRouteId={selectedRouteId}
              center={cityCenter}
              height={520}
            />
          </div>
          <div className="space-y-3 lg:col-span-2">
            {filtered.length === 0 ? (
              <Card className="p-8 text-center text-sm text-muted-foreground">
                {t("no_results")}
              </Card>
            ) : (
              filtered.map((b) => (
                <BusCard
                  key={b.routeId}
                  bus={b}
                  selected={selectedRouteId === b.routeId}
                  onSelect={(x) =>
                    setSelectedRouteId(selectedRouteId === x.routeId ? null : x.routeId)
                  }
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Bus, k: "feature_track" },
            { icon: MapPin, k: "feature_crowd" },
            { icon: Shield, k: "feature_safety" },
            { icon: Globe, k: "feature_multi" },
          ].map(({ icon: Icon, k }) => (
            <Card key={k} className="p-5">
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{t(k as never)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`${k}_d` as never)}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link to="/admin">
              {t("explore_admin")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
