import { type PolicyType, getPublicPolicyContent } from "@/lib/tenant";
import { useQuery } from "@tanstack/react-query";

export function usePublicPolicyContent(type: PolicyType, enabled = true) {
  return useQuery({
    queryKey: ["publicPolicyContent", type],
    queryFn: () => getPublicPolicyContent(type),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
