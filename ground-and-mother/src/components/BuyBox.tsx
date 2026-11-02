import { formatPrice, isPurchasable, type Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { CheckoutButton } from "./CheckoutButton";
import { StatusPill } from "./StatusPill";

export function BuyBox({ product, locale, dict, notifyHref }: { product: Product; locale: Locale; dict: Dictionary; notifyHref: string }) {
  const price = formatPrice(product, locale);
  const buyable = isPurchasable(product);
  return (
    <div className="buybox">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <span className="label muted">{dict.product.pricing}</span>
        <StatusPill status={product.status} label={dict.status[product.status]} />
      </div>
      {price ? (
        <p className="buybox__price" style={{ margin: 0 }}>
          {price} <span className="label muted" style={{ fontFamily: "var(--gm-sans)" }}>{dict.billing[product.billing]}</span>
        </p>
      ) : (
        <p className="buybox__price buybox__price--tba" style={{ margin: 0 }}>{dict.product.priceTba}</p>
      )}
      <CheckoutButton product={product} locale={locale} dict={dict} block notifyHref={buyable ? undefined : notifyHref} />
      <p className="buybox__note">{buyable ? dict.product.secureCheckout : dict.product.notPurchasable}</p>
      {product.requiresAccessControl ? <p className="buybox__note">{dict.product.accessNote}</p> : null}
    </div>
  );
}
