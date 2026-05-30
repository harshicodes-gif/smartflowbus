import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n";
import { useLiveBuses } from "@/lib/hooks";
import { BusMap } from "@/components/BusMap";
import { getCity, CITIES, type CityId } from "@/lib/buses";
import { translatePlace } from "@/lib/places";
import { Bus, Users, Activity, AlertTriangle, Building2, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SmartFlow" },
      { name: "description", content: "Fleet-wide overview, occupancy and safety analytics for transport authorities." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t, city, setCity, cityName, lang } = useI18n();
  const buses = useLiveBuses(1500, city);

  const totalPassengers = buses.reduce((a, b) => a + b.passengers, 0);
  const avgOcc = buses.length
    ? Math.round((buses.reduce((a, b) => a + b.occupancy, 0) / buses.length) * 100)
    : 0;
  const alerts = buses.filter((b) => b.footboardStatus !== "safe").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t("admin_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("admin_sub")} · {cityName(city)}</p>
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

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Bus} label={t("total_buses")} value={buses.length} />
        <Kpi icon={Users} label={t("total_passengers")} value={totalPassengers} />
        <Kpi icon={Activity} label={t("avg_occupancy")} value={`${avgOcc}%`} />
        <Kpi icon={AlertTriangle} label={t("alerts_today")} value={alerts} tone={alerts > 0 ? "danger" : "default"} />
      </div>

      <div className="mb-6">
        <BusMap buses={buses} center={getCity(city).center} height={420} />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-3 text-sm font-semibold">{t("fleet")}</div>
        <div className="divide-y">
          {buses.map((b) => (
            <div key={b.routeId} className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-sm">
              <div className="col-span-2 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded font-bold text-white text-xs"
                  style={{ background: b.color }}
                >
                  {b.number}
                </div>
                <span className="truncate font-medium">{translatePlace(b.from, lang)}→{translatePlace(b.to, lang)}</span>
              </div>
              <div className="col-span-3 text-muted-foreground truncate">{t("next_stop")}: {translatePlace(b.nextStop, lang)}</div>
              <div className="col-span-3">
                <Progress value={b.occupancy * 100} />
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {b.passengers}/{b.capacity} · {b.speedKmh} km/h
              </div>
              <div className="col-span-2 text-right">
                <Badge
                  className={
                    b.footboardStatus === "safe"
                      ? "bg-success text-success-foreground"
                      : b.footboardStatus === "warn"
                        ? "bg-warning text-warning-foreground"
                        : "bg-danger text-danger-foreground"
                  }
                >
                  {b.footboardStatus === "safe"
                    ? t("status_safe")
                    : b.footboardStatus === "warn"
                      ? t("status_warn")
                      : t("status_danger")}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Kpi({
  icon: Icon, label, value, tone = "default",
}: { icon: typeof Bus; label: string; value: string | number; tone?: "default" | "danger" }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            tone === "danger" ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </Card>
  );
}
