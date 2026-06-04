import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Bookmark, Star, Trash2, LogOut, ArrowRight, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { translatePlace } from "@/lib/places";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My account — SmartFlow" }] }),
  component: AccountPage,
});

type Trip = {
  id: string;
  city_id: string;
  label: string | null;
  from_stop: string;
  to_stop: string;
  created_at: string;
};
type Fav = { id: string; city_id: string; stop_name: string };

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { lang, cityName } = useI18n();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [favs, setFavs] = useState<Fav[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    const [{ data: t }, { data: f }] = await Promise.all([
      supabase.from("saved_trips").select("id,city_id,label,from_stop,to_stop,created_at").order("created_at", { ascending: false }),
      supabase.from("favorite_stops").select("id,city_id,stop_name").order("created_at", { ascending: false }),
    ]);
    setTrips((t as Trip[]) ?? []);
    setFavs((f as Fav[]) ?? []);
    setBusy(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("saved_trips").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setTrips((t) => t.filter((x) => x.id !== id)); toast.success("Trip removed"); }
  };
  const deleteFav = async (id: string) => {
    const { error } = await supabase.from("favorite_stops").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setFavs((f) => f.filter((x) => x.id !== id)); toast.success("Removed"); }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.email}</h1>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </header>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Bookmark className="h-4 w-4" /> Saved trips
        </h2>
        {busy ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">Loading…</Card>
        ) : trips.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            No saved trips yet. <Link to="/planner" className="text-primary underline">Plan a trip</Link> and tap Save.
          </Card>
        ) : (
          <div className="space-y-2">
            {trips.map((tr) => (
              <Card key={tr.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  {tr.label && <div className="text-sm font-semibold">{tr.label}</div>}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{translatePlace(tr.from_stop, lang)}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{translatePlace(tr.to_stop, lang)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{cityName(tr.city_id as never)}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(tr.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTrip(tr.id)} aria-label="Delete trip">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Star className="h-4 w-4" /> Favorite stops
        </h2>
        {busy ? null : favs.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Star stops from the <Link to="/stops" className="text-primary underline">Nearby Stops</Link> page to save them.
          </Card>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {favs.map((f) => (
              <Card key={f.id} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{translatePlace(f.stop_name, lang)}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">{cityName(f.city_id as never)}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteFav(f.id)} aria-label="Remove favorite">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
