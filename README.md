# entomo pre-signup (standalone)

The three pre-signup landing pages from `entomo-b2b2c/apps/frontend/web`
(`/pre-signup/v1`, `/v2`, `/v3`), each as its own self-contained Vite app.
Each app has its own copy of everything it needs; none imports another.

```bash
bun install
cp .env.example .env   # set VITE_DEV_TENANT, ports, etc.
bun run dev            # all three together
bun run dev:v2         # just one
```

| App | Default URL |
| --- | --- |
| v1 | http://localhost:6001 |
| v2 | http://localhost:6002 |
| v3 | http://localhost:6003 |

Change ports in `.env` (`PRESIGNUP_V1_PORT` …), or one-off:
`PRESIGNUP_V2_PORT=7000 bun run dev`.

## What differs from the web app copy

- **API**: calls go to `/api/*` on the app's own origin, and the Vite dev server
  proxies them to `API_PROXY_TARGET`. No CORS change is needed on the API.
  For a deployed build, serve `/api` → API from the same host the same way.
- **Login**: no OIDC client here. Login buttons send the user to
  `VITE_WEB_APP_URL/?autoSignin=1`, where the main web app starts the
  tenant-scoped Zitadel sign-in.
- `src/lib/*` are small fetch-based stand-ins for the web app's typed Hono
  clients (`@entomo/server/hc`); `src/styles/entomo-ui.css` is a vendored copy
  of `@entomo/ui/global.css`.
- `src/pre-signup/vN` is copied verbatim apart from `react-oidc-context`
  imports, which point to `src/lib/auth-context.ts`.
