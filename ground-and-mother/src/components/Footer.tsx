import Link from "next/link";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { getPublishedProducts, productPath } from "@/content/products";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const L = (p: string) => `/${locale}${p}`;
  const social = Object.entries(site.social).filter(([, v]) => v);
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer on-dark">
      <div className="wrap">
        <div className="footer-cols">
          <p className="footer-statement lede">{dict.footer.statement}</p>
          <nav aria-label={dict.a11y.footerNav}>
            <h2 className="label">{dict.footer.explore}</h2>
            <ul>
              <li><Link href={L("/mother")}>{dict.nav.mother}</Link></li>
              <li><Link href={L("/first-foods")}>{dict.nav.firstFoods}</Link></li>
              <li><Link href={L("/first-years")}>{dict.nav.firstYears}</Link></li>
              <li><Link href={L("/library")}>{dict.nav.libraryFull}</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="label">{dict.footer.shop}</h2>
            <ul>
              <li><Link href={L("/shop")}>{dict.common.allProducts}</Link></li>
              {getPublishedProducts().filter((p) => p.type === "app").slice(0, 3).map((p) => (
                <li key={p.slug}><Link href={productPath(p, locale)}>{p.content[locale].title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label">{dict.footer.studio}</h2>
            <ul>
              <li><Link href={L("/about")}>{dict.nav.about}</Link></li>
              <li><Link href={L("/access")}>{dict.nav.access}</Link></li>
              <li><Link href={`/${locale}#letter`}>{dict.newsletter.kicker}</Link></li>
              {site.contactEmail ? <li><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li> : null}
              {social.map(([k, v]) => (
                <li key={k}><a href={v} rel="me noopener" target="_blank" style={{ textTransform: "capitalize" }}>{k}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap footer-legal">
        <p style={{ margin: 0 }}>{dict.footer.disclaimer}</p>
        <div className="stack-sm">
          <p style={{ margin: 0 }}>{dict.footer.placeholderNotice}</p>
          <p style={{ margin: 0 }}>© {year} Ground &amp; Mother. {dict.footer.rights}</p>
        </div>
      </div>
      <div className="wrap">
        <p className="footer-mark" aria-hidden="true">Ground<span className="amp">&amp;</span>Mother</p>
      </div>
    </footer>
  );
}
