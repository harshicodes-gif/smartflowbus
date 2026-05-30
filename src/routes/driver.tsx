import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n";
import { useLiveBuses } from "@/lib/hooks";
import { translatePlace, translateRouteLabel } from "@/lib/places";
import { Bus, Users, Gauge, MapPin, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/driver")({
  head: () => ({
    meta: [
      { title: "Driver Dashboard — SmartFlow" },
      { name: "description", content: "Live status of your bus: passengers, crowd, footboard safety." },
    ],
  }),
  component: DriverPage,
});

function DriverPage() {
  const { t, city, lang } = useI18n();
  const buses = useLiveBuses(1200, city);
  const bus = buses[0];
  if (!bus) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{t("driver_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("driver_sub")}</p>
        </div>
        <Badge style={{ background: bus.color }} className="text-white">
          {t("bus")} {bus.number}
        </Badge>
      </header>

      <Card className="mb-6 overflow-hidden">
        <div className="p-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <div className="text-sm opacity-80">{t("route")}</div>
          <div className="text-2xl font-semibold">{bus.name}</div>
          <div className="mt-1 text-sm opacity-80">{t("next_stop")}: {bus.nextStop} · {bus.etaMin} {t("min")}</div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <Stat icon={Users} label={t("passengers")} value={`${bus.passengers}/${bus.capacity}`} />
          <Stat icon={Gauge} label={t("speed")} value={`${bus.speedKmh} km/h`} />
          <Stat icon={MapPin} label={t("eta")} value={`${bus.etaMin} ${t("min")}`} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 font-semibold">{t("crowd")}</h3>
          <Progress value={bus.occupancy * 100} />
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-muted-foreground">0</span>
            <span className="font-medium">{Math.round(bus.occupancy * 100)}%</span>
            <span className="text-muted-foreground">{bus.capacity}</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {t("safety_title")}
          </h3>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white text-xs ${
                bus.footboardStatus === "safe"
                  ? "bg-success"
                  : bus.footboardStatus === "warn"
                    ? "bg-warning"
                    : "bg-danger animate-pulse"
              }`}
            >
              {bus.footboardStatus === "safe" ? t("status_ok") : bus.footboardStatus === "warn" ? "⚠" : "!"}
            </div>
            <div>
              <div className="text-sm font-medium">
                {bus.footboardStatus === "safe"
                  ? t("status_safe")
                  : bus.footboardStatus === "warn"
                    ? t("status_warn")
                    : t("status_danger")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("buzzer")}: {bus.footboardStatus === "safe" ? t("status_off") : t("status_on")} · {t("motion")}:{" "}
                {bus.footboardStatus === "danger" ? t("status_restricted") : t("status_normal")}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon, label, value,
}: { icon: typeof Bus; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
