// Simulated live bus data for Hyderabad.
// Each bus has a route polyline; we interpolate its GPS position over time.

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface BusRoute {
  id: string;          // e.g. "10H"
  number: string;
  name: string;        // "Secunderabad → Charminar"
  from: string;
  to: string;
  color: string;
  path: [number, number][]; // [lat, lng]
  stops: BusStop[];
}

// Hyderabad approximate coordinates of real landmarks.
export const ROUTES: BusRoute[] = [
  {
    id: "10H",
    number: "10H",
    name: "Secunderabad → Charminar",
    from: "Secunderabad",
    to: "Charminar",
    color: "#2563eb",
    path: [
      [17.4399, 78.4983], // Secunderabad
      [17.4239, 78.4738], // Begumpet
      [17.4126, 78.4634], // Punjagutta
      [17.4065, 78.4772], // Abids
      [17.3850, 78.4867], // Hyderabad Central
      [17.3616, 78.4747], // Charminar
    ],
    stops: [
      { id: "s1", name: "Secunderabad Stn", lat: 17.4399, lng: 78.4983 },
      { id: "s2", name: "Begumpet", lat: 17.4239, lng: 78.4738 },
      { id: "s3", name: "Punjagutta", lat: 17.4126, lng: 78.4634 },
      { id: "s4", name: "Abids", lat: 17.4065, lng: 78.4772 },
      { id: "s5", name: "Charminar", lat: 17.3616, lng: 78.4747 },
    ],
  },
  {
    id: "5K",
    number: "5K",
    name: "Koti → KPHB",
    from: "Koti",
    to: "KPHB Colony",
    color: "#dc2626",
    path: [
      [17.3850, 78.4867], // Koti
      [17.4126, 78.4634], // Punjagutta
      [17.4399, 78.4483], // Ameerpet
      [17.4849, 78.3915], // Kukatpally
      [17.4948, 78.3996], // KPHB
    ],
    stops: [
      { id: "k1", name: "Koti", lat: 17.3850, lng: 78.4867 },
      { id: "k2", name: "Punjagutta", lat: 17.4126, lng: 78.4634 },
      { id: "k3", name: "Ameerpet", lat: 17.4399, lng: 78.4483 },
      { id: "k4", name: "Kukatpally", lat: 17.4849, lng: 78.3915 },
      { id: "k5", name: "KPHB Colony", lat: 17.4948, lng: 78.3996 },
    ],
  },
  {
    id: "49M",
    number: "49M",
    name: "Mehdipatnam → Uppal",
    from: "Mehdipatnam",
    to: "Uppal",
    color: "#16a34a",
    path: [
      [17.3953, 78.4392], // Mehdipatnam
      [17.4065, 78.4772], // Abids
      [17.4239, 78.4738], // Begumpet
      [17.4126, 78.5300], // Tarnaka
      [17.4055, 78.5610], // Uppal
    ],
    stops: [
      { id: "m1", name: "Mehdipatnam", lat: 17.3953, lng: 78.4392 },
      { id: "m2", name: "Lakdikapul", lat: 17.4022, lng: 78.4615 },
      { id: "m3", name: "Begumpet", lat: 17.4239, lng: 78.4738 },
      { id: "m4", name: "Tarnaka", lat: 17.4126, lng: 78.5300 },
      { id: "m5", name: "Uppal", lat: 17.4055, lng: 78.5610 },
    ],
  },
  {
    id: "127K",
    number: "127K",
    name: "Hitech City → LB Nagar",
    from: "Hitech City",
    to: "LB Nagar",
    color: "#9333ea",
    path: [
      [17.4485, 78.3908], // Hitech City
      [17.4399, 78.4483], // Ameerpet
      [17.4065, 78.4772], // Abids
      [17.3713, 78.5267], // Dilsukhnagar
      [17.3471, 78.5526], // LB Nagar
    ],
    stops: [
      { id: "h1", name: "Hitech City", lat: 17.4485, lng: 78.3908 },
      { id: "h2", name: "Ameerpet", lat: 17.4399, lng: 78.4483 },
      { id: "h3", name: "Abids", lat: 17.4065, lng: 78.4772 },
      { id: "h4", name: "Dilsukhnagar", lat: 17.3713, lng: 78.5267 },
      { id: "h5", name: "LB Nagar", lat: 17.3471, lng: 78.5526 },
    ],
  },
  {
    id: "290U",
    number: "290U",
    name: "Gachibowli → Secunderabad",
    from: "Gachibowli",
    to: "Secunderabad",
    color: "#ea580c",
    path: [
      [17.4401, 78.3489], // Gachibowli
      [17.4485, 78.3908], // Hitech City
      [17.4399, 78.4483], // Ameerpet
      [17.4239, 78.4738], // Begumpet
      [17.4399, 78.4983], // Secunderabad
    ],
    stops: [
      { id: "g1", name: "Gachibowli", lat: 17.4401, lng: 78.3489 },
      { id: "g2", name: "Hitech City", lat: 17.4485, lng: 78.3908 },
      { id: "g3", name: "Ameerpet", lat: 17.4399, lng: 78.4483 },
      { id: "g4", name: "Begumpet", lat: 17.4239, lng: 78.4738 },
      { id: "g5", name: "Secunderabad Stn", lat: 17.4399, lng: 78.4983 },
    ],
  },
  {
    id: "8A",
    number: "8A",
    name: "Afzalgunj → ECIL",
    from: "Afzalgunj",
    to: "ECIL",
    color: "#0891b2",
    path: [
      [17.3760, 78.4738], // Afzalgunj
      [17.4065, 78.4772], // Abids
      [17.4399, 78.4983], // Secunderabad
      [17.4664, 78.5510], // Malkajgiri
      [17.4720, 78.5701], // ECIL
    ],
    stops: [
      { id: "a1", name: "Afzalgunj", lat: 17.3760, lng: 78.4738 },
      { id: "a2", name: "Koti", lat: 17.3850, lng: 78.4867 },
      { id: "a3", name: "Secunderabad", lat: 17.4399, lng: 78.4983 },
      { id: "a4", name: "Malkajgiri", lat: 17.4664, lng: 78.5510 },
      { id: "a5", name: "ECIL", lat: 17.4720, lng: 78.5701 },
    ],
  },
];

