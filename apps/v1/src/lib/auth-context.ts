import { webAppSigninUrl } from "./auth";

// Stand-in for react-oidc-context's `useAuth`. A standalone pre-signup app has
// no OIDC session of its own: signing in hands off to the main web app, which
// runs the real Zitadel flow on its own registered origin.
export interface AuthContextProps {
  signinRedirect: (args?: { state?: { returnTo?: string } }) => Promise<void>;
}

const auth: AuthContextProps = {
  signinRedirect: async (args) => {
    window.location.assign(webAppSigninUrl(args?.state?.returnTo));
  },
};

export function useAuth(): AuthContextProps {
  return auth;
}
