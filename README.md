# FitCart AI — Interactive Stakeholder Demo

A clickable product prototype that shows how **FitCart AI** works: an **AI try-on + fit-intelligence layer that sits between shoppers and the fashion stores they already use** (Myntra, AJIO, Amazon, Flipkart, Nykaa, Meesho).

> This is a **demo/prototype for stakeholder validation** — not a production app. There are no real accounts, payments, or store integrations. All data is realistic but simulated, and the AI try-on/fit results are computed by lightweight demo logic (clearly labelled).

---

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:5173**

Build a production bundle with `npm run build` and preview it with `npm run preview`.

No environment variables, backend, or login required — the app opens straight into an interactive **guest** session.

> Routing uses `HashRouter`, so URLs look like `…/#/studio`, `…/#/pricing`, `…/#/admin`. This makes the build work on any static host (GitHub Pages, Vercel, Netlify) with **no server config and no 404 on refresh**.

---

## Deploy (shareable stakeholder link)

The build is a fully static site (`dist/`) — host it anywhere. Pick one:

### Option A — Vercel (fastest, works on any GitHub plan)
1. Go to **vercel.com → New Project → Import** `jeet9909/fitcartai` (authorize GitHub once).
2. Framework preset auto-detects **Vite** (build `npm run build`, output `dist`). Click **Deploy**.
3. Share the `https://<project>.vercel.app` URL. (Private repo → public demo URL — stakeholders don’t need repo access.)

### Option B — Netlify
New site → import the repo → build `npm run build`, publish `dist` → Deploy. (`netlify.toml` is already included.)

### Option C — GitHub Pages (automated, needs Pages-capable plan)
A workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main` and tries to auto-enable Pages. If your account allows Pages on **private** repos (GitHub Pro/Team/Enterprise), the site publishes to:
`https://jeet9909.github.io/fitcartai/`
Check **Repo → Actions** for the run and **Settings → Pages** for the URL. (On the Free plan, Pages requires a public repo — use Option A/B instead.)


---

## The product concept (who/what/why)

| Role | In the demo |
|---|---|
| **Buyer** | The shopper — browses cross-store, builds an outfit, tries it on an avatar, checks fit, hands off to the store |
| **Intermediary** | **FitCart AI** — avatar try-on, Fit Score, Outfit Score, cross-store cart, affiliate handoff (it does *not* run checkout) |
| **Seller side** | The connected **stores & brands** — shown as the **Brand / Partner dashboard** (`/partner`), the B2B "seller" view of fit analytics, traffic, and return-reduction |
| **Operator** | **FitCart staff** — the internal **Admin console** (`/admin`) to manage accounts, stores, partners, moderation, and the revenue/cost guardrail |

Use the **role switcher** at the top of `/admin` (Admin · Shopper · Brand) to jump between the three surfaces.

FitCart makes shoppers **confident** ("does it fit me / does the look work?") and routes the sale to the store, earning an **affiliate commission** — the intermediary business model.

---

## Recommended stakeholder demo flow

```
Landing (/)  →  the concept + the buyer→FitCart→stores diagram
  → Explore (/explore)          discover & filter products across 6 stores (guest, no login)
    → Product detail            pick a size → "Try on my avatar"
      → Try-On Studio (/studio)  ★ the centrepiece:
          • pick a body/avatar (or "Upload photo" → see the guest guardrail)
          • add Top / Bottom / Jacket / Shoes / Watch / Sunglasses / Accessory across stores
          • rotate the avatar (multi-angle) + zoom
          • read the Fit Report (per-region + confidence) and Outfit Score
        → Add outfit to FitCart
          → Cart (/cart)         grouped by store + est. affiliate commission
            → Checkout (/checkout) honest "open in store" / partner "cart-sync" handoff
              → Confirmation (/confirmation)  order summary + affiliate earned + fit feedback
  → For Brands (/partner)        the seller-side B2B fit-intelligence console
  → Admin (/admin)               operator console — manage accounts, stores, partners, moderation, revenue/cost
```

### Pricing & tiers (`/pricing`)
Four usage-based plans, with the premium features gated in the Try-On Studio:

| Tier | Price (demo) | Headline unlock |
|---|---|---|
| **Guest** | Free | Preset avatars, 5 try-ons/day, basic scores, watermarked previews |
| **Style** | ₹199/mo | Unlimited try-ons, full Fit Report + confidence, no watermark |
| **Pro** | ₹599/mo | **AI Fit Images** — fine HD images of the outfit *on you* with a Fit Check overlay |
| **Studio 3D** | ₹1,499/mo | **Personalized 3D avatar of yourself** + real 360° free-camera 3D (flagship) |

