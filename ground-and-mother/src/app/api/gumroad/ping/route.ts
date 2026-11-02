import { NextResponse, type NextRequest } from "next/server";
import { products } from "@/content/products";
import { confirmSale, safeEqual } from "@/lib/gumroad.server";
import { getEntitlementStore, EntitlementStoreNotConfigured } from "@/lib/entitlements.server";

export const dynamic = "force-dynamic";

/**
 * Gumroad Ping receiver (Gumroad → Settings → Advanced → Ping endpoint).
 * Configure the URL as:  https://your-domain/api/gumroad/ping?secret=<GUMROAD_PING_SECRET>
 *
 * Flow:  shared secret check → re-fetch the sale from Gumroad with our private token →
 *        map to a product → grant or revoke the entitlement.
 * A frontend redirect is never treated as proof of payment; only this server path is.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.GUMROAD_PING_SECRET;
  if (!secret || !process.env.GUMROAD_ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, error: "ping_not_configured" }, { status: 503 });
  }
  const given = req.nextUrl.searchParams.get("secret") ?? "";
  if (!safeEqual(given, secret)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const saleId = form?.get("sale_id");
  if (typeof saleId !== "string" || !saleId) {
    return NextResponse.json({ ok: false, error: "missing_sale_id" }, { status: 400 });
  }

  const sale = await confirmSale(saleId);
  if (!sale) {
    return NextResponse.json({ ok: false, error: "sale_not_confirmed" }, { status: 400 });
  }

  const product = products.find((p) => p.gumroadProductId && p.gumroadProductId === sale.productId);
  if (!product) {
    // A sale for something this site does not manage (or a missing gumroadProductId in config).
    return NextResponse.json({ ok: true, ignored: "unknown_product" });
  }
  if (!product.requiresAccessControl) {
    // Guides and printables are delivered by Gumroad itself; nothing to store.
    return NextResponse.json({ ok: true, ignored: "no_access_control" });
  }

  try {
    const store = getEntitlementStore();
    if (sale.refunded || sale.chargebacked) await store.revoke(sale.saleId);
    else await store.grant({ email: sale.email, productSlug: product.slug, saleId: sale.saleId });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof EntitlementStoreNotConfigured) {
      console.error("[gumroad-ping]", err.message, { sale: sale.saleId, product: product.slug });
      return NextResponse.json({ ok: false, error: "entitlements_not_configured" }, { status: 501 });
    }
    console.error("[gumroad-ping] unexpected error", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
