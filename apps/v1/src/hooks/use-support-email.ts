import { SUPPORT_EMAIL } from "@/lib/support-email";
import { useTenantLogo } from "./use-tenant-logo";

/**
 * The inbox this tenant's Support / Contact Us links open: the tenant's own
 * `supportEmail` from the public tenant lookup, or the platform inbox while
 * that is unset, still loading, or failed to load.
 *
 * Reads the same cached lookup as the tenant logo, so it adds no request.
 */
export function useSupportEmail(): string {
  return useTenantLogo()?.supportEmail || SUPPORT_EMAIL;
}
