# CLAUDE.md

## What this project is
A prototype template: Vite + React + TypeScript + Tailwind CSS + shadcn/ui +
React Router (`BrowserRouter`). It is an e-commerce prototype; Supabase is NOT used. The user is not technical:
explain things in simple language and handle the code and Git yourself.
All code, comments, commit messages and UI text must be in English.
Keep `README.md` (portfolio page: stack, data flow, env vars, routes) up to date when any of those change.
`README.md` is the default (English); `README.es.md` is its Spanish translation and must mirror it. Each README starts
with a language switcher line; when adding a language, add it to every README's switcher. README files are the only
place where non-English text is allowed.

## Data (N8N)
- Products come from an N8N webhook JSON, URL in `.env` as `VITE_N8N_PRODUCTS_URL` (public, committed on purpose).
  Never put secrets in `.env`.
- Raw JSON fields: `id, title, description, category, price, brand, sku, width, height, depth, image_url,
  thumbnail` (+ `row_number`, ignored). Mapping lives only in `src/lib/products.ts` (`normalizeProduct`).
- Products are fetched once by `ProductsProvider` (`src/context/products-context.tsx`).
- The cart (`src/context/cart-context.tsx`) is saved in localStorage; checkout is simulated.
- Products are cached in localStorage for 24 h (`src/lib/products-cache.ts`) and refreshed from N8N in the background.
- The N8N Webhook node must allow CORS for the browser to read it.
- Show only real data from the JSON: no invented ratings, stock, discounts or shipping promises.

## UI
- Store name and tagline live in `src/lib/brand.ts` (Cartwell, "Shop well. Live well.").
- Design: **immersive dark, dark-only** (`<html class="dark">`). Tokens and utilities (`glass`,
  `text-gradient`, `spotlight`, `animate-marquee`, `animate-shimmer`, `glow-1/2/3` colors) are in
  `src/index.css`. Fonts: Sora (`font-display`, headings) + Inter (body).
- Effects live in `src/components/fx/`: `AuroraBackground` (drifting glows), `InteractiveCard` (pointer glow +
  3D tilt on desktop only), `Reveal` (fade-up on scroll).
- `ProductImage` shows photos on a lit "studio" tile with `mix-blend-multiply` (the source images have white
  backgrounds). Keep it for every product photo.
- Animations use Motion (`motion/react`). `MotionConfig reducedMotion="user"` is set at the root; new
  effects must also degrade gracefully with reduced motion.
- Add to cart with `useAddToCart()(product, qty, imageElement)`: the image flies into the header cart icon
  (`src/context/fly-to-cart-context.tsx`) and a toast offers "View cart" (opens the drawer).
- Cart drawer: `src/components/shop/cart-drawer.tsx` (bottom sheet on phones, right panel on desktop),
  opened via `setDrawerOpen` from the cart context.
- Checkout stores the full order (`lastOrder`: id, lines, total, date) in sessionStorage; the confirmation page
  shows confetti (`canvas-confetti`), an animated check and a printed receipt.
- Favorites: `src/context/favorites-context.tsx` (localStorage).
- Toasts use `sonner` (`src/components/ui/sonner.tsx`, dark glass styling).
- `useEffect` callbacks must use a block body and never return a value other than a cleanup function
  (newer browsers return a Promise from `scrollTo`, and React treats a returned value as a cleanup function).
- The shadcn registry may be unreachable; write shadcn-style components by hand on top of `radix-ui`.
- Manual end-to-end check: `scripts/README.md` and `scripts/flow.cjs` (`REDUCE=1` tests reduced motion).

## Routing and deployment
- Use `BrowserRouter`. Do not replace it with `HashRouter`.
- Do not edit `base` in `vite.config.ts` or the `basename` in `src/main.tsx`.
  They configure themselves (the GitHub Pages workflow sets `VITE_BASE`; on Vercel,
  Netlify or locally the default is `/`).
- `.github/workflows/deploy.yml` builds the app, copies `index.html` to `404.html`
  (so direct links and reloads work on GitHub Pages) and publishes it.
  Do not modify it unless the user asks.
- `vercel.json` and `public/_redirects` already allow deploying to Vercel or
  Netlify with no changes. Leave them as they are.
- If the user asks to make the app production-ready or to deploy it elsewhere,
  these files are already prepared; no router change is needed.

## Git workflow
- The main branch is `master`. The preview updates only when changes reach `master`.
- Work and commit directly on `master` (the user reviews and approves there). Do not create
  feature branches or pull requests unless the user asks.

## Structure and conventions
- Routes are defined in `src/App.tsx`. Pages live in `src/pages/`.
- `src/components/ui/`: shadcn/ui components. Add new ones following the same
  style (or with `npx shadcn@latest add <name>`); `components.json` is configured.
- `src/components/chat/`: `ChatMessage` and `ChatInput`, ready for chat-style apps.
- `src/lib/`: utilities and product mapping. `src/context/`: products and cart state.
- `src/components/shop/`: store components (header, product card, filters, pagination).
- Style with Tailwind classes only. No separate CSS unless strictly necessary.
- Import with the `@/` alias (maps to `src/`).

## Routes
`/` home, `/products` catalog (filters in URL query), `/products/:id` detail, `/favorites`, `/cart`,
`/order-confirmed`.
Design is mobile-first: base Tailwind classes are the phone layout, `md:`/`lg:` enlarge it.
