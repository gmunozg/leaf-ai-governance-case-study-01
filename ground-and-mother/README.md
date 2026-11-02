# Ground & Mother — website & digital storefront

*Deep nourishment from the very beginning.*

The official website for Ground & Mother: an editorial brand, the Nourishment Library, and the storefront for its digital guides and tiny apps. Built with Next.js (App Router) and TypeScript, with hand-written CSS and no UI or animation libraries.

> **Repository note.** This folder is self-contained. It was built inside the `leaf-ai-governance-case-study-01` repository only because that was the one repository available to the build session. No LEAF files were touched. Move this folder into its own repository (e.g. `ground-and-mother`) before deploying — see "Moving to its own repository" below.

---

## Run it

```bash
cd ground-and-mother
npm install
npm run dev          # http://localhost:3000  → redirects to /en (or /es for Spanish browsers)
```

Production build:

```bash
npm run build && npm start
npm run typecheck        # TypeScript
npm run check:products   # validates the product catalogue
```

Requires Node 20.9+ (Node 22.18+ for `check:products`).

## Deploy (Vercel recommended)

1. Push this folder to its own GitHub repository.
2. In Vercel: **New Project → import the repo**. Framework is detected automatically.
3. Add environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — your domain, e.g. `https://groundandmother.com` (canonical URLs, sitemap and share cards depend on it).
   - `GUMROAD_PING_SECRET`, `GUMROAD_ACCESS_TOKEN` — only needed once you sell interactive apps (see ARCHITECTURE.md).
4. Deploy. Every push to `main` redeploys automatically.

Any Node host that runs `next start` also works. A purely static export is **not** used, because the locale redirect (`src/proxy.ts`) and the payment-verification API routes need a server.

## Routes

| Route | Page |
|---|---|
| `/en`, `/es` | Home |
| `/{locale}/mother` · `/first-foods` · `/first-years` | The three editorial chapters |
| `/{locale}/library` | The Nourishment Library (search + category filter) |
| `/{locale}/library/{slug}` | Essay page |
| `/{locale}/shop` | Storefront (filter by Mother / First Foods / First Years / Family) |
| `/{locale}/shop/{slug}` | Landing page for guides, printables, collections, courses |
| `/{locale}/apps/{slug}` | Landing page for interactive tiny apps |
| `/{locale}/about` | About |
| `/{locale}/access` | "My purchases" — how buyers reach what they bought |
| `/{locale}/thank-you` | Post-checkout page (noindex; never claims a payment happened) |
| `/api/gumroad/ping` | Gumroad Ping receiver (server-side purchase verification) |
| `/api/licenses/verify` | Server-side Gumroad licence-key check |
| `/sitemap.xml`, `/robots.txt`, `/{locale}/opengraph-image` | SEO |

Any path without a locale (e.g. `/shop`) redirects to the visitor's language.

## Adding a digital product

Everything lives in **`src/content/products.ts`**. To add a product:

1. Copy an existing entry and give it a unique `slug` (lowercase-with-dashes).
2. Set `collection` (`mother`, `first-foods`, `first-years`, `family`) and `type` (`app`, `guide`, `printable`, `course`, `workshop`, `collection`, `subscription`). Apps get `/apps/{slug}`; everything else gets `/shop/{slug}`.
3. Write the English and Spanish `content`: title, short line, standfirst, description, audience, problem, features, what's included, FAQs.
4. Leave `status: "coming-soon"` until it is finished. Use `"unpublished"` to hide it completely.
5. When it is ready to sell:
   - Create the product in Gumroad and copy its share URL (e.g. `https://yourname.gumroad.com/l/abc123`) into `checkoutUrl`.
   - Set `price` (e.g. `24`) and `currency`.
   - Set `status: "available"`.
   - For apps: also set `gumroadProductId` (Gumroad → product → Advanced) and `accessUrl`.
6. Add real photography: put images in `public/images/…` and fill `image` (and optionally `gallery`). Add `screenshots` only from the real, working app.
7. Run `npm run check:products`, then push. The card, Shop listing, landing page, sitemap entry and structured data are all generated automatically.

## Adding an essay

Add an entry to **`src/content/articles.ts`**. Use `status: "in-preparation"` for an announced essay (shows title + standfirst with an honest label, `noindex`), and `status: "published"` with a `date` and a `body` in both languages when it is written. Cite real, checkable `sources` whenever an essay refers to research.

## Configuration you still need to provide

| What | Where | Status now |
|---|---|---|
| Brand photography | `public/images/` + `image` fields | **Placeholders.** Every slot shows a labelled placeholder carrying its art-direction brief (a ready-made shot list). |
| Founder portrait & biography | `src/i18n/dictionaries/*.ts` → `about` | **To be completed** — clearly marked on the About page. |
| Gumroad products | `src/content/products.ts` | No checkout URLs yet → all products show "Coming soon". |
| Prices | `src/content/products.ts` | `null` → "Price announced at launch". |
| Domain | `NEXT_PUBLIC_SITE_URL` | Falls back to `http://localhost:3000`. |
| Newsletter provider | `src/content/site.ts` → `newsletter` | Not connected. The form is shown disabled and says addresses are not being collected. |
| Social links, contact email | `src/content/site.ts` | Empty → hidden. |
| Spanish copy review | `src/i18n/dictionaries/es.ts`, Spanish fields in content | Written by hand from the English, **not yet reviewed by a native editor.** |
| Essay publication dates | `src/content/articles.ts` | Set to the build date — change to your real launch date. |

## Moving to its own repository

```bash
cp -r ground-and-mother ~/code/ground-and-mother
cd ~/code/ground-and-mother
git init && git add . && git commit -m "Ground & Mother website"
git remote add origin git@github.com:<you>/ground-and-mother.git
git push -u origin main
```

See **ARCHITECTURE.md** for the design system, the Gumroad integration and the paid-app access plan.
