// Simulated live bus data across major Indian cities.
// Each bus has a route polyline; positions are interpolated over time.

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface BusRoute {
  id: string;
  cityId: CityId;
  number: string;
  name: string;
  from: string;
  to: string;
  color: string;
  path: [number, number][];
  stops: BusStop[];
}

export type CityId =
  | "hyderabad" | "delhi" | "mumbai" | "bengaluru"
  | "chennai" | "kolkata" | "pune" | "ahmedabad";

export interface City {
  id: CityId;
  name: string;       // english display
  center: [number, number];
}

export const CITIES: City[] = [
  { id: "hyderabad", name: "Hyderabad", center: [17.4126, 78.4734] },
  { id: "delhi",     name: "Delhi",     center: [28.6139, 77.2090] },
  { id: "mumbai",    name: "Mumbai",    center: [19.0760, 72.8777] },
  { id: "bengaluru", name: "Bengaluru", center: [12.9716, 77.5946] },
  { id: "chennai",   name: "Chennai",   center: [13.0827, 80.2707] },
  { id: "kolkata",   name: "Kolkata",   center: [22.5726, 88.3639] },
  { id: "pune",      name: "Pune",      center: [18.5204, 73.8567] },
  { id: "ahmedabad", name: "Ahmedabad", center: [23.0225, 72.5714] },
];

export const HYD_CENTER: [number, number] = [17.4126, 78.4734];

function mk(
  cityId: CityId, id: string, number: string, from: string, to: string,
  color: string, stops: [string, number, number][],
): BusRoute {
  return {
    id, cityId, number, name: `${from} → ${to}`, from, to, color,
    path: stops.map(([, lat, lng]) => [lat, lng]),
    stops: stops.map(([name, lat, lng], i) => ({ id: `${id}-${i}`, name, lat, lng })),
  };
}

