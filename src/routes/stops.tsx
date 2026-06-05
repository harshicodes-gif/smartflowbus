import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useEffect, useState, useCallback } from "react";
import { MapPin, Navigation, Building2, ChevronDown, Star } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useUserLocation } from "@/lib/hooks";
import { allStops, haversineKm, CITIES, type CityId } from "@/lib/buses";
import { translatePlace } from "@/lib/places";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  const { t, city, setCity, cityName, lang } = useI18n();
  const { coords } = useUserLocation();
  const { user } = useAuth();
  const [favs, setFavs] = useState<Record<string, string>>({}); // stop_name -> row id
  const [busy, setBusy] = useState<string | null>(null);

  const stops = useMemo(() => {
    const all = allStops(city);
    if (!coords) return all.map((s) => ({ ...s, distKm: 0 }));
    return all
      .map((s) => ({ ...s, distKm: haversineKm(coords, [s.lat, s.lng]) }))
      .sort((a, b) => a.distKm - b.distKm);
  }, [coords, city]);

  const loadFavs = useCallback(async () => {
    if (!user) { setFavs({}); return; }
    const { data } = await supabase
      .from("favorite_stops")
      .select("id,stop_name")
      .eq("city_id", city);
    const map: Record<string, string> = {};
    (data ?? []).forEach((r) => { map[r.stop_name] = r.id; });
    setFavs(map);
  }, [user, city]);

  useEffect(() => { void loadFavs(); }, [loadFavs]);

  const toggleFav = async (stopName: string) => {
    if (!user) { toast.error("Sign in to save favorites"); return; }
    setBusy(stopName);
    const existingId = favs[stopName];
    if (existingId) {
      const { error } = await supabase.from("favorite_stops").delete().eq("id", existingId);
      if (error) toast.error(error.message);
      else {
        setFavs((f) => { const n = { ...f }; delete n[stopName]; return n; });
        toast.success("Removed from favorites");
      }
    } else {
      const { data, error } = await supabase
        .from("favorite_stops")
        .insert({ user_id: user.id, city_id: city, stop_name: stopName })
        .select("id")
        .single();
      if (error) toast.error(error.message);
      else {
        setFavs((f) => ({ ...f, [stopName]: data!.id }));
        toast.success("Added to favorites");
      }
    }
    setBusy(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t("stops_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("stops_sub")} · {cityName(city)}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-fit gap-2">
              <Building2 className="h-4 w-4" />
              {cityName(city)}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
            {CITIES.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => setCity(c.id as CityId)}
                className={city === c.id ? "bg-accent font-medium" : ""}
              >
                {cityName(c.id as CityId)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {!user && (
        <Card className="mb-4 p-3 text-xs text-muted-foreground">
          <Link to="/auth" className="text-primary underline">Sign in</Link> to star stops and view them in your account.
        </Card>
      )}

      <div className="space-y-3">
        {stops.map((s) => {
          const walkMin = Math.max(1, Math.round((s.distKm / 4.5) * 60));
          const isFav = !!favs[s.name];
          return (
            <Card key={s.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{translatePlace(s.name, lang)}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Navigation className="h-3 w-3" />
                        {s.distKm.toFixed(2)} km
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={busy === s.name}
                        onClick={() => toggleFav(s.name)}
                        aria-label={isFav ? "Remove favorite" : "Add favorite"}
                        title={user ? (isFav ? "Remove favorite" : "Add to favorites") : "Sign in to save"}
                      >
                        <Star
                          className={`h-4 w-4 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      </Button>
                    </div>
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
