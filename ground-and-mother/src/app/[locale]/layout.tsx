import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/instrument-sans";
import "@/styles/globals.css";
import { isLocale, locales, localeMeta } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { site } from "@/content/site";
import { anyPurchasable } from "@/content/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/Motion";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#f2ece0",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    applicationName: site.name,
    description: d.meta.description,
    icons: { icon: "/icon.svg" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const L = (p: string) => `/${locale}${p}`;
  const items = [
    { href: L(""), label: d.nav.home },
    { href: L("/mother"), label: d.nav.mother },
    { href: L("/first-foods"), label: d.nav.firstFoods },
    { href: L("/first-years"), label: d.nav.firstYears },
    { href: L("/library"), label: d.nav.library },
    { href: L("/shop"), label: d.nav.shop },
    { href: L("/about"), label: d.nav.about },
  ];

  return (
    <html lang={localeMeta[locale].htmlLang}>
      <head>
        {/* Marks JS as available before first paint, so reveal animations never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">{d.a11y.skip}</a>
        <Header
          locale={locale}
          items={items}
          labels={{ menuOpen: d.a11y.menuOpen, menuClose: d.a11y.menuClose, language: d.a11y.language, primaryNav: d.a11y.primaryNav, menu: locale === "es" ? "Menú" : "Menu", home: d.nav.home }}
        />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer locale={locale} dict={d} />
        <RevealObserver />
        {/* Official Gumroad overlay script — loaded once, and only when something is actually for sale. */}
        {anyPurchasable() ? <Script id="gumroad-js" src={site.gumroad.scriptSrc} strategy="lazyOnload" /> : null}
      </body>
    </html>
  );
}
