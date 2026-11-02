import type { Locale } from "./config";
import en from "./dictionaries/en";
import es from "./dictionaries/es";

const dictionaries = { en, es };
export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
export type { Dictionary } from "./dictionaries/en";
