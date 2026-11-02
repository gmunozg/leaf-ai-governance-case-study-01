import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { locales, localeMeta } from "@/i18n/config";
import { articles } from "@/content/articles";
import { getPublishedProducts } from "@/content/products";

/** Every public, localized URL with hreflang alternates. Unpublished products and unwritten essays are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/mother", "/first-foods", "/first-years", "/library", "/shop", "/about", "/access",
    ...articles.filter((a) => a.status === "published").map((a) => `/library/${a.slug}`),
    ...getPublishedProducts().map((p) => (p.type === "app" ? `/apps/${p.slug}` : `/shop/${p.slug}`)),
  ];
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((x) => [localeMeta[x].htmlLang, `${site.url}/${x}${path}`])) },
    })),
  );
}
