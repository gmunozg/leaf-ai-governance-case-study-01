# Ground & Mother — design & technical architecture

## 1. Art direction

**Concept: "The Kitchen Almanac."** The site behaves like an independent food magazine that happens to sell things: a masthead, folio numbers, roman-numeral chapters, ruled columns, generous margins and big, soft serif type. Commerce is set in the same editorial grammar so the shop never feels like a different website.

### Palette (`src/styles/tokens.css`)

| Token | Hex | Role |
|---|---|---|
| `--gm-paper` | `#f2ece0` | Natural paper. The page itself. |
| `--gm-ivory` | `#f9f5ec` | Raised surfaces (buy box, product bands). |
| `--gm-oat` | `#e6dccb` | Deeper paper for the newsletter band. |
| `--gm-ink` | `#1c2a21` | Forest-black body text, never pure black. |
| `--gm-forest` / `--gm-forest-deep` | `#26402f` / `#172619` | Brand green; dark "night kitchen" sections and footer. |
| `--gm-sage` / `--gm-sage-soft` | `#8b977b` / `#ccd0bb` | Muted sage tints. |
| `--gm-earth` | `#6b4a33` | Earthy brown ("coming soon" states). |
| `--gm-clay` | `#9c4f2a` | The single warm accent: italics, numerals, focus rings. Passes WCAG AA on paper. |
| `--gm-yolk` | `#d8a23f` | Tiny highlights on dark only. |

### Typography

- **Fraunces** (variable, self-hosted via Fontsource): headlines, using the optical-size, `SOFT` and `WONK` axes. Upright for statements; soft, slightly wonky italic in clay for emphasis. The italic is the brand's voice.
- **Instrument Sans** (variable): body copy, UI and tracked uppercase labels.
- Fluid type scale with `clamp()`; body at 17px, measured line lengths (~62ch), `text-wrap: balance/pretty`.

Fonts are bundled with the site, so there are no third-party font requests.

### Signature elements

- The **ampersand**: Fraunces italic in clay, on the wordmark, in the giant footer mark and on the share card.
- The **sprig**: one botanical drawing (`src/components/Sprig.tsx`) used for the cursor, the placeholders and the favicon.
- **Paper grain**: a tiny tiled SVG noise overlay. It uses no blend modes, so it stays cheap on old phones.
- **Rules instead of cards**: most lists are typographic indexes separated by hairlines. Image cards appear only where products need them.

### Photography placeholders

No brand photography existed, so every image slot renders a **labelled placeholder** ("Photography placeholder") showing a study of window light in the slot's tone, plus the **art-direction brief** for the real photograph (e.g. *"Close-up, window light: a small hand reaching for a soft-cooked egg yolk on a wooden spoon."*). Taken together, these briefs are the shot list for the brand shoot. Once a real image is set in the content config, it replaces the placeholder automatically (via `next/image`, AVIF/WebP, responsive sizes).

## 2. Interaction design

All of it is CSS plus about 150 lines of vanilla JS. There are no animation libraries and no WebGL.

| Effect | Where | Implementation |
|---|---|---|
| Botanical cursor | Desktop only (`hover: hover` + `pointer: fine`) | `SprigCursor` trails the pointer with easing, sways with horizontal speed, opens its leaves and turns clay over links. The native cursor stays visible. The animation loop stops when the sprig is still. |
| Image reveals | Every photo slot | A curtain wipe (`clip-path`) plus a settling scale, triggered once by one shared `IntersectionObserver`; a slow zoom on hover. |
| Headline movement | Hero, chapter titles, closing | Words are split server-side into masked spans that rise in sequence. Screen readers still read plain text. |
| Chapter index | Home | Rows slide into italic on hover, and a photograph floats beside the pointer. On touch devices the image sits inline instead. |
| Scroll rhythm | Everywhere | Staggered fade/rise reveals, a hairline masthead that draws itself, and a slow ingredient marquee that pauses on hover. |
| Header | Everywhere | Compresses onto paper after scrolling, hides while you scroll down and returns when you scroll up. |
| Mobile menu | < 1024px | Full-screen forest panel with a curtain reveal, staggered serif links, focus trap, Escape to close and scroll lock. |
| Page transitions | Every route change | `template.tsx` gives each page a soft rise. |
| Micro-interactions | Buttons, links | Buttons fill with clay from the bottom; underlines draw and retract; arrows nudge; FAQ plus signs rotate. |

