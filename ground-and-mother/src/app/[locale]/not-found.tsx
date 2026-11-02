"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import en from "@/i18n/dictionaries/en";
import es from "@/i18n/dictionaries/es";
import { Arrow } from "@/components/Arrow";

// not-found receives no params, so the language is read from the URL.
export default function NotFound() {
  const pathname = usePathname() || "";
  const locale = pathname.startsWith("/es") ? "es" : "en";
  const d = locale === "es" ? es : en;
  return (
    <section className="shop-head section">
      <div className="wrap closing">
        <span className="label clay">404</span>
        <h1 className="display" style={{ maxWidth: "14ch" }}>{d.common.notFoundTitle}</h1>
        <p className="lede muted prose">{d.common.notFoundBody}</p>
        <Link href={`/${locale}`} className="btn"><span>{d.common.home}</span><Arrow /></Link>
      </div>
    </section>
  );
}
