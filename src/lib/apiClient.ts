const API_BASE = "/api";

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${method} ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
};

export interface FuelTrip {
  id: string; name: string; distance: number; unit: "km" | "mile";
  efficiency: number; pricePerLiter: number; cost: number; liters: number;
  timestamp: number; createdBy?: string | null; updatedBy?: string | null;
}
export interface FuelPrice {
  id: string; priceMmk: number; note: string | null;
  recordedBy: string | null; recordedAt: string;
}

export const fuelApi = {
  getTrips: () => api.get<FuelTrip[]>("/fuel/trips"),
  addTrip: (trip: FuelTrip) => api.post<FuelTrip>("/fuel/trips", trip),
  updateTrip: (id: string, trip: FuelTrip) => api.put<FuelTrip>(`/fuel/trips/${id}`, trip),
  deleteTrip: (id: string) => api.del<{ ok: boolean }>(`/fuel/trips/${id}`),
  getPrices: () => api.get<FuelPrice[]>("/fuel/prices"),
  addPrice: (p: { id: string; priceMmk: number; note?: string }) => api.post<FuelPrice>("/fuel/prices", p),
  deletePrice: (id: string) => api.del<{ ok: boolean }>(`/fuel/prices/${id}`),
};

export interface BatteryReading {
  id: string; voltage: number; pct: number; alert: string; ts: string;
  recordedBy?: string | null;
}
export const batteryApi = {
  getReadings: () => api.get<BatteryReading[]>("/battery/readings"),
  addReading: (r: BatteryReading) => api.post<BatteryReading>("/battery/readings", r),
  deleteReading: (id: string) => api.del<{ ok: boolean }>(`/battery/readings/${id}`),
};

export const homeSolarApi = {
  getReadings: () => api.get<BatteryReading[]>("/home-solar/readings"),
  addReading: (r: BatteryReading) => api.post<BatteryReading>("/home-solar/readings", r),
  deleteReading: (id: string) => api.del<{ ok: boolean }>(`/home-solar/readings/${id}`),
};
