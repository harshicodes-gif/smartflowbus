import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { LiveBus } from "@/lib/buses";
import { Users, Clock, Gauge, MapPin } from "lucide-react";

const crowdStyles: Record<LiveBus["crowd"], string> = {
  low: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-danger text-danger-foreground",
};

export function BusCard({
  bus,
  onSelect,
  selected,
}: {
  bus: LiveBus;
  onSelect?: (bus: LiveBus) => void;
  selected?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Card
      onClick={() => onSelect?.(bus)}
      className={`cursor-pointer p-4 transition-all hover:shadow-[var(--shadow-card)] ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white font-bold text-sm"
            style={{ background: bus.color }}
          >
            {bus.number}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{bus.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {bus.from} → {bus.to}
            </div>
          </div>
        </div>
        <Badge className={crowdStyles[bus.crowd]}>
          {bus.crowd === "low" ? "🟢" : bus.crowd === "medium" ? "🟡" : "🔴"}{" "}
          {t(`crowd_${bus.crowd}` as const)}
        </Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat icon={Clock} label={t("eta")} value={`${bus.etaMin} ${t("min")}`} />
        <Stat icon={Users} label={t("passengers")} value={`${bus.passengers}/${bus.capacity}`} />
        <Stat icon={Gauge} label={t("speed")} value={`${bus.speedKmh} km/h`} />
        <Stat icon={MapPin} label={t("next_stop")} value={bus.nextStop} />
      </div>
    </Card>
  );
}

function Stat({
  icon: Icon, label, value,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-xs font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
