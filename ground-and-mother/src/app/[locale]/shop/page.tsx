import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata, absolute } from "@/lib/seo";
import { collections, getPublishedProducts, getFeaturedProducts, productPath, getProduct } from "@/content/products";
import { toCard } from "@/lib/product-view";
import { Crumbs } from "@/components/Crumbs";
import { Words } from "@/components/Words";
import { ShopBrowser } from "@/components/ShopBrowser";
import { Media } from "@/components/Media";
import { StatusPill } from "@/components/StatusPill";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import Link from "next/link";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: "/shop", title: d.shop.title, description: d.shop.intro });
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const L = (p: string) => `/${locale}${p}`;
  const all = getPublishedProducts();
  const cards = all.map((p) => toCard(p, locale, d));
  const hero = getProduct("first-foods-companion") ?? getFeaturedProducts()[0];
  const present = collections.filter((c) => all.some((p) => p.collection === c));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: d.shop.title,
          itemListElement: all.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(productPath(p, locale)), name: p.content[locale].title })),
        }}
      />
      <section className="shop-head" aria-labelledby="shop-title">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: d.nav.shop, href: L("/shop") }]} />
            <span className="label muted">{d.shop.kicker}</span>
          </div>
          <div className="pillar-hero__grid">
            <div className="stack">
              <h1 id="shop-title" className="mega" data-reveal="words"><Words text={d.shop.title} /></h1>
              <p className="lede prose" data-reveal>{d.shop.intro}</p>
              <p className="notice" data-reveal>{d.shop.honesty}</p>
            </div>
            {hero ? (
              <Link href={productPath(hero, locale)} className="stack-sm" style={{ display: "block" }}>
                <Media image={hero.image} tone={hero.tone} locale={locale} ratio="land" placeholderLabel={d.a11y.placeholder} brief={hero.content[locale].imageBrief} priority sizes="(min-width: 1024px) 40vw, 92vw" />
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                  <span className="stack-sm">
                    <span className="label clay" style={{ display: "block" }}>{d.shop.featured}</span>
                    <span className="h3 serif" style={{ display: "block" }}><span className="ul-in">{hero.content[locale].title}</span></span>
                  </span>
                  <StatusPill status={hero.status} label={d.status[hero.status]} />
                </span>
                <span className="text-link"><span className="ul-in">{d.product.viewApp}</span><Arrow /></span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section--tight" aria-label={d.shop.filterLabel} style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}>
        <ShopBrowser
          cards={cards}
          filters={[{ id: "all", label: d.shop.all }, ...present.map((c) => ({ id: c, label: d.collections[c] }))]}
          labels={{ filterLabel: d.shop.filterLabel, empty: d.shop.empty, counts: Array.from({ length: cards.length + 1 }, (_, i) => d.shop.count(i)) }}
          locale={locale}
          placeholderLabel={d.a11y.placeholder}
        />
      </section>
      <Newsletter dict={d} />
    </>
  );
}
