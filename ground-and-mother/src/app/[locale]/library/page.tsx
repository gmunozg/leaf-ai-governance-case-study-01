import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata } from "@/lib/seo";
import { articles, categories, categoryLabel, readingMinutes } from "@/content/articles";
import { Media } from "@/components/Media";
import { Words } from "@/components/Words";
import { Crumbs } from "@/components/Crumbs";
import { LibraryBrowser, type LibItem } from "@/components/LibraryBrowser";
import { Newsletter } from "@/components/Newsletter";

export async function generateMetadata({ params }: PageProps<"/[locale]/library">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: "/library", title: d.library.title, description: d.library.intro });
}

export default async function LibraryPage({ params }: PageProps<"/[locale]/library">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const L = (p: string) => `/${locale}${p}`;
  const featured = articles.find((a) => a.featured && a.status === "published")!;
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });

  const items: LibItem[] = articles
    .filter((a) => a.slug !== featured.slug)
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "published" ? -1 : 1))
    .map((a) => ({
      slug: a.slug,
      href: L(`/library/${a.slug}`),
      title: a.content[locale].title,
      standfirst: a.content[locale].standfirst,
      category: a.category,
      categoryLabel: categoryLabel(a.category, locale),
      status: a.status,
      meta: a.status === "published" && a.date ? `${fmt.format(new Date(a.date))} · ${d.library.minRead(readingMinutes(a, locale))}` : "",
      tone: a.tone,
    }));

  return (
    <>
      <section className="shop-head" aria-labelledby="lib-title">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: d.nav.library, href: L("/library") }]} />
            <span className="label muted">{d.library.kicker}</span>
          </div>
          <h1 id="lib-title" className="mega" style={{ marginTop: "2rem", maxWidth: "11ch" }} data-reveal="words"><Words text={d.library.title} /></h1>
          <p className="lede prose" style={{ marginTop: "2rem" }} data-reveal>{d.library.intro}</p>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <Link href={L(`/library/${featured.slug}`)} className="lib-feature">
            <Media tone={featured.tone} locale={locale} ratio="land" placeholderLabel={d.a11y.placeholder} brief={featured.content[locale].imageBrief} priority sizes="(min-width: 1024px) 58vw, 92vw" />
            <div className="lib-feature__text" data-reveal>
              <span className="label clay">{d.library.featured} · {categoryLabel(featured.category, locale)}</span>
              <h2 className="h1"><span className="ul-in">{featured.content[locale].title}</span></h2>
              <p className="lede muted">{featured.content[locale].standfirst}</p>
              <span className="label muted">{d.library.minRead(readingMinutes(featured, locale))}</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section" aria-label={d.library.search}>
        <div className="wrap">
          <LibraryBrowser
            items={items}
            categories={categories.map((c) => ({ id: c.id, label: c.label[locale] }))}
            labels={{
              search: d.library.search,
              searchPlaceholder: d.library.searchPlaceholder,
              all: d.library.all,
              filterLabel: d.library.search,
              noResults: d.library.noResults,
              inPreparation: d.library.inPreparation,
              results: Array.from({ length: items.length + 1 }, (_, i) => d.library.resultsCount(i)),
            }}
            locale={locale}
            placeholderLabel={d.a11y.placeholder}
          />
        </div>
      </section>
      <Newsletter dict={d} />
    </>
  );
}
