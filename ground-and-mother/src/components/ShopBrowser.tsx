"use client";

import { useMemo, useState } from "react";
import type { CardData } from "@/lib/product-view";
import type { Locale } from "@/i18n/config";
import { ProductCard } from "./ProductCard";

export function ShopBrowser({ cards, filters, labels, locale, placeholderLabel }: { cards: CardData[]; filters: { id: string; label: string }[]; labels: { filterLabel: string; empty: string; counts: string[] }; locale: Locale; placeholderLabel: string }) {
  const [active, setActive] = useState("all");
  const shown = useMemo(() => (active === "all" ? cards : cards.filter((c) => c.collection === active)), [cards, active]);
  return (
    <>
      <div className="shop-filters">
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div className="chips" role="group" aria-label={labels.filterLabel} style={{ flex: 1 }}>
            {filters.map((f) => (
              <button key={f.id} type="button" className="chip" aria-pressed={active === f.id} onClick={() => setActive(f.id)}>{f.label}</button>
            ))}
          </div>
          <span className="label muted count" aria-live="polite" style={{ whiteSpace: "nowrap" }}>{labels.counts[shown.length] ?? `${shown.length}`}</span>
        </div>
      </div>
      <div className="wrap">
        {shown.length === 0 ? (
          <p className="lede muted" style={{ paddingBottom: "4rem" }}>{labels.empty}</p>
        ) : (
          <div className="shelf shelf--stagger">
            {shown.map((c, i) => (
              <ProductCard key={c.slug} card={c} locale={locale} placeholderLabel={placeholderLabel} delay={(i % 3) * 90} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
