import { isPurchasable, formatPrice, type Product } from "@/content/products";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { Arrow } from "./Arrow";

/**
 * Reusable Gumroad checkout trigger, styled as a Ground & Mother button.
 *
 * When a product is purchasable it renders a plain link to the product's Gumroad URL.
 * The official gumroad.js script (loaded once in the root layout) turns links to Gumroad
 * products into the Gumroad overlay, so checkout happens on top of this page.
 *  - data-gumroad-overlay-checkout="true" opens the overlay straight at the checkout step.
 *  - data-gumroad-single-product="true" keeps the overlay to this one product.
 *  - We deliberately omit the "gumroad-button" class so Gumroad's own button styling is not applied.
 * If the script is blocked or fails, the link still works: Gumroad's checkout opens in a new tab.
 *
 * Products that are not purchasable render a disabled, honest "Coming soon" state instead.
 */
export function CheckoutButton({ product, locale, dict, block, notifyHref }: { product: Product; locale: Locale; dict: Dictionary; block?: boolean; notifyHref?: string }) {
  const cls = `btn${block ? " btn--block" : ""}`;
  if (!isPurchasable(product)) {
    return (
      <div className="stack-sm">
        <span className={cls} aria-disabled="true">
          {dict.product.comingSoonCta}
        </span>
        {notifyHref ? (
          <a className="text-link" href={notifyHref}>
            <span className="ul-in">{dict.product.notify}</span>
            <Arrow />
          </a>
        ) : null}
      </div>
    );
  }
  const price = formatPrice(product, locale);
  const label = price ? `${dict.product.buyFor} ${price}` : dict.product.buy;
  return (
    <a
      className={cls}
      href={product.checkoutUrl!}
      data-gumroad-overlay-checkout="true"
      data-gumroad-single-product="true"
      target="_blank"
      rel="noopener"
      aria-label={`${label} — ${product.content[locale].title}`}
    >
      <span>{label}</span>
      <Arrow />
    </a>
  );
}
