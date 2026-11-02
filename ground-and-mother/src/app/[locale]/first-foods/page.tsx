import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata } from "@/lib/seo";
import { PillarPage } from "@/components/PillarPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/first-foods">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = getDictionary(locale).pillars["first-foods"];
  return pageMetadata({ locale, path: "/first-foods", title: p.title, description: `${p.lede} ${p.intro.split(". ")[0]}.` });
}

export default async function FirstFoodsPage({ params }: PageProps<"/[locale]/first-foods">) {
  const { locale } = await params;
  return <PillarPage pillar="first-foods" locale={locale as Locale} dict={getDictionary(locale as Locale)} />;
}
