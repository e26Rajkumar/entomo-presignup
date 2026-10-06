/**
 * URL for a file in `public/` that respects Vite's `base`. Locally the base is
 * `/`; on sub-path hosting (GitHub Pages serves this app under
 * `/<repo>/<app>/`) a bare "/assets/..." would point at the wrong folder.
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
