import { resolveTenant } from "@/lib/tenant";
import { useQuery } from "@tanstack/react-query";

export const DEFAULT_ENTOMO_LOGO_URL =
  "https://entomo-website.web.app/assets/images/entomo_logo.svg";

type ResolvedTenant = Awaited<ReturnType<typeof resolveTenant>>;

export function useTenantLogo(): ResolvedTenant | null | undefined {
  const { data } = useQuery({
    queryKey: ["tenant-logo"],
    queryFn: (): Promise<ResolvedTenant | null> =>
      resolveTenant().catch(() => null),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return data;
}
