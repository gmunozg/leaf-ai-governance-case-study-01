import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { formatPrice, getRelated, isPurchasable, productPath, type Product } from "@/content/products";
import { toCard } from "@/lib/product-view";
import { absolute } from "@/lib/seo";
import { site } from "@/content/site";
import { Media } from "./Media";
import { Crumbs } from "./Crumbs";
import { BuyBox } from "./BuyBox";
import { CheckoutButton } from "./CheckoutButton";
import { Faq } from "./Faq";
import { ProductCard } from "./ProductCard";
import { StatusPill } from "./StatusPill";
import { JsonLd } from "./JsonLd";
import { Words } from "./Words";

/** The premium editorial launch page every product gets, generated entirely from content/products.ts. */
export function ProductLanding({ product: p, locale, dict: d }: { product: Product; locale: Locale; dict: Dictionary }) {
  const c = p.content[locale];
  const L = (x: string) => `/${locale}${x}`;
  const ph = d.a11y.placeholder;
  const buyable = isPurchasable(p);
  const price = formatPrice(p, locale);
  const related = getRelated(p);
  const notifyHref = `/${locale}#letter`;
  const isApp = p.type === "app";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: c.title,
          description: c.standfirst,
          brand: { "@type": "Brand", name: site.name },
          category: d.types[p.type],
          url: absolute(productPath(p, locale)),
          ...(p.image ? { image: absolute(p.image.src) } : {}),
          ...(buyable && p.price != null
            ? { offers: { "@type": "Offer", price: p.price, priceCurrency: p.currency, availability: "https://schema.org/InStock", url: absolute(productPath(p, locale)) } }
            : {}),
        }}
      />

      {/* Hero */}
      <section className="p-hero" aria-labelledby="p-title">
        <div className="wrap">
          <div className="pillar-hero__top">
            <Crumbs label={d.a11y.breadcrumb} items={[{ name: d.nav.home, href: L("") }, { name: d.nav.shop, href: L("/shop") }, { name: c.title, href: productPath(p, locale) }]} />
            <StatusPill status={p.status} label={d.status[p.status]} />
          </div>
          <div className="p-hero__grid" style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}>
            <div className="p-hero__text">
              <span className="label clay" data-reveal>{d.collections[p.collection]} · {d.types[p.type]}</span>
              <h1 id="p-title" className="display" data-reveal="words"><Words text={c.title} /></h1>
              <p className="lede prose" data-reveal>{c.standfirst}</p>
              <div className="p-hero__facts" data-reveal>
                <div><span className="label muted">{d.product.collection}</span><span>{d.collections[p.collection]}</span></div>
                <div><span className="label muted">{d.product.format}</span><span>{d.types[p.type]}</span></div>
              </div>
              <div data-reveal><BuyBox product={p} locale={locale} dict={d} notifyHref={notifyHref} /></div>
            </div>
            <Media image={p.image} tone={p.tone} locale={locale} ratio="portrait" placeholderLabel={ph} brief={c.imageBrief} priority sizes="(min-width: 1024px) 46vw, 92vw" />
          </div>
        </div>
      </section>

      {/* Description, audience, problem */}
      <section className="section">
        <div className="wrap two-col">
          <span className="label clay">{buyable ? d.status.available : d.product.inDevelopment}</span>
          <div className="stack-lg">
            <div className="prose">{c.description.map((t, i) => <p key={i} className={i === 0 ? "h3 serif" : ""} style={i === 0 ? { fontWeight: 350, lineHeight: 1.35 } : undefined} data-reveal>{t}</p>)}</div>
            <div className="trio" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
              <div data-reveal><h2 className="label muted">{d.product.forWhom}</h2><p className="lede" style={{ margin: 0 }}>{c.audience}</p></div>
              <div data-reveal><h2 className="label muted">{d.product.problem}</h2><p className="lede" style={{ margin: 0 }}>{c.problem}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {c.features.length ? (
        <section className="section--tight" aria-labelledby="f-title">
          <div className="wrap">
            <div className="kicker-row"><h2 id="f-title" className="label">{buyable ? d.product.features : d.product.featuresPlanned}</h2><span className="label muted">{c.features.length}</span></div>
            <ol className="features">
              {c.features.map((f) => (
                <li key={f.title} data-reveal><h3 className="serif">{f.title}</h3><p>{f.body}</p></li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Screenshots & demo — real captures only */}
      {isApp ? (
        <section className="section on-dark" aria-labelledby="s-title">
          <div className="wrap">
            <div className="kicker-row"><h2 id="s-title" className="label">{d.product.screenshots}</h2></div>
            {p.screenshots.length ? (
              <div className="shelf">
                {p.screenshots.map((s) => (
                  <figure key={s.src} className="media" style={{ aspectRatio: `${s.width} / ${s.height}` }}>
                    <Image src={s.src} alt={s.alt[locale]} fill sizes="(min-width: 1100px) 30vw, 92vw" style={{ objectFit: "cover" }} />
                  </figure>
                ))}
              </div>
            ) : (
              <div className="pending-box" style={{ color: "var(--gm-on-dark-muted)", borderColor: "var(--gm-rule-on-dark)" }}>
                <span className="pill">{d.product.inDevelopment}</span>
                <p style={{ margin: 0 }}>{d.product.screenshotsPending}</p>
                <p style={{ margin: 0 }}>{d.product.demoPending}</p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {p.gallery.length ? (
        <section className="section--tight">
          <div className="wrap shelf">
            {p.gallery.map((g) => <Media key={g.src} image={g} tone={p.tone} locale={locale} placeholderLabel={ph} ratio="portrait" />)}
          </div>
        </section>
      ) : null}

      {/* Included + pricing */}
      <section className="section" aria-labelledby="inc-title">
        <div className="wrap two-col">
          <div className="stack">
            <h2 id="inc-title" className="label">{d.product.included}</h2>
          </div>
          <div className="grid" style={{ rowGap: "2.5rem" }}>
            <ul className="included" style={{ gridColumn: "1 / -1" }}>
              {c.included.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {c.faqs.length ? (
        <section className="section--tight" aria-labelledby="faq-title">
          <div className="wrap two-col">
            <h2 id="faq-title" className="label">{d.product.faqs}</h2>
            <Faq items={c.faqs} />
          </div>
        </section>
      ) : null}

      {/* Related */}
      {related.length ? (
        <section className="section band-ivory" aria-labelledby="rel-title">
          <div className="wrap">
            <div className="kicker-row"><h2 id="rel-title" className="label">{d.product.related}</h2><Link href={L("/shop")} className="text-link"><span className="ul-in">{d.common.allProducts}</span></Link></div>
            <div className="shelf">{related.map((r, i) => <ProductCard key={r.slug} card={toCard(r, locale, d)} locale={locale} placeholderLabel={ph} delay={i * 90} />)}</div>
          </div>
        </section>
      ) : null}

      {/* Closing CTA */}
      <section className="section" aria-labelledby="close-title">
        <div className="wrap closing">
          <span className="label clay">{c.title}</span>
          <h2 id="close-title" className="display" style={{ maxWidth: "14ch" }} data-reveal>{d.product.closingTitle}</h2>
          {buyable ? (
            <>
              {price ? <p className="lede">{price}</p> : null}
              <CheckoutButton product={p} locale={locale} dict={d} />
              <p className="buybox__note">{d.product.secureCheckout}</p>
            </>
          ) : (
            <>
              <p className="lede muted prose">{d.product.closingComingSoon}</p>
              <a href={notifyHref} className="btn"><span>{d.product.notify}</span></a>
            </>
          )}
        </div>
      </section>
    </>
  );
}
