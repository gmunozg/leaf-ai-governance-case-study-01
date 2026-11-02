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
import { PillarIndex } from "@/components/PillarIndex";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { JsonLd } from "@/components/JsonLd";
import { StatusPill } from "@/components/StatusPill";

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

  const pillarRows = (["mother", "first-foods", "first-years"] as const).map((k) => ({
    href: L(`/${k}`),
    numeral: d.pillars[k].numeral,
    title: d.pillars[k].title,
    meta: d.pillars[k].lede,
    tone: ({ mother: "sage", "first-foods": "yolk", "first-years": "clay" } as const)[k],
    brief: d.pillars[k].imageBrief,
  }));

  let wordIndex = 0;

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: absolute(L("")), slogan: d.meta.tagline, logo: absolute("/icon.svg") },
          { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absolute(L("")), inLanguage: locale },
        ]}
      />

      {/* 1 — Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap">
          <div className="hero__masthead label" data-reveal="rule">
            <span>{h.heroKicker}</span>
            <span className="muted">{d.nav.mother} · {d.nav.firstFoods} · {d.nav.firstYears}</span>
            <span className="muted">{d.nav.libraryFull}</span>
          </div>
          <h1 id="hero-title" className="mega hero__title" data-reveal="words">
            {h.heroTitle.map((line, i) => {
              const el = (
                <span key={i} className="line">
                  <Words text={line} start={wordIndex} />
                </span>
              );
              wordIndex += line.split(" ").length;
              return el;
            })}
          </h1>
          <div className="hero__grid">
            <div className="hero__body">
              <p className="lede prose" data-reveal style={{ "--d": 500 } as React.CSSProperties}>{h.heroBody}</p>
              <div className="hero__ctas" data-reveal style={{ "--d": 650 } as React.CSSProperties}>
                <Link href={L("/library")} className="btn"><span>{h.heroCta}</span><Arrow /></Link>
                <Link href={L("/shop")} className="btn btn--ghost"><span>{h.heroCta2}</span></Link>
              </div>
            </div>
            <div className="hero__collage">
              <Media className="c1" tone="broth" locale={locale} ratio="portrait" placeholderLabel={ph} brief={locale === "es" ? "Manos partiendo pan junto a un cuenco de caldo, luz de ventana, grano de película." : "Hands tearing bread beside a bowl of broth, window light, film grain."} priority sizes="(min-width: 1024px) 34vw, 55vw" delay={200} />
              <Media className="c2" tone="sage" locale={locale} ratio="square" placeholderLabel={ph} compact sizes="(min-width: 1024px) 20vw, 40vw" delay={420} />
              <Media className="c3" tone="yolk" locale={locale} ratio="land" placeholderLabel={ph} compact sizes="(min-width: 1024px) 24vw, 45vw" delay={600} />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Brand statement */}
      <section className="section" aria-label={h.introKicker}>
        <div className="wrap statement-wrap">
          <p className="label clay" data-reveal>{d.meta.tagline}</p>
          <p className="h1 statement" data-reveal="words" style={{ maxWidth: "24ch" }}>
            <Words text={h.statement} />
          </p>
        </div>
      </section>

      {/* 3 — What we do */}
      <section className="section--tight" aria-labelledby="what-title">
        <div className="wrap">
          <div className="kicker-row"><h2 id="what-title" className="label">{h.introKicker}</h2></div>
          <div className="trio">
            {h.intro.map((it, i) => (
              <div key={it.verb} data-reveal style={{ "--d": i * 120 } as React.CSSProperties}>
                <h3 className="h3">{it.verb}</h3>
                <p className="muted" style={{ margin: 0 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Three editorial chapters */}
      <section className="section" aria-labelledby="pillars-title">
        <div className="wrap">
          <div className="kicker-row">
            <span className="label">{h.pillarsKicker}</span>
            <span className="label muted">I — III</span>
          </div>
          <h2 id="pillars-title" className="h2" style={{ maxWidth: "20ch", marginBottom: "clamp(2.5rem, 5vw, 4rem)" }} data-reveal>{h.pillarsTitle}</h2>
          <PillarIndex rows={pillarRows} locale={locale} placeholderLabel={ph} />
        </div>
      </section>

      <Marquee items={h.marquee} />

      {/* 5 — The Nourishment Library */}
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

      {/* 9 — Newsletter */}
      <Newsletter dict={d} />

      {/* 10 — Closing */}
      <section className="section" aria-labelledby="closing-title">
        <div className="wrap closing">
          <h2 id="closing-title" className="mega" data-reveal="words"><Words text={h.closingTitle} /></h2>
          <p className="lede muted prose" data-reveal>{h.closingBody}</p>
          <div className="hero__ctas" style={{ justifyContent: "center" }} data-reveal>
            <Link href={L("/library")} className="btn"><span>{d.common.visitLibrary}</span><Arrow /></Link>
            <Link href={L("/shop")} className="btn btn--ghost"><span>{d.common.visitShop}</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
