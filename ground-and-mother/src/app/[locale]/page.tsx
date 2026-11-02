import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata, absolute } from "@/lib/seo";
import { site } from "@/content/site";
import { articles, categoryLabel, readingMinutes } from "@/content/articles";
import { getFeaturedProducts, getPublishedProducts, productPath, getProduct } from "@/content/products";
import { toCard } from "@/lib/product-view";
import { Media } from "@/components/Media";
import { Words } from "@/components/Words";
import { Arrow } from "@/components/Arrow";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { JsonLd } from "@/components/JsonLd";
import { StatusPill } from "@/components/StatusPill";
import { FoodJournal } from "@/components/FoodJournal";
import { TableStage } from "@/components/TableStage";
import { foods, foodSources } from "@/content/foods";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale, path: "", description: getDictionary(locale).meta.description });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const h = d.home;
  const L = (p: string) => `/${locale}${p}`;
  const ph = d.a11y.placeholder;

  const published = articles.filter((a) => a.status === "published");
  const featured = published.find((a) => a.featured) ?? published[0];
  const more = articles.filter((a) => a.slug !== featured.slug).slice(0, 4);

  const featuredGoods = getFeaturedProducts().filter((p) => p.type !== "app").concat(getPublishedProducts().filter((p) => p.type !== "app" && !p.featured)).slice(0, 3);
  const apps = getPublishedProducts().filter((p) => p.type === "app");
  const companion = getProduct("first-foods-companion");

  const tb = h.table;
  const scene = (id: string, step: string | null, kicker: string, title: React.ReactNode, body: string, cta?: React.ReactNode) => (
    <section className="tb-scene" data-tb-scene={id} aria-labelledby={`tb-${id}`}>
      <div className="tb-panel">
        <p className="label clay">{step ? <span className="tb-step">{step}</span> : null}{kicker}</p>
        <h2 id={`tb-${id}`} className="tb-title">{title}</h2>
        <p className="tb-text">{body}</p>
        {cta}
      </div>
    </section>
  );
  const chapterLink = (k: string, label: string) => (
    <Link href={L(`/${k}`)} className="text-link"><span className="ul-in">{label}</span><Arrow /></Link>
  );

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: absolute(L("")), slogan: d.meta.tagline, logo: absolute("/icon.svg") },
          { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absolute(L("")), inLanguage: locale },
        ]}
      />

      {/* The Table — one overhead table that fills as the visitor scrolls */}
      <div className="tb" data-table>
        <TableStage locale={locale} planLabel={tb.plan} />
        <div className="tb-scenes">
          <section className="tb-scene tb-scene--hero" data-tb-scene="hero" aria-labelledby="hero-title">
            <div className="tb-panel">
              <p className="label clay">{tb.kicker}</p>
              <h1 id="hero-title" className="tb-hero-title">{tb.title}</h1>
              <p className="tb-sub">{tb.sub}</p>
              <p className="tb-text">{h.hero.body}</p>
              <div className="hero__ctas">
                <Link href={L("/library")} className="btn"><span>{h.heroCta}</span><Arrow /></Link>
                <Link href={L("/shop")} className="btn btn--ghost"><span>{h.heroCta2}</span></Link>
              </div>
              <p className="label muted tb-cue"><span className="cue-line" aria-hidden="true" />{tb.cue}</p>
            </div>
          </section>
          {scene("mother", tb.steps.mother, d.pillars.mother.kicker, d.pillars.mother.title, d.pillars.mother.lede + " " + d.pillars.mother.intro.split(". ").slice(0, 1).join(". ") + ".", chapterLink("mother", d.common.readMore))}
          {scene("firstFoods", tb.steps.firstFoods, d.pillars["first-foods"].kicker, d.pillars["first-foods"].title, d.pillars["first-foods"].lede + " " + d.pillars["first-foods"].intro.split(". ").slice(0, 1).join(". ") + ".", chapterLink("first-foods", d.common.readMore))}
          {scene("firstYears", tb.steps.firstYears, d.pillars["first-years"].kicker, d.pillars["first-years"].title, d.pillars["first-years"].lede + " " + d.pillars["first-years"].intro.split(". ").slice(0, 1).join(". ") + ".", chapterLink("first-years", d.common.readMore))}
          {scene("library", tb.steps.library, d.nav.libraryFull, tb.library.title, tb.library.body, chapterLink("library", d.common.visitLibrary))}
          {scene("final", null, tb.final.kicker, h.closingTitle, h.closingBody,
            <div className="hero__ctas">
              <Link href={L("/library")} className="btn"><span>{d.common.visitLibrary}</span><Arrow /></Link>
              <Link href={L("/shop")} className="btn btn--ghost"><span>{d.common.visitShop}</span></Link>
            </div>)}
        </div>
      </div>

      {/* The food journal */}
      <section className="section fj" aria-labelledby="fj-heading">
        <div className="wrap">
          <div className="kicker-row"><span className="label">{h.food.kicker}</span><span className="label muted">I — VIII</span></div>
          <div className="fj-head">
            <h2 id="fj-heading" className="display" data-reveal>{h.food.title}</h2>
            <p className="lede muted" data-reveal>{h.food.intro}</p>
          </div>
          <FoodJournal
            items={foods.map((f) => ({ id: f.id, tone: f.tone, motif: f.motif, image: f.image, c: f.content[locale] }))}
            labels={h.food}
            sources={foodSources.map((s) => ({ label: s.label[locale], url: s.url }))}
            locale={locale}
            placeholderLabel={ph}
          />
        </div>
      </section>

      <Marquee items={h.marquee} />

      {/* The Nourishment Library */}
      <section className="section" aria-labelledby="lib-title">
        <div className="wrap">
          <div className="kicker-row">
            <span className="label">{h.libraryKicker}</span>
            <Link href={L("/library")} className="text-link"><span className="ul-in">{d.common.visitLibrary}</span><Arrow /></Link>
          </div>
          <h2 id="lib-title" className="display" style={{ maxWidth: "14ch", marginBottom: "clamp(2.5rem, 5vw, 4.5rem)" }} data-reveal>{h.libraryTitle}</h2>
          <Link href={L(`/library/${featured.slug}`)} className="lib-feature" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
            <Media tone={featured.tone} locale={locale} ratio="land" placeholderLabel={ph} brief={featured.content[locale].imageBrief} sizes="(min-width: 1024px) 58vw, 92vw" />
            <div className="lib-feature__text" data-reveal>
              <span className="label clay">{d.library.featured} · {categoryLabel(featured.category, locale)}</span>
              <h3 className="h2"><span className="ul-in">{featured.content[locale].title}</span></h3>
              <p className="lede muted">{featured.content[locale].standfirst}</p>
              <span className="label muted">{d.library.minRead(readingMinutes(featured, locale))}</span>
            </div>
          </Link>
          <ul className="lib-list">
            {more.map((a, i) => (
              <li key={a.slug} className={`lib-item${a.status === "in-preparation" ? " lib-item--prep" : ""}`} data-reveal style={{ "--d": i * 80 } as React.CSSProperties}>
                <span className="label clay">{categoryLabel(a.category, locale)}</span>
                <div className="stack-sm">
                  <h3 className="lib-item__title serif"><Link href={L(`/library/${a.slug}`)}><span className="ul-in">{a.content[locale].title}</span></Link></h3>
                  <p className="muted" style={{ margin: 0 }}>{a.content[locale].standfirst}</p>
                </div>
                <span className="label muted">{a.status === "published" ? d.library.minRead(readingMinutes(a, locale)) : d.library.inPreparation}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — Featured digital products */}
      <section className="section band-ivory" aria-labelledby="goods-title">
        <div className="wrap">
          <div className="kicker-row">
            <span className="label">{h.productsKicker}</span>
            <Link href={L("/shop")} className="text-link"><span className="ul-in">{d.common.visitShop}</span><Arrow /></Link>
          </div>
          <h2 id="goods-title" className="display" style={{ maxWidth: "12ch", marginBottom: "clamp(2.5rem, 5vw, 4.5rem)" }} data-reveal>{h.productsTitle}</h2>
          <div className={`shelf ${featuredGoods.length === 2 ? "shelf--duo" : "shelf--stagger"}`}>
            {featuredGoods.map((p, i) => (
              <ProductCard key={p.slug} card={toCard(p, locale, d)} locale={locale} placeholderLabel={ph} delay={i * 100} ratio={featuredGoods.length === 2 && i === 0 ? "land" : "portrait"} />
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Interactive tools */}
      <section className="section on-dark" aria-labelledby="tools-title">
        <div className="wrap">
          <div className="kicker-row">
            <span className="label">{h.toolsKicker}</span>
          </div>
          <div className="toolband">
            {companion ? (
              <Link href={productPath(companion, locale)} style={{ display: "block" }}>
                <Media tone={companion.tone} locale={locale} ratio="tall" placeholderLabel={ph} brief={companion.content[locale].imageBrief} sizes="(min-width: 1024px) 45vw, 92vw" />
              </Link>
            ) : null}
            <div className="stack">
              <h2 id="tools-title" className="h1" data-reveal>{h.toolsTitle}</h2>
              <p className="lede muted" data-reveal>{h.toolsBody}</p>
              <ul className="applist" data-reveal>
                {apps.map((p) => (
                  <li key={p.slug}>
                    <Link href={productPath(p, locale)}>
                      <span className="stack-sm">
                        <span className="serif" style={{ display: "block" }}>{p.content[locale].title}</span>
                        <span className="muted" style={{ fontSize: "0.92rem", display: "block" }}>{p.content[locale].short}</span>
                      </span>
                      <StatusPill status={p.status} label={d.status[p.status]} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8 — Philosophy */}
      <section className="section" aria-labelledby="phil-title">
        <div className="wrap">
          <div className="kicker-row"><h2 id="phil-title" className="label">{h.philosophyKicker}</h2></div>
          <ol className="principles">
            {h.principles.map((p, i) => (
              <li key={p.title} data-reveal style={{ "--d": i * 60 } as React.CSSProperties}>
                <h3 className="serif">{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Newsletter dict={d} />

    </>
  );
}
