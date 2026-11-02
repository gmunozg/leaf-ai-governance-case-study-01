import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata } from "@/lib/seo";
import { Crumbs } from "@/components/Crumbs";
import { Media } from "@/components/Media";
import { Words } from "@/components/Words";
import { Arrow } from "@/components/Arrow";
import { Newsletter } from "@/components/Newsletter";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: "/about", title: d.about.kicker, description: d.about.lede });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const a = d.about;
  const L = (p: string) => `/${locale}${p}`;
  return (
    <>
      <section className="pillar-hero" aria-labelledby="about-title">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: a.kicker, href: L("/about") }]} />
            <span className="label muted">{d.meta.tagline}</span>
          </div>
          <div className="pillar-hero__grid">
            <div className="stack">
              <h1 id="about-title" className="display" data-reveal="words"><Words text={a.title} /></h1>
              <p className="lede prose" data-reveal>{a.lede}</p>
            </div>
            <Media tone="linen" locale={locale} ratio="portrait" placeholderLabel={d.a11y.placeholder} brief={locale === "es" ? "Una cocina vivida al final de la tarde: tarros en el alféizar, un paño sobre la silla." : "A lived-in kitchen in late afternoon: jars on the sill, a tea towel over a chair."} priority sizes="(min-width: 1024px) 40vw, 92vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-sections">
          {a.sections.map((s) => (
            <section key={s.title} data-reveal>
              <h2 className={s.title === "Ground" || s.title === "Mother" ? "display em" : "h3"}>{s.title}</h2>
              <div className="prose">{s.body.map((t, i) => <p key={i} className={i === 0 ? "lede" : ""}>{t}</p>)}</div>
            </section>
          ))}
        </div>
      </section>

      <section className="section--tight" aria-labelledby="founder-title">
        <div className="wrap two-col">
          <div className="stack">
            <h2 id="founder-title" className="h3">{a.founderTitle}</h2>
            <span className="pill pill--soon">{d.common.toBeCompleted}</span>
          </div>
          <div className="grid" style={{ rowGap: "2rem" }}>
            <div style={{ gridColumn: "span 12", maxWidth: "26rem" }}>
              <Media tone="sage" locale={locale} ratio="portrait" placeholderLabel={d.a11y.placeholder} brief={locale === "es" ? "Retrato de la fundadora o fundador — por añadir." : "Founder portrait — to be added."} sizes="26rem" />
            </div>
            <p className="pending-box" style={{ gridColumn: "span 12" }}>{a.founderPending}</p>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href={L("/library")} className="btn"><span>{d.common.visitLibrary}</span><Arrow /></Link>
          <Link href={L("/shop")} className="btn btn--ghost"><span>{d.common.visitShop}</span></Link>
        </div>
      </section>
      <Newsletter dict={d} />
    </>
  );
}
