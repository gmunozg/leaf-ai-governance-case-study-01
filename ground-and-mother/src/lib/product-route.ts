import type { Metadata } from "next";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getProduct, getPublishedProducts } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

/** Shared static params + metadata for /shop/[slug] (non-app products) and /apps/[slug] (apps). */
export function productParams(kind: "app" | "shop") {
  return locales.flatMap((locale) =>
    getPublishedProducts()
      .filter((p) => (kind === "app" ? p.type === "app" : p.type !== "app"))
      .map((p) => ({ locale, slug: p.slug })),
  );
}

export function productForRoute(kind: "app" | "shop", slug: string) {
  const p = getProduct(slug);
  if (!p) return undefined;
  if ((kind === "app") !== (p.type === "app")) return undefined;
  return p;
}

export function productMetadata(kind: "app" | "shop", locale: string, slug: string): Metadata {
  const p = productForRoute(kind, slug);
  if (!isLocale(locale) || !p) return {};
  const c = p.content[locale];
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: `/${kind === "app" ? "apps" : "shop"}/${slug}`, title: `${c.title} · ${d.types[p.type]}`, description: c.standfirst });
}
