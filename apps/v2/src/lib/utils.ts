import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { scopeForOrg, signinRedirectWithReturnTo } from "./auth";
import type { AuthContextProps } from "./auth-context";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleLogin(
  auth: Pick<AuthContextProps, "signinRedirect">,
  id: string,
) {
  void signinRedirectWithReturnTo(auth, { scope: scopeForOrg(id) });
}
