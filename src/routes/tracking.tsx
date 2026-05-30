import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useLiveBuses, useUserLocation } from "@/lib/hooks";
import { BusMap } from "@/components/BusMap";
import { BusCard } from "@/components/BusCard";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Live Bus Tracking — SmartFlow" },
      { name: "description", content: "Live GPS positions of Hyderabad city buses, updated every second." },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const { t } = useI18n();
  const buses = useLiveBuses(1200);
  const { coords } = useUserLocation();
  const [query, setQuery] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return buses;
    return buses.filter((b) =>
      [b.number, b.name, b.from, b.to, b.nextStop].some((s) => s.toLowerCase().includes(q)),
    );
  }, [buses, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("tracking_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("tracking_sub")}</p>
      </header>

      <div className="mb-4 flex items-center gap-2 rounded-xl border bg-card p-2">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="border-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BusMap
            buses={filtered}
            userLocation={coords}
            focusBusRouteId={selectedRouteId}
            height={560}
          />
        </div>
        <div className="space-y-3 lg:col-span-2">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">{t("no_results")}</Card>
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
    </div>
  );
}
