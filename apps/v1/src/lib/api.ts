// Locally every backend call goes through Vite's `/api` proxy (see
// vite.config.ts), so the page is same-origin with its API and needs no CORS
// entry on the server — whatever port this app is started on. Static hosts with
// no proxy (GitHub Pages) set VITE_API_BASE_URL to the backend's own origin,
// which must then allow this site's origin via CORS.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/+$/,
  "",
);

export type Query = Record<string, string | number | undefined>;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    path: string,
  ) {
    super(`${path} ${status}`);
  }
}

export async function apiGet<T>(path: string, query: Query = {}): Promise<T> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const qs = params.toString();
  const res = await fetch(`${API_BASE}${path}${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new ApiError(res.status, path);
  return (await res.json()) as T;
}
