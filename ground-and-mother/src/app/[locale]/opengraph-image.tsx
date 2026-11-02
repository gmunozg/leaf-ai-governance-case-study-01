import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";

export const alt = "Ground & Mother";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Branded social sharing card, rendered at build time with the Fraunces typeface. */
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = getDictionary(isLocale(locale) ? locale : "en");
  const dir = join(process.cwd(), "node_modules/@fontsource/fraunces/files");
  const [regular, italic] = await Promise.all([
    readFile(join(dir, "fraunces-latin-400-normal.woff")),
    readFile(join(dir, "fraunces-latin-400-italic.woff")),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f2ece0", color: "#1c2a21", padding: "64px 72px", fontFamily: "Fraunces" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", borderBottom: "1px solid rgba(28,42,33,.4)", paddingBottom: 18 }}>
          <span>Ground &amp; Mother</span>
          <span style={{ color: "#545e52" }}>{d.nav.libraryFull}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.98, letterSpacing: -3 }}>
          <span>{d.meta.tagline.split(" ").slice(0, 2).join(" ")}</span>
          <span style={{ fontStyle: "italic", color: "#9c4f2a" }}>{d.meta.tagline.split(" ").slice(2).join(" ")}</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#545e52" }}>{d.nav.mother} · {d.nav.firstFoods} · {d.nav.firstYears}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: regular, style: "normal", weight: 400 },
        { name: "Fraunces", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
