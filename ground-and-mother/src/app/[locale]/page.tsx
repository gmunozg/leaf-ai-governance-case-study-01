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
import { SeedHero } from "@/components/SeedHero";
import { RootLine, RootNote } from "@/components/RootLine";
import { FoodJournal } from "@/components/FoodJournal";
import { BotanicalPlate } from "@/components/BotanicalPlate";
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

  const pillarRows = (["mother", "first-foods", "first-years"] as const).map((k) => ({
    href: L(`/${k}`),
    numeral: d.pillars[k].numeral,
    title: d.pillars[k].title,
    meta: d.pillars[k].lede,
    tone: ({ mother: "sage", "first-foods": "yolk", "first-years": "clay" } as const)[k],
    brief: d.pillars[k].imageBrief,
  }));

  const note = (k: "radicle" | "hairs" | "myco" | "cotyledon") => (
    <RootNote id={k} label={h.notes.label} term={h.notes[k].term} body={h.notes[k].body} closeLabel={h.notes.close} />
  );
  const cycleTones = ["clay", "sage", "linen", "yolk"] as const;
  const cycleMotifs = ["pot", "jars", "bowl", "fruit"] as const;

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: absolute(L("")), slogan: d.meta.tagline, logo: absolute("/icon.svg") },
          { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: absolute(L("")), inLanguage: locale },
        ]}
      />

      {/* 1 — The opening scene: seed, soil, roots */}
      <SeedHero copy={h.hero} />
      <BotanicalPlate />

      <RootLine>
      {/* 2 — Brand statement */}
      <section className="section" aria-label={h.introKicker}>
        {note("radicle")}
        <div className="wrap statement-wrap">
          <p className="label clay" data-reveal>{d.meta.tagline}</p>
          <p className="h1 statement" data-reveal="words" style={{ maxWidth: "24ch" }}>
            <Words text={h.statement} />
          </p>
        </div>
      </section>

      {/* 3 — The nourishment cycle */}
      <section className="section--tight cycle" aria-labelledby="cycle-title">
        <div className="wrap">
          <div className="kicker-row"><span className="label">{h.cycle.kicker}</span><span className="label muted">I — IV</span></div>
          <div className="cycle__head">
            <h2 id="cycle-title" className="h1" data-reveal>{h.cycle.title}</h2>
            <p className="lede muted" data-reveal>{h.cycle.intro}</p>
          </div>
          <div className="cycle__track">
            <svg className="cycle__line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" data-reveal="draw">
              <path d="M0 30 C120 6 200 52 330 30 S560 8 670 30 S880 54 1000 26" pathLength={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <ol className="cycle__steps">
              {h.cycle.steps.map((st, i) => (
                <li key={st.name} className="cycle__step" data-reveal style={{ "--d": i * 140 } as React.CSSProperties}>
                  <Media tone={cycleTones[i]} motif={cycleMotifs[i]} locale={locale} ratio={i % 2 ? "square" : "portrait"} placeholderLabel={ph} brief={st.brief} compact sizes="(min-width: 1024px) 22vw, 45vw" />
                  <span className="cycle__num numeral" aria-hidden="true">{["I", "II", "III", "IV"][i]}</span>
                  <h3 className="h3">{st.name}</h3>
                  <p className="muted">{st.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 4 — The food journal */}
      <section className="section fj" aria-labelledby="fj-heading">
        {note("hairs")}
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

      {/* 5 — Three editorial chapters */}
      <section className="section" aria-labelledby="pillars-title">
        {note("myco")}
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
        {note("cotyledon")}
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

      </RootLine>

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