export const ROUTES: BusRoute[] = [
  // Hyderabad
  mk("hyderabad", "10H", "10H", "Secunderabad", "Charminar", "#2563eb", [
    ["Secunderabad Stn", 17.4399, 78.4983], ["Begumpet", 17.4239, 78.4738],
    ["Punjagutta", 17.4126, 78.4634], ["Abids", 17.4065, 78.4772],
    ["Charminar", 17.3616, 78.4747],
  ]),
  mk("hyderabad", "5K", "5K", "Koti", "KPHB Colony", "#dc2626", [
    ["Koti", 17.3850, 78.4867], ["Punjagutta", 17.4126, 78.4634],
    ["Ameerpet", 17.4399, 78.4483], ["Kukatpally", 17.4849, 78.3915],
    ["KPHB", 17.4948, 78.3996],
  ]),
  mk("hyderabad", "127K", "127K", "Hitech City", "LB Nagar", "#9333ea", [
    ["Hitech City", 17.4485, 78.3908], ["Ameerpet", 17.4399, 78.4483],
    ["Abids", 17.4065, 78.4772], ["Dilsukhnagar", 17.3713, 78.5267],
    ["LB Nagar", 17.3471, 78.5526],
  ]),

  // Delhi
  mk("delhi", "DTC-340", "340", "Connaught Place", "Dwarka", "#16a34a", [
    ["Connaught Pl", 28.6304, 77.2177], ["Karol Bagh", 28.6519, 77.1909],
    ["Rajouri Garden", 28.6469, 77.1200], ["Janakpuri", 28.6219, 77.0878],
    ["Dwarka Sec 21", 28.5520, 77.0588],
  ]),
  mk("delhi", "DTC-507", "507", "Kashmere Gate", "Saket", "#ea580c", [
    ["Kashmere Gate", 28.6675, 77.2284], ["ITO", 28.6289, 77.2410],
    ["AIIMS", 28.5672, 77.2100], ["Hauz Khas", 28.5494, 77.2001],
    ["Saket", 28.5245, 77.2066],
  ]),
  mk("delhi", "DTC-901", "901", "Anand Vihar", "Nehru Place", "#0891b2", [
    ["Anand Vihar", 28.6469, 77.3157], ["Laxmi Nagar", 28.6363, 77.2773],
    ["Pragati Maidan", 28.6147, 77.2436], ["Lajpat Nagar", 28.5677, 77.2436],
    ["Nehru Place", 28.5494, 77.2517],
  ]),

  // Mumbai
  mk("mumbai", "BEST-1", "1", "Colaba", "Bandra", "#2563eb", [
    ["Colaba", 18.9067, 72.8147], ["Churchgate", 18.9322, 72.8264],
    ["Worli", 19.0176, 72.8181], ["Mahim", 19.0410, 72.8398],
    ["Bandra Stn", 19.0544, 72.8401],
  ]),
  mk("mumbai", "BEST-422", "422", "Andheri", "Kurla", "#dc2626", [
    ["Andheri Stn", 19.1197, 72.8468], ["Vile Parle", 19.0996, 72.8444],
    ["Santacruz", 19.0810, 72.8400], ["Kalina", 19.0728, 72.8635],
    ["Kurla Stn", 19.0653, 72.8794],
  ]),
  mk("mumbai", "BEST-505", "505", "Borivali", "Dadar", "#9333ea", [
    ["Borivali", 19.2307, 72.8567], ["Kandivali", 19.2058, 72.8526],
    ["Goregaon", 19.1645, 72.8493], ["Bandra", 19.0596, 72.8295],
    ["Dadar", 19.0186, 72.8430],
  ]),

  // Bengaluru
  mk("bengaluru", "BMTC-500D", "500D", "Majestic", "Whitefield", "#16a34a", [
    ["Majestic", 12.9774, 77.5719], ["MG Road", 12.9755, 77.6064],
    ["Indiranagar", 12.9784, 77.6408], ["Marathahalli", 12.9591, 77.6974],
    ["Whitefield", 12.9698, 77.7500],
  ]),
  mk("bengaluru", "BMTC-201", "201", "Shivajinagar", "Electronic City", "#ea580c", [
    ["Shivajinagar", 12.9853, 77.6047], ["Richmond Cir", 12.9605, 77.5970],
    ["Jayanagar", 12.9250, 77.5938], ["Silk Board", 12.9176, 77.6233],
    ["Electronic City", 12.8456, 77.6603],
  ]),
  mk("bengaluru", "BMTC-335E", "335E", "KR Market", "Hebbal", "#0891b2", [
    ["KR Market", 12.9650, 77.5762], ["Mekhri Cir", 13.0156, 77.5860],
    ["Hebbal", 13.0359, 77.5970], ["Yelahanka", 13.1007, 77.5963],
    ["KIA", 13.1986, 77.7066],
  ]),

  // Chennai
  mk("chennai", "MTC-21G", "21G", "Broadway", "Tambaram", "#2563eb", [
    ["Broadway", 13.0925, 80.2868], ["Egmore", 13.0732, 80.2609],
    ["T Nagar", 13.0418, 80.2341], ["Guindy", 13.0067, 80.2206],
    ["Tambaram", 12.9249, 80.1000],
  ]),
  mk("chennai", "MTC-19B", "19B", "Saidapet", "Thiruvanmiyur", "#dc2626", [
    ["Saidapet", 13.0231, 80.2230], ["Nandanam", 13.0344, 80.2389],
    ["Adyar", 13.0067, 80.2563], ["Thiruvanmiyur", 12.9830, 80.2594],
    ["ECR", 12.9676, 80.2622],
  ]),
  mk("chennai", "MTC-29C", "29C", "CMBT", "Anna Nagar", "#9333ea", [
    ["CMBT", 13.0668, 80.2034], ["Koyambedu", 13.0673, 80.1947],
    ["Anna Nagar W", 13.0843, 80.2106], ["Anna Nagar E", 13.0850, 80.2200],
    ["Shenoy Nagar", 13.0816, 80.2347],
  ]),

  // Kolkata
  mk("kolkata", "WBTC-S5", "S5", "Howrah", "Garia", "#16a34a", [
    ["Howrah Stn", 22.5839, 88.3426], ["Esplanade", 22.5648, 88.3508],
    ["Park Street", 22.5536, 88.3506], ["Tollygunge", 22.4995, 88.3463],
    ["Garia", 22.4623, 88.3915],
  ]),
  mk("kolkata", "WBTC-AC23", "AC23", "Salt Lake", "Behala", "#ea580c", [
    ["Karunamoyee", 22.5779, 88.4097], ["Sealdah", 22.5675, 88.3722],
    ["Esplanade", 22.5648, 88.3508], ["Kalighat", 22.5197, 88.3434],
    ["Behala", 22.5037, 88.3133],
  ]),
  mk("kolkata", "WBTC-V1", "V1", "Ultadanga", "Babughat", "#0891b2", [
    ["Ultadanga", 22.5953, 88.3990], ["Maniktala", 22.5839, 88.3845],
    ["Sealdah", 22.5675, 88.3722], ["Esplanade", 22.5648, 88.3508],
    ["Babughat", 22.5644, 88.3438],
  ]),

  // Pune
  mk("pune", "PMPML-4", "4", "Pune Stn", "Hinjewadi", "#2563eb", [
    ["Pune Stn", 18.5285, 73.8745], ["Shivajinagar", 18.5308, 73.8478],
    ["University", 18.5530, 73.8253], ["Aundh", 18.5599, 73.8071],
    ["Hinjewadi", 18.5912, 73.7389],
  ]),
  mk("pune", "PMPML-128", "128", "Swargate", "Kothrud", "#dc2626", [
    ["Swargate", 18.5018, 73.8584], ["Tilak Rd", 18.5101, 73.8516],
    ["Deccan", 18.5159, 73.8410], ["Karve Nagar", 18.4960, 73.8129],
    ["Kothrud", 18.5074, 73.8077],
  ]),

  // Ahmedabad
  mk("ahmedabad", "AMTS-31", "31", "Lal Darwaja", "Vastrapur", "#9333ea", [
    ["Lal Darwaja", 23.0258, 72.5873], ["Ashram Road", 23.0309, 72.5704],
    ["Navrangpura", 23.0381, 72.5613], ["IIM", 23.0367, 72.5306],
    ["Vastrapur", 23.0382, 72.5263],
  ]),
  mk("ahmedabad", "AMTS-44", "44", "Maninagar", "Bopal", "#0891b2", [
    ["Maninagar", 22.9994, 72.6028], ["Kalupur", 23.0289, 72.6014],
    ["Paldi", 23.0125, 72.5613], ["Prahlad Nagar", 23.0066, 72.5061],
    ["Bopal", 23.0303, 72.4710],
  ]),
];

