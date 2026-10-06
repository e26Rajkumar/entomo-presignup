import type { AuthContextProps } from "./auth-context";

const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL ?? "http://localhost:5173";

/**
 * The web app's `/?autoSignin=1` landing resolves the tenant from its own host
 * and starts the org-scoped Zitadel sign-in itself, so this app only needs to
 * send the user there (optionally with the path to land on afterwards).
 */
export function webAppSigninUrl(returnTo?: string): string {
  const url = new URL(WEB_APP_URL);
  url.searchParams.set("autoSignin", "1");
  if (returnTo) url.searchParams.set("returnTo", returnTo);
  return url.toString();
}

export async function signinRedirectWithReturnTo(
  auth: Pick<AuthContextProps, "signinRedirect">,
  args: { scope?: string; returnTo?: string } = {},
): Promise<void> {
  await auth.signinRedirect(
    args.returnTo ? { state: { returnTo: args.returnTo } } : undefined,
  );
}

// Kept for call-site parity with the web app; the org scope is applied by the
// web app's auto-signin landing, not here.
export function scopeForOrg(zitadelOrgId: string): string {
  return zitadelOrgId;
}
