import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata } from "@/lib/seo";
import { Arrow } from "@/components/Arrow";

/**
 * Post-checkout landing page. It deliberately does not claim a purchase happened:
 * a redirect is not proof of payment. Gumroad's receipt (and our server-side Ping) is.
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/thank-you">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return pageMetadata({ locale, path: "/thank-you", title: d.thankYou.kicker, description: d.thankYou.body, noindex: true });
}

export default async function ThankYouPage({ params }: PageProps<"/[locale]/thank-you">) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const t = d.thankYou;
  const L = (p: string) => `/${locale}${p}`;
  return (
    <section className="shop-head section">
      <div className="wrap stack" style={{ maxWidth: "60rem", marginInline: "auto" }}>
        <span className="label clay">{t.kicker}</span>
        <h1 className="display">{t.title}</h1>
        <p className="lede prose">{t.body}</p>
        <p className="notice">{t.note}</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href={L("/access")} className="btn"><span>{d.nav.access}</span><Arrow /></Link>
          <Link href={L("/library")} className="btn btn--ghost"><span>{d.common.visitLibrary}</span></Link>
        </div>
      </div>
    </section>
  );
}
