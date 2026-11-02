import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata, absolute } from "@/lib/seo";
import { site } from "@/content/site";
import { articles, getArticle, categoryLabel, readingMinutes, relatedArticles } from "@/content/articles";
import { getProduct } from "@/content/products";
import { toCard } from "@/lib/product-view";
import { Media } from "@/components/Media";
import { Crumbs } from "@/components/Crumbs";
import { Arrow } from "@/components/Arrow";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { Newsletter } from "@/components/Newsletter";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/library/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = getArticle(slug);
  if (!isLocale(locale) || !a) return {};
  const c = a.content[locale];
  return pageMetadata({
    locale,
    path: `/library/${slug}`,
    title: c.title,
    description: c.standfirst,
    type: a.status === "published" ? "article" : "website",
    noindex: a.status !== "published",
  });
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/library/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const a = getArticle(slug);
  if (!a) notFound();
  const d = getDictionary(locale);
  const c = a.content[locale];
  const L = (p: string) => `/${locale}${p}`;
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });
  const related = relatedArticles(a);
  const products = a.relatedProducts.map(getProduct).filter((p) => p !== undefined);
  const published = a.status === "published";

  return (
    <article>
      {published ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.title,
            description: c.standfirst,
            datePublished: a.date,
            inLanguage: locale,
            mainEntityOfPage: absolute(L(`/library/${a.slug}`)),
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absolute("/icon.svg") } },
          }}
        />
      ) : null}
      <header className="article-head">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: d.nav.library, href: L("/library") }, { name: c.title, href: L(`/library/${a.slug}`) }]} />
          </div>
          <div style={{ maxWidth: "62rem", marginTop: "clamp(2rem, 5vw, 4rem)" }} className="stack">
            <div className="article-head__meta">
              <span className="label clay">{categoryLabel(a.category, locale)}</span>
              {published && a.date ? <span className="label muted"><time dateTime={a.date}>{fmt.format(new Date(a.date))}</time></span> : null}
              <span className="label muted">{published ? d.library.minRead(readingMinutes(a, locale)) : d.library.inPreparation}</span>
            </div>
            <h1 className="display" data-reveal>{c.title}</h1>
            <p className="lede muted prose" data-reveal>{c.standfirst}</p>
          </div>
        </div>
      </header>

      {published ? (
        <>
          <div className="wrap" style={{ marginTop: "clamp(2.5rem, 6vw, 5rem)" }}>
            <Media tone={a.tone} locale={locale} ratio="wide" placeholderLabel={d.a11y.placeholder} brief={c.imageBrief} priority sizes="(min-width: 1440px) 1340px, 94vw" />
          </div>
          <div className="wrap section--tight">
            <div className="two-col">
              <aside className="label muted" style={{ alignSelf: "start" }}>{a.pillar === null ? d.library.editorsNote : d.pillars[a.pillar].title}</aside>
              <div className="article-body">
                {c.body.map((b, i) =>
                  b.type === "h2" ? <h2 key={i}>{b.text}</h2> : b.type === "quote" ? <blockquote key={i}>{b.text}</blockquote> : <p key={i}>{b.text}</p>,
                )}
                {a.sources.length ? (
                  <div className="stack-sm" style={{ marginTop: "3rem", borderTop: "1px solid var(--gm-rule)", paddingTop: "1.5rem" }}>
                    <h2 className="label" style={{ margin: 0, fontFamily: "var(--gm-sans)", fontSize: "var(--gm-fs-label)" }}>Sources</h2>
                    <ul>{a.sources.map((s) => <li key={s.url}><a className="ul" href={s.url} rel="noopener" target="_blank">{s.title}</a></li>)}</ul>
                  </div>
                ) : null}
                <p className="notice" style={{ marginTop: "3rem" }}>{d.footer.disclaimer}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="wrap section--tight">
          <div className="pending-box">
            <span className="pill pill--soon">{d.library.inPreparation}</span>
            <p style={{ margin: 0 }}>{d.library.inPreparationNote}</p>
            <Link href={L("/library")} className="text-link"><span className="ul-in">{d.library.backToLibrary}</span><Arrow /></Link>
          </div>
        </div>
      )}

      {products.length ? (
        <section className="section band-ivory" aria-labelledby="rp-title">
          <div className="wrap">
            <div className="kicker-row"><h2 id="rp-title" className="label">{d.library.relatedProducts}</h2></div>
            <div className="shelf">{products.map((p) => <ProductCard key={p.slug} card={toCard(p, locale, d)} locale={locale} placeholderLabel={d.a11y.placeholder} />)}</div>
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="rel-title">
        <div className="wrap">
          <div className="kicker-row">
            <h2 id="rel-title" className="label">{d.library.related}</h2>
            <Link href={L("/library")} className="text-link"><span className="ul-in">{d.library.backToLibrary}</span><Arrow /></Link>
          </div>
          <ul className="lib-list">
            {related.map((r) => (
              <li key={r.slug} className={`lib-item${r.status === "in-preparation" ? " lib-item--prep" : ""}`} data-reveal>
                <span className="label clay">{categoryLabel(r.category, locale)}</span>
                <div className="stack-sm">
                  <h3 className="lib-item__title serif"><Link href={L(`/library/${r.slug}`)}><span className="ul-in">{r.content[locale].title}</span></Link></h3>
                  <p className="muted" style={{ margin: 0 }}>{r.content[locale].standfirst}</p>
                </div>
                <span className="label muted">{r.status === "published" ? d.library.minRead(readingMinutes(r, locale)) : d.library.inPreparation}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Newsletter dict={d} />
    </article>
  );
}
