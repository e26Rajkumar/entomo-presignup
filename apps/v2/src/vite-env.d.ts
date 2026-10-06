/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB_APP_URL?: string;
  readonly VITE_DEV_TENANT?: string;
  /** Backend origin for hosts without the dev `/api` proxy. Unset: `/api`. */
  readonly VITE_API_BASE_URL?: string;
}
