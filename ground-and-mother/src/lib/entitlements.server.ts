import "server-only";

/**
 * Product entitlements: "this email may use this product".
 *
 * This is the seam where a real database plugs in (e.g. Postgres via Supabase/Neon, or Vercel KV).
 * It is intentionally NOT implemented yet: no app is on sale, and pretending to store access would
 * be worse than storing nothing. See ARCHITECTURE.md → "Paid app access".
 */
export type Entitlement = {
  email: string;
  productSlug: string;
  saleId: string;
  grantedAt: string;
  revokedAt: string | null;
};

export interface EntitlementStore {
  grant(e: Omit<Entitlement, "grantedAt" | "revokedAt">): Promise<void>;
  revoke(saleId: string): Promise<void>;
  has(email: string, productSlug: string): Promise<boolean>;
}

export class EntitlementStoreNotConfigured extends Error {
  constructor() {
    super("Entitlement storage is not configured. Connect a database before selling interactive apps.");
  }
}

const notConfigured: EntitlementStore = {
  async grant() { throw new EntitlementStoreNotConfigured(); },
  async revoke() { throw new EntitlementStoreNotConfigured(); },
  async has() { throw new EntitlementStoreNotConfigured(); },
};

/** Replace with a real implementation when the first app launches. */
export function getEntitlementStore(): EntitlementStore {
  return notConfigured;
}
