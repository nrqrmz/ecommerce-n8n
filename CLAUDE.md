# CLAUDE.md

## What this project is
A prototype template: Vite + React + TypeScript + Tailwind CSS + shadcn/ui +
React Router (`BrowserRouter`). It is an e-commerce prototype; Supabase is NOT used. The user is not technical:
explain things in simple language and handle the code and Git yourself.
All code, comments, commit messages and UI text must be in English.

## Data (N8N)
- Products come from an N8N webhook JSON, URL in `.env` as `VITE_N8N_PRODUCTS_URL` (public, committed on purpose).
  Never put secrets in `.env`.
- Raw JSON fields: `id, title, description, category, price, brand, sku, width, height, depth, image_url,
  thumbnail` (+ `row_number`, ignored). Mapping lives only in `src/lib/products.ts` (`normalizeProduct`).
- Products are fetched once by `ProductsProvider` (`src/context/products-context.tsx`).
- The cart (`src/context/cart-context.tsx`) is saved in localStorage; checkout is simulated.
- Products are cached in localStorage for 24 h (`src/lib/products-cache.ts`) and refreshed from N8N in the background.
- The N8N Webhook node must allow CORS for the browser to read it.

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
- If you work on another branch, merge it into `master` (or open a pull request)
  when the user wants to see the preview.

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
`/` home, `/products` catalog (filters in URL query), `/products/:id` detail, `/cart`, `/order-confirmed`.
Design is mobile-first: base Tailwind classes are the phone layout, `md:`/`lg:` enlarge it.
