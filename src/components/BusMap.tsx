import { useEffect, useRef, useState } from "react";
import { ROUTES, type LiveBus } from "@/lib/buses";
import { useI18n } from "@/lib/i18n";
import { translatePlace, translateRouteLabel } from "@/lib/places";

interface Props {
  buses: LiveBus[];
  height?: number | string;
  focusBusRouteId?: string | null;
  userLocation?: [number, number] | null;
  showAllRoutes?: boolean;
  center?: [number, number];
}

type LeafletMods = {
  L: typeof import("leaflet");
  RL: typeof import("react-leaflet");
} | null;

export function BusMap(props: Props) {
  const { t } = useI18n();
  const [mods, setMods] = useState<LeafletMods>(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all([import("leaflet"), import("react-leaflet")]).then(([L, RL]) => {
      if (!cancelled) setMods({ L: L.default ?? L, RL });
    });
    return () => { cancelled = true; };
  }, []);

  if (!mods) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-muted text-muted-foreground text-sm"
        style={{ height: props.height ?? 480 }}
      >
        {t("loading_map")}
      </div>
    );
  }
  return <BusMapInner {...props} L={mods.L} RL={mods.RL} />;
}

function BusMapInner({
  buses, height = 480, focusBusRouteId, userLocation, showAllRoutes = true,
  center, L, RL,
}: Props & { L: typeof import("leaflet"); RL: typeof import("react-leaflet") }) {
  const { t, lang } = useI18n();
  const { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Marker, useMap } = RL;

  // Restrict drawn routes to ones present in the visible bus set (city scope).
  const visibleRouteIds = new Set(buses.map((b) => b.routeId));
  const visibleRoutes = ROUTES.filter((r) => visibleRouteIds.has(r.id));

  function busIcon(color: string, label: string, status: LiveBus["footboardStatus"]) {
    const ring = status === "danger" ? "#dc2626" : status === "warn" ? "#f59e0b" : "#10b981";
    return L.divIcon({
      className: "smartflow-bus-icon",
      html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:${color};color:white;font-weight:700;font-size:11px;border:3px solid ${ring};box-shadow:0 2px 10px rgba(0,0,0,0.25);">${label}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }

  function FitToBounds({ points, boundsKey }: { points: [number, number][]; boundsKey: string }) {
    const map = useMap();
    const lastKey = useRef<string>("");
    useEffect(() => {
      if (points.length === 0 || lastKey.current === boundsKey) return;
      lastKey.current = boundsKey;
      map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    }, [map, boundsKey, points]);
    return null;
  }

  const focused = focusBusRouteId ? buses.find((b) => b.routeId === focusBusRouteId) : null;
  const fitPoints: [number, number][] = focused
    ? (visibleRoutes.find((r) => r.id === focused.routeId)?.path ?? [])
    : buses.map((b) => [b.lat, b.lng]);
  const fitKey = focused ? focused.routeId : visibleRoutes.map((r) => r.id).join("-");

  const initialCenter: [number, number] = center ?? (buses[0] ? [buses[0].lat, buses[0].lng] : [20.5937, 78.9629]);

  return (
    <div className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]" style={{ height }}>
      <MapContainer center={initialCenter} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToBounds points={fitPoints} boundsKey={fitKey} />

        {showAllRoutes && visibleRoutes.map((r) => (
          <Polyline
            key={r.id}
            positions={r.path}
            pathOptions={{
              color: r.color,
              weight: focused && focused.routeId !== r.id ? 2 : 4,
              opacity: focused && focused.routeId !== r.id ? 0.25 : 0.7,
            }}
          />
        ))}

        {visibleRoutes.flatMap((r) =>
          r.stops.map((s) => (
            <CircleMarker
              key={`${r.id}-${s.id}`}
              center={[s.lat, s.lng]}
              radius={4}
              pathOptions={{ color: r.color, fillColor: "#fff", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{translatePlace(s.name, lang)}</div>
                  <div style={{ opacity: 0.7 }}>{t("route")} {r.number}</div>
                </div>
              </Popup>
            </CircleMarker>
          )),
        )}

        {buses.map((b) => (
          <Marker
            key={b.routeId}
            position={[b.lat, b.lng]}
            icon={busIcon(b.color, b.number, b.footboardStatus)}
          >
            <Popup>
              <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600 }}>{t("bus")} {b.number}</div>
                <div style={{ opacity: 0.7 }}>{b.name}</div>
                <div>{t("eta")}: {b.etaMin} {t("min")} · {b.speedKmh} km/h</div>
                <div>{t("passengers")}: {b.passengers}/{b.capacity}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={8}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.8, weight: 2 }}
          >
            <Popup>{t("you_are_here")}</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
