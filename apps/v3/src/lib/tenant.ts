import { ApiError, apiGet } from "./api";

export interface TenantInfo {
  id: string;
  name: string;
  zitadelOrgId: string;
  logoUrl?: string | undefined;
  logoUrlDark?: string | undefined;
  faviconUrl?: string | undefined;
  location?: { city: string; country: string } | null;
  supportEmail?: string | null | undefined;
}

/**
 * Resolves the tenant for this page: `VITE_DEV_TENANT` when set (local dev,
 * where there's no tenant subdomain on `localhost`), otherwise the host's
 * subdomain under the platform's APP_BASE_URL, or a registered vanity domain.
 */
export async function resolveTenant(): Promise<TenantInfo> {
  const subdomain = await resolveSubdomain();
  try {
    return await apiGet<TenantInfo>(
      `/public/tenants/by-subdomain/${encodeURIComponent(subdomain)}`,
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 410) {
      throw new Error(`Tenant "${subdomain}" is suspended`);
    }
    throw new Error(`Tenant "${subdomain}" not found`);
  }
}

async function resolveSubdomain(): Promise<string> {
  const override = import.meta.env.VITE_DEV_TENANT;
  if (override) return override;

  const { appBaseUrl } = await apiGet<{ appBaseUrl: string }>("/public/config");
  const suffix = `.${new URL(appBaseUrl).hostname}`;
  const hostname = window.location.hostname;
  if (hostname.endsWith(suffix) && hostname.length > suffix.length) {
    return hostname.slice(0, -suffix.length);
  }
  const { subdomain } = await apiGet<{ subdomain: string }>(
    `/public/tenants/by-domain/${encodeURIComponent(hostname)}`,
  );
  return subdomain;
}

export type PolicyType = "privacy-policy" | "terms-and-conditions";

export interface PublicPolicyContent {
  available: boolean;
  filename: string | null;
  url: string | null;
  updatedAt: string | null;
}

export async function getPublicPolicyContent(
  type: PolicyType,
): Promise<PublicPolicyContent> {
  const subdomain = await resolveSubdomain();
  const body = await apiGet<PublicPolicyContent>(
    `/public/tenants/by-subdomain/${encodeURIComponent(subdomain)}/documents/${type}`,
  );
  return {
    available: body.available,
    filename: body.filename,
    url: body.url,
    updatedAt: body.updatedAt,
  };
}
