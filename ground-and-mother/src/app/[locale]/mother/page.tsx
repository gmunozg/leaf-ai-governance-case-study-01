import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pageMetadata } from "@/lib/seo";
import { PillarPage } from "@/components/PillarPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/mother">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const p = getDictionary(locale).pillars["mother"];
  return pageMetadata({ locale, path: "/mother", title: p.title, description: `${p.lede} ${p.intro.split(". ")[0]}.` });
}

export default async function MotherPage({ params }: PageProps<"/[locale]/mother">) {
  const { locale } = await params;
  return <PillarPage pillar="mother" locale={locale as Locale} dict={getDictionary(locale as Locale)} />;
}
