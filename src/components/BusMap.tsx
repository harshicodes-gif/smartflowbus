import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Marker, useMap } from "react-leaflet";
import { HYD_CENTER, ROUTES, type LiveBus } from "@/lib/buses";

// Custom div-icon bus marker with route number badge.
function busIcon(color: string, label: string, status: LiveBus["footboardStatus"]) {
  const ring =
    status === "danger" ? "#dc2626" : status === "warn" ? "#f59e0b" : "#10b981";
  return L.divIcon({
    className: "smartflow-bus-icon",
    html: `
      <div style="
        position: relative;
        display: flex; align-items: center; justify-content: center;
        width: 36px; height: 36px; border-radius: 50%;
        background: ${color}; color: white; font-weight: 700; font-size: 11px;
        border: 3px solid ${ring};
        box-shadow: 0 2px 10px rgba(0,0,0,0.25);
      ">${label}</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function FitToBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  const did = useRef(false);
  useEffect(() => {
    if (did.current || points.length === 0) return;
    did.current = true;
    map.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
  }, [map, points]);
  return null;
}

interface Props {
  buses: LiveBus[];
  height?: number | string;
  focusBusRouteId?: string | null;
  userLocation?: [number, number] | null;
  showAllRoutes?: boolean;
}

export function BusMap({ buses, height = 480, focusBusRouteId, userLocation, showAllRoutes = true }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-muted text-muted-foreground text-sm"
        style={{ height }}
      >
        Loading map…
      </div>
    );
  }

  const focused = focusBusRouteId ? buses.find((b) => b.routeId === focusBusRouteId) : null;
  const fitPoints: [number, number][] = focused
    ? (ROUTES.find((r) => r.id === focused.routeId)?.path ?? [])
    : buses.map((b) => [b.lat, b.lng]);

  return (
    <div className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]" style={{ height }}>
      <MapContainer center={HYD_CENTER} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToBounds points={fitPoints} />

        {showAllRoutes && ROUTES.map((r) => (
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

        {ROUTES.flatMap((r) =>
          r.stops.map((s) => (
            <CircleMarker
              key={`${r.id}-${s.id}`}
              center={[s.lat, s.lng]}
              radius={4}
              pathOptions={{ color: r.color, fillColor: "#fff", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-muted-foreground">Route {r.number}</div>
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
              <div className="text-xs space-y-1">
                <div className="font-semibold">Bus {b.number}</div>
                <div className="text-muted-foreground">{b.name}</div>
                <div>ETA: {b.etaMin} min · {b.speedKmh} km/h</div>
                <div>Passengers: {b.passengers}/{b.capacity}</div>
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
            <Popup>You are here</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
