import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

/** Sends locale-less URLs to the right language: /shop → /en/shop (or /es/shop for Spanish browsers). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const has = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (has) return;
  // A language the visitor chose before wins over the browser's preference.
  const saved = request.cookies.get("gm_locale")?.value;
  if (saved && (locales as readonly string[]).includes(saved)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${saved}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  const accept = request.headers.get("accept-language") || "";
  const preferred = accept.split(",").map((s) => s.trim().slice(0, 2).toLowerCase());
  const locale = preferred.find((p) => (locales as readonly string[]).includes(p)) || defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension.
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|icon.svg|opengraph-image|.*\\..*).*)"],
};
