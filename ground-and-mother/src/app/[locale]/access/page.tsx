import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { getPublishedProducts, productPath } from "@/content/products";
import { Crumbs } from "@/components/Crumbs";
import { StatusPill } from "@/components/StatusPill";

export async function generateMetadata({ params }: PageProps<"/[locale]/access">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: "/access", title: d.access.title, description: d.access.lede });
}

export default async function AccessPage({ params }: PageProps<"/[locale]/access">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const x = d.access;
  const L = (p: string) => `/${locale}${p}`;
  const apps = getPublishedProducts().filter((p) => p.requiresAccessControl);
  const live = apps.filter((p) => p.status === "available" && p.accessUrl);
  return (
    <>
      <section className="shop-head">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: x.kicker, href: L("/access") }]} />
          </div>
          <h1 className="display" style={{ marginTop: "2rem", maxWidth: "16ch" }} data-reveal>{x.title}</h1>
          <p className="lede prose" style={{ marginTop: "1.5rem" }}>{x.lede}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap about-sections">
          <section><h2 className="h3">{x.guides.title}</h2><p className="prose lede">{x.guides.body}</p></section>
          <section><h2 className="h3">{x.apps.title}</h2><p className="prose lede">{x.apps.body}</p></section>
          <section>
            <h2 className="h3">{x.status.title}</h2>
            <div className="stack">
              {live.length === 0 ? <p className="prose lede">{x.status.body}</p> : null}
              <ul className="applist" style={{ borderColor: "var(--gm-rule)" }}>
                {apps.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.status === "available" && p.accessUrl ? p.accessUrl : productPath(p, locale)} style={{ borderColor: "var(--gm-rule)" }}>
                      <span className="serif">{p.content[locale].title}</span>
                      <StatusPill status={p.status} label={d.status[p.status]} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {site.contactEmail ? (
            <section><h2 className="h3">{x.help}</h2><p><a className="ul" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p></section>
          ) : null}
        </div>
      </section>
    </>
  );
}
