export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US" },
  es: { label: "Español", short: "ES", htmlLang: "es", ogLocale: "es_ES" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A string that exists in every locale. English is the editorial source; Spanish should be reviewed by a native editor. */
export type Localized<T = string> = Record<Locale, T>;

export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale];
}