export interface LiveBus {
  routeId: string;
  cityId: CityId;
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
  occupancy: number;
  crowd: "low" | "medium" | "high";
  etaMin: number;
  nextStop: string;
  status: "on_route" | "delayed" | "arriving";
  footboardStatus: "safe" | "warn" | "danger";
}

function interpolate(path: [number, number][], t: number): [number, number] {
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]);
    segs.push(d); total += d;
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

const PHASES = [0, 0.18, 0.42, 0.61, 0.77, 0.33, 0.51, 0.09];

export function computeLiveBuses(now: number, cityId?: CityId): LiveBus[] {
  const routes = cityId ? ROUTES.filter((r) => r.cityId === cityId) : ROUTES;
  return routes.map((r, idx) => {
    const periodMs = 180_000;
    const t = ((now / periodMs + PHASES[idx % PHASES.length]) % 1);
    const [lat, lng] = interpolate(r.path, t);
    const capacity = 50;
    const occRaw = 0.4 + 0.45 * Math.sin(now / 30_000 + idx * 1.3);
    const occupancy = Math.max(0.08, Math.min(0.98, occRaw));
    const passengers = Math.round(occupancy * capacity);
    const crowd = occupancy < 0.45 ? "low" : occupancy < 0.75 ? "medium" : "high";
    const speedKmh = 22 + Math.round(18 * Math.abs(Math.sin(now / 15_000 + idx)));
    const etaMin = Math.max(1, Math.round((1 - t) * 18));
    const stopIdx = Math.min(r.stops.length - 1, Math.floor(t * r.stops.length) + 1);
    const nextStop = r.stops[stopIdx]?.name ?? r.stops[r.stops.length - 1].name;
    const status: LiveBus["status"] =
      etaMin <= 2 ? "arriving" : speedKmh < 25 ? "delayed" : "on_route";
    const footboardStatus: LiveBus["footboardStatus"] =
      occupancy > 0.92 ? "danger" : occupancy > 0.8 ? "warn" : "safe";
    return {
      routeId: r.id, cityId: r.cityId, number: r.number, name: r.name,
      from: r.from, to: r.to, color: r.color, lat, lng, speedKmh,
      passengers, capacity, occupancy, crowd, etaMin, nextStop, status, footboardStatus,
    };
  });
}

export function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]); const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function allStops(cityId?: CityId): (BusStop & { routes: string[]; cityId: CityId })[] {
  const map = new Map<string, BusStop & { routes: string[]; cityId: CityId }>();
  const routes = cityId ? ROUTES.filter((r) => r.cityId === cityId) : ROUTES;
  for (const r of routes) {
    for (const s of r.stops) {
      const key = `${r.cityId}:${s.lat.toFixed(4)},${s.lng.toFixed(4)}`;
      if (!map.has(key)) map.set(key, { ...s, routes: [r.number], cityId: r.cityId });
      else map.get(key)!.routes.push(r.number);
    }
  }
  return [...map.values()];
}

export function getCity(id: CityId): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}
