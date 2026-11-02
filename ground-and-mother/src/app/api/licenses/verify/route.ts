import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/content/products";
import { verifyLicense } from "@/lib/gumroad.server";

export const dynamic = "force-dynamic";

/**
 * Server-side licence-key check, for products with "Generate a unique license key" enabled in Gumroad.
 * POST { "product": "<slug>", "licenseKey": "<key>" } → { valid: boolean }
 * Useful as an interim gate for a tiny app before full accounts exist. The response never echoes
 * purchase details beyond validity.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { product?: unknown; licenseKey?: unknown } | null;
  const slug = typeof body?.product === "string" ? body.product : "";
  const key = typeof body?.licenseKey === "string" ? body.licenseKey.trim() : "";
  if (!slug || !key || key.length > 200) {
    return NextResponse.json({ valid: false, error: "invalid_request" }, { status: 400 });
  }
  const product = getProduct(slug);
  if (!product || !product.gumroadProductId) {
    return NextResponse.json({ valid: false, error: "product_not_configured" }, { status: 404 });
  }
  const result = await verifyLicense(product.gumroadProductId, key).catch(() => ({ valid: false, reason: "upstream_error" }));
  return NextResponse.json({ valid: result.valid, ...(result.valid ? {} : { reason: result.reason }) }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
