import type { Metadata } from "next";
import { site } from "@/content/site";
import { locales, localeMeta, type Locale } from "@/i18n/config";

type Args = {
  locale: Locale;
  /** Path after the locale, starting with "/" or empty for the home page. */
  path: string;
  title?: string;
  description: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export function absolute(path: string) {
  return `${site.url}${path}`;
}

/** Canonical, hreflang alternates, Open Graph and Twitter tags for a localized page. */
export function pageMetadata({ locale, path, title, description, type = "website", noindex }: Args): Metadata {
  const url = `/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].htmlLang] = `/${l}${path}`;
  languages["x-default"] = `/en${path}`;
  // Branded share card rendered by app/[locale]/opengraph-image.tsx. Set explicitly so every page keeps it.
  const ogImage = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: site.name };
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${locale === "es" ? "Nutrición profunda desde el principio" : "Deep nourishment from the very beginning"}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage.url] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
