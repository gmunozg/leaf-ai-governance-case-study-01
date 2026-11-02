import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { productParams, productForRoute, productMetadata } from "@/lib/product-route";
import { ProductLanding } from "@/components/ProductLanding";

// Only published products get pages. Unpublished ones 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return productParams("shop");
}

export async function generateMetadata({ params }: PageProps<"/[locale]/shop/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  return productMetadata("shop", locale, slug);
}

export default async function ShopProductPage({ params }: PageProps<"/[locale]/shop/[slug]">) {
  const { locale, slug } = await params;
  const product = productForRoute("shop", slug);
  if (!product) notFound();
  return <ProductLanding product={product} locale={locale as Locale} dict={getDictionary(locale as Locale)} />;
}
