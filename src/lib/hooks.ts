import { useEffect, useState } from "react";
import { computeLiveBuses, type CityId, type LiveBus } from "./buses";

export function useLiveBuses(intervalMs = 1500, cityId?: CityId): LiveBus[] {
  const [buses, setBuses] = useState<LiveBus[]>(() => computeLiveBuses(Date.now(), cityId));
  useEffect(() => {
    setBuses(computeLiveBuses(Date.now(), cityId));
    const id = setInterval(() => setBuses(computeLiveBuses(Date.now(), cityId)), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, cityId]);
  return buses;
}

export function useUserLocation(): { coords: [number, number] | null; error: string | null } {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCoords([17.4126, 78.4734]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
      () => {
        setError("permission_denied");
        setCoords([17.4126, 78.4734]);
      },
      { enableHighAccuracy: true, timeout: 6000 },
    );
  }, []);
  return { coords, error };
}