**Safety rails:**
- Under `prefers-reduced-motion: reduce`, every reveal renders in its final state, the marquee becomes a static wrapped list, and the cursor and page transitions are disabled.
- Content is only hidden for animation when JavaScript has run (an `html.js` class set before first paint), so no-JS visitors and crawlers always see everything.
- Verified: no horizontal overflow at 390, 820 and 1440px; visible focus rings; skip link; 44px touch targets.

## 3. Code structure

```
src/
  app/
    [locale]/            all pages (root layout lives here: <html lang> per locale)
      layout.tsx         header, footer, cursor, reveals, Gumroad script (conditional)
      template.tsx       page-enter transition
      page.tsx           home
      mother|first-foods|first-years/   chapters (shared PillarPage)
      library/ library/[slug]/
      shop/ shop/[slug]/ apps/[slug]/    (shared ProductLanding)
      about/ access/ thank-you/ not-found.tsx [...rest]/
      opengraph-image.tsx
    api/gumroad/ping/    purchase verification webhook
    api/licenses/verify/ licence key check
    sitemap.ts robots.ts
  components/            reusable UI (ProductCard, CheckoutButton, BuyBox, Faq, Media, …)
  content/
    products.ts          ← the product catalogue (single source of truth)
    articles.ts          ← the Library
    site.ts              ← newsletter, socials, contact, Gumroad script URL
  i18n/
    config.ts            locales, helpers
    dictionaries/en.ts   UI + page copy (English source of truth)
    dictionaries/es.ts   Spanish (type-checked to match English exactly)
  lib/                   SEO, view models, server-only Gumroad + entitlement code
  styles/tokens.css      design tokens (shareable with the tiny apps)
  styles/globals.css     the design system
  proxy.ts               locale redirect for locale-less URLs
```

Every page is statically pre-rendered (SSG). Only the two API routes and the locale redirect run on the server.

## 4. Internationalisation

- Sub-path routing: `/en/...` and `/es/...`, with `<html lang>`, `hreflang` alternates, `x-default`, `og:locale` and localized metadata on every page.
- The language switcher keeps you on the same page in the other language.
- `/` and other locale-less paths redirect based on `Accept-Language`.
- `es.ts` is typed as `Dictionary`, so the build fails if a Spanish string is missing. Products and essays carry both languages side by side.
- English is the editorial source. The Spanish was written by hand, not machine-translated, but **should be reviewed by a native editor** before launch.

## 5. Commerce & Gumroad

**Integration method:** Gumroad's official overlay. `CheckoutButton` renders a normal `<a href="{checkoutUrl}">` styled as a Ground & Mother button, with:

- `data-gumroad-overlay-checkout="true"`: opens the overlay straight at checkout.
- `data-gumroad-single-product="true"`: limits the overlay to this product.
- No `gumroad-button` class, so Gumroad's own button styling is not applied.

The official script `https://gumroad.com/js/gumroad.js` is loaded **once** in the root layout (`next/script`, `lazyOnload`), and **only when at least one product is purchasable**. If the script is blocked, the link still opens Gumroad's checkout in a new tab, so visitors never get stuck.

**States** (from `status` + `checkoutUrl`):
- *Available* + URL → "Buy for $24" button, secure-checkout note, `Offer` in structured data.
- *Coming soon* (or available without a URL) → a disabled "Coming soon" button, "Price announced at launch", and a "Hear when it opens" link to the newsletter.
- *Unpublished* → no card, no page (404), no sitemap entry.

