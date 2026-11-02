import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { articlesForPillar, categoryLabel, readingMinutes, type Pillar } from "@/content/articles";
import { getPublishedProducts, getProduct, productPath, type Collection, type Tone } from "@/content/products";
import { toCard } from "@/lib/product-view";
import { Media } from "./Media";
import { Words } from "./Words";
import { Arrow } from "./Arrow";
import { Crumbs } from "./Crumbs";
import { ProductCard } from "./ProductCard";
import { Newsletter } from "./Newsletter";
import { StatusPill } from "./StatusPill";

const tones: Record<Pillar, Tone> = { mother: "sage", "first-foods": "yolk", "first-years": "clay" };
const productCollections: Record<Pillar, Collection[]> = { mother: ["mother"], "first-foods": ["first-foods"], "first-years": ["first-years", "family"] };

export function PillarPage({ pillar, locale, dict: d }: { pillar: Pillar; locale: Locale; dict: Dictionary }) {
  const p = d.pillars[pillar];
  const L = (x: string) => `/${locale}${x}`;
  const ph = d.a11y.placeholder;
  const essays = articlesForPillar(pillar);
  const goods = getPublishedProducts().filter((x) => productCollections[pillar].includes(x.collection));
  const companion = pillar === "first-foods" ? getProduct("first-foods-companion") : undefined;

  return (
    <>
      <section className="pillar-hero" aria-labelledby="pillar-title">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: p.title, href: L(`/${pillar}`) }]} />
            <span className="label muted">{p.kicker}</span>
          </div>
          <div className="pillar-hero__grid">
            <div>
              <span className="pillar-hero__numeral numeral" aria-hidden="true" data-reveal>{p.numeral}</span>
              <h1 id="pillar-title" className="mega" data-reveal="words"><Words text={p.title} /></h1>
              <p className="lede" style={{ marginTop: "1.5rem", maxWidth: "28ch" }} data-reveal>{p.lede}</p>
            </div>
            <Media tone={tones[pillar]} locale={locale} ratio="portrait" placeholderLabel={ph} brief={p.imageBrief} priority sizes="(min-width: 1024px) 40vw, 92vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap two-col">
          <span className="label clay" data-reveal>{p.kicker}</span>
          <p className="h3 serif" style={{ fontWeight: 350, lineHeight: 1.35, maxWidth: "36ch" }} data-reveal>{p.intro}</p>
        </div>
      </section>

      <section className="section--tight" aria-labelledby="topics-title">
        <div className="wrap">
          <div className="kicker-row"><h2 id="topics-title" className="label">{d.pillars.topicsTitle}</h2><span className="label muted">{p.topics.length}</span></div>
          <ul className="topics">
            {p.topics.map((t, i) => (
              <li key={t.title} data-reveal style={{ "--d": (i % 2) * 90 } as React.CSSProperties}>
                <h3 className="serif">{t.title}</h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {companion ? (
        <section className="section on-dark" aria-labelledby="companion-title">
          <div className="wrap toolband">
            <Link href={productPath(companion, locale)} style={{ display: "block" }}>
              <Media tone={companion.tone} locale={locale} ratio="tall" placeholderLabel={ph} brief={companion.content[locale].imageBrief} sizes="(min-width: 1024px) 45vw, 92vw" />
            </Link>
            <div className="stack">
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <span className="label">{"companionKicker" in p ? p.companionKicker : ""}</span>
                <StatusPill status={companion.status} label={d.status[companion.status]} />
              </div>
              <h2 id="companion-title" className="display" data-reveal>{companion.content[locale].title}</h2>
              <p className="lede muted" data-reveal>{"companionBody" in p ? p.companionBody : ""}</p>
              <ul className="toolband__list">
                {companion.content[locale].features.map((f, i) => (
                  <li key={f.title}><span className="numeral" style={{ color: "var(--gm-yolk)" }}>{String(i + 1).padStart(2, "0")}</span><span><strong style={{ fontWeight: 560 }}>{f.title}.</strong> <span className="muted">{f.body}</span></span></li>
                ))}
              </ul>
              <div><Link href={productPath(companion, locale)} className="btn"><span>{"companionCta" in p ? p.companionCta : d.product.viewApp}</span><Arrow /></Link></div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="essays-title">
        <div className="wrap">
          <div className="kicker-row">
            <h2 id="essays-title" className="label">{d.pillars.inTheLibrary}</h2>
            <Link href={L("/library")} className="text-link"><span className="ul-in">{d.common.visitLibrary}</span><Arrow /></Link>
          </div>
          {essays.length ? (
            <ul className="lib-list">
              {essays.map((a) => (
                <li key={a.slug} className={`lib-item${a.status === "in-preparation" ? " lib-item--prep" : ""}`} data-reveal>
                  <span className="label clay">{categoryLabel(a.category, locale)}</span>
                  <div className="stack-sm">
                    <h3 className="lib-item__title serif"><Link href={L(`/library/${a.slug}`)}><span className="ul-in">{a.content[locale].title}</span></Link></h3>
                    <p className="muted" style={{ margin: 0 }}>{a.content[locale].standfirst}</p>
                  </div>
                  <span className="label muted">{a.status === "published" ? d.library.minRead(readingMinutes(a, locale)) : d.library.inPreparation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lede muted">{d.pillars.nothingYet}</p>
          )}
        </div>
      </section>

      {goods.length ? (
        <section className="section band-ivory" aria-labelledby="goods-title">
          <div className="wrap">
            <div className="kicker-row">
              <h2 id="goods-title" className="label">{d.pillars.fromTheStudio}</h2>
              <Link href={L("/shop")} className="text-link"><span className="ul-in">{d.common.visitShop}</span><Arrow /></Link>
            </div>
            <div className="shelf">
              {goods.map((g, i) => <ProductCard key={g.slug} card={toCard(g, locale, d)} locale={locale} placeholderLabel={ph} delay={i * 90} />)}
            </div>
          </div>
        </section>
      ) : null}

      {"formats" in p ? (
        <section className="section--tight" aria-labelledby="formats-title">
          <div className="wrap two-col">
            <h2 id="formats-title" className="label">{p.formatsTitle}</h2>
            <div className="stack">
              <ul className="formats">{p.formats.map((f) => <li key={f} className="pill pill--soon">{f}</li>)}</ul>
              <p className="notice">{p.formatsNote}</p>
            </div>
          </div>
        </section>
      ) : null}

      <Newsletter dict={d} />
    </>
  );
}
