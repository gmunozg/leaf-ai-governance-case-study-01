import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import { formatPrice, productPath, type Collection, type Image, type Product, type Tone } from "@/content/products";

/** Serializable card data, safe to hand to client components. */
export type CardData = {
  slug: string;
  href: string;
  title: string;
  short: string;
  collection: Collection;
  collectionLabel: string;
  typeLabel: string;
  status: Product["status"];
  statusLabel: string;
  priceLabel: string;
  tone: Tone;
  image: Image | null;
  brief?: string;
};

export function toCard(p: Product, locale: Locale, d: Dictionary): CardData {
  const c = p.content[locale];
  const price = formatPrice(p, locale);
  return {
    slug: p.slug,
    href: productPath(p, locale),
    title: c.title,
    short: c.short,
    collection: p.collection,
    collectionLabel: d.collections[p.collection],
    typeLabel: d.types[p.type],
    status: p.status,
    statusLabel: d.status[p.status],
    priceLabel: price ? (p.billing === "one-time" ? price : `${price} ${d.billing[p.billing]}`) : d.product.priceTba,
    tone: p.tone,
    image: p.image,
    brief: c.imageBrief,
  };
}
