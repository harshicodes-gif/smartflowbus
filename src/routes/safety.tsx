import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, AlertOctagon, Volume2, Building2, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLiveBuses } from "@/lib/hooks";
import { CITIES, type CityId } from "@/lib/buses";
import type { LiveBus } from "@/lib/buses";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Footboard Safety — SmartFlow" },
      { name: "description", content: "Live IoT monitoring of bus doors and footboards to prevent accidents." },
    ],
  }),
  component: SafetyPage,
});

const statusStyles: Record<LiveBus["footboardStatus"], { bg: string; label: string; icon: typeof Shield }> = {
  safe: { bg: "bg-success text-success-foreground", label: "status_safe", icon: Shield },
  warn: { bg: "bg-warning text-warning-foreground", label: "status_warn", icon: AlertTriangle },
  danger: { bg: "bg-danger text-danger-foreground", label: "status_danger", icon: AlertOctagon },
};

function SafetyPage() {
  const { t, city, cityName } = useI18n();
  const buses = useLiveBuses(1200, city);
  const danger = buses.filter((b) => b.footboardStatus === "danger").length;
  const warn = buses.filter((b) => b.footboardStatus === "warn").length;
  const safe = buses.filter((b) => b.footboardStatus === "safe").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{t("safety_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("safety_sub")} · {cityName(city)}</p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Summary color="bg-success/10 text-success" label={t("status_safe")} value={safe} icon={Shield} />
        <Summary color="bg-warning/10 text-warning" label={t("status_warn")} value={warn} icon={AlertTriangle} />
        <Summary color="bg-danger/10 text-danger" label={t("status_danger")} value={danger} icon={AlertOctagon} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {buses.map((b) => {
          const s = statusStyles[b.footboardStatus];
          const Icon = s.icon;
          return (
            <Card key={b.routeId} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white text-sm"
                    style={{ background: b.color }}
                  >
                    {b.number}
                  </div>
                  <div>
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.from} → {b.to}</div>
                  </div>
                </div>
                <Badge className={s.bg}>
                  <Icon className="mr-1 h-3 w-3" /> {t(s.label as never)}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("passengers")}: {b.passengers}/{b.capacity}
                  </span>
                  <span className="font-medium">{Math.round(b.occupancy * 100)}%</span>
                </div>
                <Progress value={b.occupancy * 100} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={`rounded-md border px-2 py-1.5 ${b.footboardStatus !== "safe" ? "border-warning bg-warning/10" : ""}`}>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Volume2 className="h-3 w-3" /> {t("buzzer")}
                  </div>
                  <div className="font-medium">
                    {b.footboardStatus === "safe" ? t("status_off") : t("status_on")}
                  </div>
                </div>
                <div className={`rounded-md border px-2 py-1.5 ${b.footboardStatus === "danger" ? "border-danger bg-danger/10" : ""}`}>
                  <div className="text-muted-foreground">{t("motion")}</div>
                  <div className="font-medium">
                    {b.footboardStatus === "danger" ? t("status_restricted") : `${b.speedKmh} km/h`}
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

function Summary({
  color, label, value, icon: Icon,
}: { color: string; label: string; value: number; icon: typeof Shield }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </Card>
  );
}
