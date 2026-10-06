import { useQuery } from "@tanstack/react-query";
import { type Query, apiGet } from "./api";

const MI = "/public/market-intelligence";

export interface Field {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  growthPercentage: number;
}

export interface TrendingRole {
  id: string;
  name: string;
  growthPercentage: number;
  compensation: { entryLevel: number; advancedLevel: number };
  skills: Skill[];
}

export interface MarketLocation {
  cca3: string;
  name: string;
  currency: string;
  currencySymbol: string;
}

export interface PathwayStage {
  stage: number;
  level: string;
  title: string;
  description: string;
}

export const miKeys = {
  popularFields: (cca3?: string) => ["mi", "popular-fields", cca3] as const,
  autocomplete: (q: string) => ["mi", "autocomplete", q] as const,
  search: (fieldId: string, cca3?: string) =>
    ["mi", "search", fieldId, cca3 ?? "GLOBAL"] as const,
  pathways: (roleName: string) => ["mi", "pathways", roleName] as const,
};

export function formatSalary(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return String(amount);
}

const mi = <T>(path: string, query?: Query) => apiGet<T>(`${MI}${path}`, query);

export function usePopularFields(cca3?: string) {
  return useQuery({
    queryKey: miKeys.popularFields(cca3),
    queryFn: () => mi<{ fields: Field[] }>("/fields/popular", { cca3 }),
    staleTime: 1000 * 60 * 30,
  });
}

export function useAutocomplete(q: string, enabled = true) {
  return useQuery({
    queryKey: miKeys.autocomplete(q),
    queryFn: () =>
      mi<{ suggestions: Field[] }>("/fields/autocomplete", { q, limit: 7 }),
    enabled: enabled && q.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: { suggestions: [] as Field[] },
  });
}

export function useMarketSearch(fieldId: string, cca3?: string) {
  return useQuery({
    queryKey: miKeys.search(fieldId, cca3),
    queryFn: () =>
      mi<{
        field: Field;
        location: MarketLocation;
        trendingRoles: TrendingRole[];
      }>("/search", { fieldId, cca3 }),
    enabled: !!fieldId,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useCareerPathways(roleName: string) {
  return useQuery({
    queryKey: miKeys.pathways(roleName),
    queryFn: () =>
      mi<{ roleName: string; stages: PathwayStage[] }>("/pathways", {
        roleName,
      }),
    enabled: !!roleName,
    staleTime: 1000 * 60 * 60,
  });
}

export const miRoleKeys = {
  popularRoles: (cca3?: string) => ["mi", "popular-roles", cca3] as const,
  roleAutocomplete: (q: string) => ["mi", "role-autocomplete", q] as const,
  insights: (role: string, cca3?: string) =>
    ["mi", "insights", role, cca3 ?? "GLOBAL"] as const,
  roleCareerPath: (role: string) => ["mi", "role-career-path", role] as const,
};

export function usePopularRoles(cca3?: string) {
  return useQuery({
    queryKey: miRoleKeys.popularRoles(cca3),
    queryFn: () =>
      mi<{ roles: Array<{ name: string; rank: number }> }>("/roles/popular", {
        cca3,
      }),
    staleTime: 1000 * 60 * 30,
  });
}

export function useRoleAutocomplete(q: string, enabled = true) {
  return useQuery({
    queryKey: miRoleKeys.roleAutocomplete(q),
    queryFn: () =>
      mi<{ suggestions: Field[] }>("/roles/autocomplete", { q, limit: 7 }),
    enabled: enabled && q.trim().length >= 3, // KSAT min
    staleTime: 1000 * 60 * 5,
    placeholderData: { suggestions: [] as Field[] },
  });
}

export function useRoleInsights(role: string, cca3?: string) {
  return useQuery({
    queryKey: miRoleKeys.insights(role, cca3),
    queryFn: () =>
      mi<{
        role: string;
        careerArea: string;
        location: MarketLocation;
        trendingRoles: TrendingRole[];
      }>("/insights", { role, cca3 }),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useRoleCareerPath(role: string) {
  return useQuery({
    queryKey: miRoleKeys.roleCareerPath(role),
    queryFn: () => mi<{ stages: PathwayStage[] }>("/career-path", { role }),
    enabled: !!role,
    staleTime: 1000 * 60 * 60,
  });
}
