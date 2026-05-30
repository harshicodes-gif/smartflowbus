import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useUserLocation } from "@/lib/hooks";
import { allStops, haversineKm } from "@/lib/buses";
import { translatePlace } from "@/lib/places";

export const Route = createFileRoute("/stops")({
  head: () => ({
    meta: [
      { title: "Nearest Bus Stops — SmartFlow" },
      { name: "description", content: "Find bus stops near you with walking distance and routes." },
    ],
  }),
  component: StopsPage,
});

function StopsPage() {
  const { t, city, cityName } = useI18n();
  const { coords } = useUserLocation();
  const stops = useMemo(() => {
    const all = allStops(city);
    if (!coords) return all.map((s) => ({ ...s, distKm: 0 }));
    return all
      .map((s) => ({ ...s, distKm: haversineKm(coords, [s.lat, s.lng]) }))
      .sort((a, b) => a.distKm - b.distKm);
  }, [coords, city]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("stops_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("stops_sub")} · {cityName(city)}</p>
      </header>

      <div className="space-y-3">
        {stops.map((s) => {
          const walkMin = Math.max(1, Math.round((s.distKm / 4.5) * 60));
          return (
            <Card key={s.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{s.name}</h3>
                    <Badge variant="outline" className="gap-1">
                      <Navigation className="h-3 w-3" />
                      {s.distKm.toFixed(2)} km
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("distance")}: ~{walkMin} {t("min")} {t("walk")}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.routes.map((r) => (
                      <Badge key={r} variant="secondary" className="font-mono">{r}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
