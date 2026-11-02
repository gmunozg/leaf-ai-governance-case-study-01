import Link from "next/link";
import type { CardData } from "@/lib/product-view";
import type { Locale } from "@/i18n/config";
import { Media } from "./Media";
import { StatusPill } from "./StatusPill";
import { Arrow } from "./Arrow";

export function ProductCard({ card, locale, placeholderLabel, ratio = "portrait", delay = 0 }: { card: CardData; locale: Locale; placeholderLabel: string; ratio?: "portrait" | "tall" | "square" | "land"; delay?: number }) {
  return (
    <article className="pcard" data-reveal style={{ "--d": delay } as React.CSSProperties}>
      <div className="pcard__media">
        {card.status !== "available" ? <StatusPill status={card.status} label={card.statusLabel} /> : null}
        <Media image={card.image} tone={card.tone} locale={locale} brief={card.brief} placeholderLabel={placeholderLabel} ratio={ratio} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 92vw" reveal={false} compact />
      </div>
      <div className="pcard__type label">
        <span>{card.collectionLabel}</span>
        <span>{card.typeLabel}</span>
      </div>
      <h3 className="pcard__title serif">
        <Link href={card.href}><span className="ul-in">{card.title}</span></Link>
      </h3>
      <p className="pcard__short">{card.short}</p>
      <div className="pcard__foot">
        <span className={card.status === "available" ? "" : "muted"}>{card.priceLabel}</span>
        <span className="go" aria-hidden="true"><Arrow /></span>
      </div>
    </article>
  );
}