export interface LiveBus {
  routeId: string;
  number: string;
  name: string;
  from: string;
  to: string;
  color: string;
  lat: number;
  lng: number;
  speedKmh: number;
  passengers: number;
  capacity: number;
  occupancy: number; // 0..1
  crowd: "low" | "medium" | "high";
  etaMin: number;
  nextStop: string;
  status: "on_route" | "delayed" | "arriving";
  footboardStatus: "safe" | "warn" | "danger";
}

function interpolate(path: [number, number][], t: number): [number, number] {
  // t in [0,1) along total path length
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1][0] - path[i][0];
    const dy = path[i + 1][1] - path[i][1];
    const d = Math.hypot(dx, dy);
    segs.push(d);
    total += d;
  }
  let dist = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i]) {
      const f = segs[i] === 0 ? 0 : dist / segs[i];
      return [
        path[i][0] + (path[i + 1][0] - path[i][0]) * f,
        path[i][1] + (path[i + 1][1] - path[i][1]) * f,
      ];
    }
    dist -= segs[i];
  }
  return path[path.length - 1];
}

// Per-route phase offset so buses don't all start at origin.
const PHASES = [0, 0.18, 0.42, 0.61, 0.77, 0.33];

export function computeLiveBuses(now: number): LiveBus[] {
  return ROUTES.map((r, idx) => {
    const periodMs = 180_000; // 3 minutes to traverse the route in sim
    const t = ((now / periodMs + PHASES[idx % PHASES.length]) % 1);
    const [lat, lng] = interpolate(r.path, t);
    const capacity = 50;
    // Simulated passenger count (varies sinusoidally with time/route).
    const occRaw = 0.4 + 0.45 * Math.sin(now / 30_000 + idx * 1.3);
    const occupancy = Math.max(0.08, Math.min(0.98, occRaw));
    const passengers = Math.round(occupancy * capacity);
    const crowd = occupancy < 0.45 ? "low" : occupancy < 0.75 ? "medium" : "high";
    const speedKmh = 22 + Math.round(18 * Math.abs(Math.sin(now / 15_000 + idx)));
    const etaMin = Math.max(1, Math.round((1 - t) * 18));
    // Pick next stop by progress.
    const stopIdx = Math.min(
      r.stops.length - 1,
      Math.floor(t * r.stops.length) + 1,
    );
    const nextStop = r.stops[stopIdx]?.name ?? r.stops[r.stops.length - 1].name;
    const status: LiveBus["status"] =
      etaMin <= 2 ? "arriving" : speedKmh < 25 ? "delayed" : "on_route";
    // Footboard safety derived from occupancy.
    const footboardStatus: LiveBus["footboardStatus"] =
      occupancy > 0.92 ? "danger" : occupancy > 0.8 ? "warn" : "safe";
    return {
      routeId: r.id, number: r.number, name: r.name, from: r.from, to: r.to,
      color: r.color, lat, lng, speedKmh, passengers, capacity, occupancy,
      crowd, etaMin, nextStop, status, footboardStatus,
    };
  });
}


// Hyderabad center for the default map view.
export const HYD_CENTER: [number, number] = [17.4126, 78.4734];

export function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]); const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function allStops(): (BusStop & { routes: string[] })[] {
  const map = new Map<string, BusStop & { routes: string[] }>();
  for (const r of ROUTES) {
    for (const s of r.stops) {
      const key = `${s.lat.toFixed(4)},${s.lng.toFixed(4)}`;
      if (!map.has(key)) map.set(key, { ...s, routes: [r.number] });
      else map.get(key)!.routes.push(r.number);
    }
  }
  return [...map.values()];
}