- Choosing a plan sets your tier (no charge) and the **Studio reacts live**: the "Make my 3D avatar" and "AI Fit Image" buttons unlock or show an upgrade path; the header shows your current plan.
- Only **Studio 3D** can generate a personalized 3D avatar (the most compute-heavy feature — the deliberate "don't break revenue" gate). **Pro** gets AI Fit Images; lower tiers use preset avatars.

### Admin console (`/admin`) — now behind a staff login
Sign-in gate (session-only demo): **`admin@fitcart.ai` / `demo1234`** (there's a "Fill demo credentials" button). Log out from the role switcher.

The internal operator panel — how FitCart staff manage everyone who comes into the site:
- **Overview** — platform KPIs, revenue-vs-inference-cost chart, and the guest "don't break revenue" guardrail
- **Accounts** — searchable/filterable table of every shopper; **Suspend / Activate** and **Delete (DPDP erase)** actually mutate the demo state
- **Stores** — connected-store health + capability, toggle each on/off
- **Partners** — approve/reject B2B Fit-SDK requests
- **Moderation** — abuse/cost-bomb and reported-render queue with resolve/dismiss
- **Revenue & Cost** — affiliate earnings by store + unit-economics guardrail

*(Demo note: in production this sits behind staff SSO + role-based access + audit logging; operators see account metadata, never body photos.)*

---

## What's real vs mocked

**Real (works in the browser):**
- Navigation, routing, search, filters, sorting
- Product browsing & detail, wishlist, size selection
- Avatar rendering that visibly "wears" your selected outfit and rotates through angles
- **Fit engine** (per-region fit + confidence) and **Outfit engine** (colour/occasion/body-shape/style) computed live from the avatar + garment data
- Cart (grouped by store, quantity, remove), checkout handoff, order confirmation
- Brand dashboard (KPIs, product table, fit insights, incoming handoffs)
- State persists across reloads via `localStorage`

**Mocked / simulated (by design):**
- **AI try-on & 3D**: the avatar is a stylised parametric SVG, not a generative/3D render. The blueprint's honest "multi-angle preview, not free-camera 3D" is reflected in the UI copy.
- **Fit/outfit scores**: deterministic demo logic, not production ML.
- **Catalog, prices, ratings, brands**: realistic seeded data, not live store feeds.
- **Auth & payments**: none — "guest" and a demo "sign up" toggle only; you always pay "on the store."
- **Cart-sync**: shown as a *partner-only* capability (AJIO in this demo); default stores are deep-link handoff — matching the real platform-API constraints.

---

## Key product truths this demo deliberately keeps honest
- **Not a marketplace** — an intelligence layer; checkout stays with the stores.
- **No official cart API** on most platforms → default is deep-link + affiliate; true cart-sync is partner-only (never faked).
- **Guest free-trial** captures users with no login, but the *expensive* personalized-avatar step is gated behind sign-up (the "don't break revenue" guardrail) — see the Studio "Upload photo" modal.
- **Every fit estimate shows a confidence score** — never a guaranteed measurement.

---

## Tech stack
- **React 18 + TypeScript + Vite**
- **react-router-dom** for client-side routing
- **React Context + localStorage** for state (cart, outfit, avatar, wishlist, order)
- **Hand-authored CSS design system** (`src/styles/theme.css`, `app.css`) — no UI framework
- **Inline SVG** for all icons, product imagery, and the avatar (no external assets → no broken images, loads instantly, works offline)

## Project structure
```
src/
  components/   Layout, Avatar, ProductCard, ProductImage, Modal, Scores, Icon
  pages/        Landing, Explore, ProductDetail, Studio, Cart, Checkout, Confirmation, Partner, HowItWorks, NotFound
  data/         stores, products (seeded), avatars, partner
  lib/          scoring (fit + outfit engines), format
  store/        AppContext (global state)
  styles/       theme.css, app.css
```

## Assumptions
- The generic "marketplace" brief was adapted to FitCart's actual model (intelligence layer, not a seller/marketplace) because the FitCart blueprint MD is the source of truth.
- "Seller experience" is interpreted as the **Brand/Partner (B2B) dashboard**, since FitCart's counterparties are stores/brands, not individual sellers.
- Store capabilities (which store allows cart-sync) follow the blueprint's platform-API research; AJIO is used as the illustrative "partner" store.

## Future production considerations
Replace `src/lib/scoring.ts` with real fit/try-on services, `src/data/*` with live store/affiliate feeds behind the `StoreIntegration` adapter, and the Context store with authenticated APIs. The component/service split is structured so these swaps don't touch the UI.
