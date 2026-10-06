/**
 * Support inbox the platform routes user queries to — for tenants that haven't
 * set their own (`supportEmail` on the tenant lookups).
 */
export const SUPPORT_EMAIL = "help@kpisoft.com";

/**
 * Opens the device's default email client with a pre-addressed draft to
 * `address` — the tenant's support inbox — or to the platform inbox when the
 * tenant has none (To: only — the user fills in subject/body and sends it
 * themselves; we never send anything).
 *
 * If no mail handler is configured, the browser handles that case natively
 * (e.g. Chrome offers to pick/register one) — we deliberately don't try to
 * detect it ourselves: browsers expose no API to query whether a `mailto`
 * handler exists, and the only workaround (timing how long until the tab loses
 * focus) can't tell a missing handler from a slow-launching one, so it fired
 * false "no client" errors on cold-starting apps like Thunderbird.
 */
export function openSupportEmail(address?: string | null) {
  window.location.href = `mailto:${address || SUPPORT_EMAIL}`;
}
