import Link from "next/link";
import en from "@/i18n/dictionaries/en";
import { Arrow } from "@/components/Arrow";

// not-found.tsx receives no params; the English copy is used and links go to the English home.
export default function NotFound() {
  return (
    <section className="shop-head section">
      <div className="wrap closing">
        <span className="label clay">404</span>
        <h1 className="display" style={{ maxWidth: "14ch" }}>{en.common.notFoundTitle}</h1>
        <p className="lede muted prose">{en.common.notFoundBody}</p>
        <Link href="/en" className="btn"><span>{en.common.home}</span><Arrow /></Link>
      </div>
    </section>
  );
}
