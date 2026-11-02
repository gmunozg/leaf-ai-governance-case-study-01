import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Server-only Gumroad helpers. Secrets come from environment variables and never reach the browser.
 * Endpoints follow Gumroad's public API v2 (https://gumroad.com/api) — re-check them against the
 * current docs before launch; they could not be fetched from this build environment.
 */
const API = "https://api.gumroad.com/v2";

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export type ConfirmedSale = {
  saleId: string;
  productId: string;
  email: string;
  refunded: boolean;
  chargebacked: boolean;
  test: boolean;
};

/**
 * Confirms a sale directly with Gumroad using our private access token.
 * A Ping body alone is not trusted: anyone who learns the Ping URL could forge one.
 */
export async function confirmSale(saleId: string): Promise<ConfirmedSale | null> {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) return null;
  const res = await fetch(`${API}/sales/${encodeURIComponent(saleId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { success?: boolean; sale?: Record<string, unknown> };
  if (!json.success || !json.sale) return null;
  const s = json.sale;
  return {
    saleId: String(s.id ?? saleId),
    productId: String(s.product_id ?? ""),
    email: String(s.email ?? "").toLowerCase(),
    refunded: Boolean(s.refunded),
    chargebacked: Boolean(s.chargebacked),
    test: Boolean(s.test),
  };
}

export type LicenseResult = { valid: boolean; email?: string; reason?: string };

/** Verifies a licence key for a product without incrementing its use count. */
export async function verifyLicense(productId: string, licenseKey: string): Promise<LicenseResult> {
  const body = new URLSearchParams({ product_id: productId, license_key: licenseKey, increment_uses_count: "false" });
  const res = await fetch(`${API}/licenses/verify`, { method: "POST", body, cache: "no-store" });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; purchase?: Record<string, unknown> };
  if (!res.ok || !json.success || !json.purchase) return { valid: false, reason: "not_found" };
  const p = json.purchase;
  if (p.refunded || p.chargebacked || p.disputed) return { valid: false, reason: "revoked" };
  if (p.subscription_ended_at || p.subscription_cancelled_at || p.subscription_failed_at) return { valid: false, reason: "subscription_inactive" };
  return { valid: true, email: String(p.email ?? "").toLowerCase() };
}
