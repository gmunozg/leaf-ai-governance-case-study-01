// Validates src/content/products.ts before you deploy:  npm run check:products
// Uses Node's built-in TypeScript type stripping (Node 22.18+).
const { products } = await import("../src/content/products.ts");

const errors = [];
const warnings = [];
const slugs = new Set();

for (const p of products) {
  const id = `[${p.slug}]`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errors.push(`${id} slug must be lowercase-with-dashes`);
  if (slugs.has(p.slug)) errors.push(`${id} duplicate slug`);
  slugs.add(p.slug);
  for (const l of ["en", "es"]) {
    const c = p.content?.[l];
    if (!c?.title || !c?.short || !c?.standfirst) errors.push(`${id} missing ${l} title/short/standfirst`);
  }
  if (p.status === "available") {
    if (!p.checkoutUrl) errors.push(`${id} is "available" but has no checkoutUrl — it will show as not purchasable`);
    if (p.price == null) warnings.push(`${id} is "available" but price is null`);
    if (p.requiresAccessControl && !p.accessUrl) warnings.push(`${id} is an available app without accessUrl`);
    if (p.requiresAccessControl && !p.gumroadProductId) warnings.push(`${id} needs gumroadProductId for server-side purchase verification`);
  }
  if (p.checkoutUrl) {
    try {
      const u = new URL(p.checkoutUrl);
      if (u.protocol !== "https:" || !/(^|\.)gumroad\.com$/.test(u.hostname)) errors.push(`${id} checkoutUrl must be an https gumroad.com URL`);
      if (/example/.test(u.hostname)) errors.push(`${id} checkoutUrl looks like a placeholder`);
    } catch { errors.push(`${id} checkoutUrl is not a valid URL`); }
  }
  for (const r of p.related) if (!products.some((x) => x.slug === r)) errors.push(`${id} related slug "${r}" does not exist`);
}

console.log(`Checked ${products.length} products: ${products.filter((p) => p.status === "available").length} available, ${products.filter((p) => p.status === "coming-soon").length} coming soon, ${products.filter((p) => p.status === "unpublished").length} unpublished.`);
warnings.forEach((w) => console.warn("warning:", w));
errors.forEach((e) => console.error("error:", e));
process.exit(errors.length ? 1 : 0);
