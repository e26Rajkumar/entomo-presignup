import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./api";

export interface GeoCountryLevel {
  level: number;
  label: string;
}

export interface GeoCountry {
  code: string;
  cca3: string;
  name: string;
  levels: GeoCountryLevel[];
}

export function usePublicGeoCountries() {
  return useQuery({
    queryKey: ["geo", "countries"],
    queryFn: async () =>
      (await apiGet<{ countries: GeoCountry[] }>("/public/geo/countries"))
        .countries,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

function normalizeCountryName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveTenantCountry(
  countries: GeoCountry[],
  tenantCountryName: string | null | undefined,
): GeoCountry | undefined {
  if (!tenantCountryName) return undefined;
  const normalized = normalizeCountryName(tenantCountryName);
  return countries.find((c) => normalizeCountryName(c.name) === normalized);
}