**Verified in this build:** with a temporary test entry, the buy buttons rendered with the overlay attributes, the script tag was injected, and the `Offer` JSON-LD appeared. The test entry was then reverted. A live purchase could not be tested: the build environment cannot reach gumroad.com, and there is no Gumroad account connected.

> ⚠️ Gumroad's documentation pages could not be fetched from the build environment (network policy). The attribute names and API endpoints follow Gumroad's published docs as known at build time. Re-check them against https://gumroad.com/help/article/44-build-gumroad-into-your-website and https://gumroad.com/api before launch.

**Post-purchase:** `/{locale}/thank-you` is ready if you set Gumroad's post-purchase redirect (where your product settings offer one) to point there. It never claims a payment happened. The Gumroad receipt email is the buyer's confirmation.

## 6. Paid app access

A hidden or public URL is **not** access control. Gumroad delivers files for guides, but it does not protect a custom web app.

### What exists now

1. **Separation.** The marketing site never contains the apps. Each app has its own `accessUrl` (recommended: its own subdomain, e.g. `companion.groundandmother.com`).
2. **Server-side purchase verification: `POST /api/gumroad/ping`.**
   - Configure Gumroad → Settings → Advanced → *Ping* as `https://<domain>/api/gumroad/ping?secret=<GUMROAD_PING_SECRET>`.
   - The handler compares the shared secret in constant time, then **re-fetches the sale from Gumroad's API** with the private `GUMROAD_ACCESS_TOKEN`. The ping body alone is never trusted.
   - It maps the sale to a product via `gumroadProductId`, then grants access (or revokes it on refund/chargeback).
   - Returns `503` until both secrets are set.
3. **Entitlement seam.** `src/lib/entitlements.server.ts` defines `EntitlementStore` (`grant` / `revoke` / `has`). It is **intentionally not connected to a database**: it throws, and the ping handler answers `501`. That way nobody can believe access is being stored when it isn't.
4. **Licence-key check: `POST /api/licenses/verify`** with `{ product, licenseKey }` → `{ valid }`. It calls Gumroad's licence verification server-side (refunds, chargebacks and ended subscriptions count as invalid). This is a workable interim gate for an app: enable "Generate a unique license key" on the Gumroad product, and the app asks for the key once.
5. **Secrets** live only in server environment variables (`.env.example`). Nothing sensitive is in client code.

### Recommended path when the first app launches

```
Gumroad checkout ──Ping──▶ /api/gumroad/ping ──confirm sale via API──▶ Gumroad
                                   │
                                   ▼
                     entitlements table (email, product, sale_id, revoked_at)
                                   ▲
companion.groundandmother.com ─────┘  server checks has(email, product)
   └─ sign-in by magic link to the purchase email (Supabase Auth / Auth.js / Clerk)
```

- **Database:** Postgres (Supabase or Neon free tier) with one `entitlements` table. Implement `EntitlementStore` against it; nothing else changes.
- **Accounts:** passwordless magic-link sign-in to the email used at checkout. This covers password reset (there is no password), account management and purchase history (query the entitlements by email).
- **Revocation:** handled by Ping refunds, plus a periodic re-check of sales via the API for disputes.
- **Subscriptions** (later): use Gumroad's subscription fields (`subscription_ended_at`, etc.), which the licence check already respects.
- **Shared identity:** put the apps on subdomains of one domain so a single sign-in session can be shared across them.

**Not functional yet (by design):** stored entitlements, user accounts, and access protection inside the apps. The apps themselves don't exist yet, and nothing here claims otherwise.

## 7. Tiny-app ecosystem

- Each app is a separate application (its own repo or folder, e.g. a small Next.js or Vite app) deployed to its own subdomain.
- **Shared identity:** copy `src/styles/tokens.css` and the two Fontsource packages into each app (or publish them as a tiny `@groundandmother/tokens` package), so the whole ecosystem shares one palette, type system and motion curve.
- **Discovery and sales** stay in this site: the product config drives the Shop, landing pages, the Interactive tools section on Home, the First Foods Companion feature on the First Foods chapter, and the "My purchases" page. When an app goes live, the `/access` page links to it automatically once `status: "available"` and `accessUrl` are set.

## 8. SEO

- Per-page titles, meta descriptions, canonical URLs, hreflang alternates, Open Graph and Twitter cards.
- A branded share image per locale, rendered at build time in Fraunces.
- Structured data: `Organization`, `WebSite`, `BreadcrumbList`, `Article` (published essays only), `Product` (with an `Offer` only when actually purchasable), `FAQPage`, `ItemList`.
- `sitemap.xml` lists only public URLs in both languages, with alternates. Unpublished products and in-preparation essays are excluded, and in-preparation essays are `noindex`.
- `robots.txt` excludes `/api/` and the thank-you pages.
- Metadata contains no health claims.

## 9. QA performed

- Production build and `tsc` pass; `npm run check:products` passes.
- Rendered and inspected at desktop (1440), tablet (820) and mobile (390), English and Spanish.
- Crawled 49 internal pages: no broken links.
- Checked: unpublished product → 404 and absent from the sitemap; wrong route type (`/apps/the-iron-edit`) → 404.
- Checked interactions: mobile menu (focus trap, Escape, language switch inside), `<html lang>` updates, Shop filter, Library search and filter, keyboard focus rings, skip link, botanical cursor.
- Checked fallbacks: reduced motion (everything visible, marquee static) and no-JS (everything visible).
- API routes return honest errors when not configured (`503`, `404`, `400`).
- No console errors.
- JS ≈ 184 KB gzipped per page, which is mostly the React/Next runtime. Fonts are self-hosted with `unicode-range` subsetting.

## 10. Phase 1: cinematic botanical homepage

**Concept: the nourishment cycle.** From soil, to food, to mother, to child. The homepage is one continuous story held together by a growing root.

- **Opening scene** (`SeedHero.tsx`): a seed resting in rendered soil. A sticky stage sits inside a 330svh section, so native scrolling is never hijacked. Scroll progress drives CSS variables for each stage: the seed coat cracks, the root system draws itself, the shoot rises, the seed leaves unfold, and the soil gives way to ivory with the caption "From soil, to food, to mother, to child."
  - Desktop: the seed leans toward the pointer and a warm light follows it.
  - Touch: dragging moves the light and tapping the seed makes it stir.
  - Reduced motion and no-JS visitors get one static, fully grown composition.
- **Root system** (`lib/roots.ts`): a deterministic generator applying simple plant rules (gravitropism, tapering by branch order, alternating laterals). Every segment gets its own time window, and growth is mapped to `stroke-dashoffset` through a single CSS variable, so there is one style write per frame.
- **Root line** (`RootLine.tsx`): a single root in the left margin that grows with reading progress through the homepage, carrying four botanical notes (radicle, root hairs, mycorrhizae, cotyledons). On phones the notes become inline chips.
- **Nourishment cycle band:** four steps (soil, food, mother, child) joined by a line that inks itself in.
- **Food journal** (`FoodJournal.tsx`, `content/foods.ts`): eight plates in an asymmetric layout. Each opens a modal `<dialog>` with nutrition notes, tradition, kitchen use, a "try this" idea, safety notes where guidance varies, and real sources.
  - Arrow keys and swipe move between entries; Escape closes and returns focus.
  - All entries are in the HTML, so they are readable without JS and indexable.
- **Header** switches to light text while it sits over the soil.
- **Language choice** is remembered in a cookie (`gm_locale`) that `proxy.ts` honours for locale-less URLs.
- **Soil texture:** a procedural render (`scripts/render-soil.py`, 197 KB JPEG), not a photograph.
- **Photography pipeline:** see PHOTOGRAPHY.md (`scripts/shot-list.mjs` regenerates it), `scripts/add-photo.mjs` and `src/content/photo-credits.json`.
- **Interactive preview:** `scripts/preview/export.py` produces a static, interactive copy for sharing without a server.
