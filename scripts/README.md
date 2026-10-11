# Manual end-to-end checks (not part of the build)

Reproduces the GitHub Pages setup locally and drives the shop on an emulated Android phone with Playwright.
Requires Playwright (global install) and Chromium.

```bash
node scripts/mock-n8n.mjs &                                  # fake N8N on :8787
echo "VITE_N8N_PRODUCTS_URL=http://localhost:8787/" > .env.local
VITE_BASE=/ecommerce-n8n/ npm run build && cp dist/index.html dist/404.html
rm .env.local
node scripts/pages-server.mjs dist &                         # serves dist at :4173 like GitHub Pages
NODE_PATH=$(npm root -g) node scripts/flow.cjs clean none    # full shopping flow
```

`flow.cjs <data> <state>`:

- `<data>`: `clean`, `messy` (blank cells, text numbers, nulls, broken images) or `wrapped` (`{ "data": [...] }`).
- `<state>`: `none`, `promise` (`scrollTo` returns a Promise, the Android regression), `oldcart` (corrupt saved
  cart) or `blocked` (browser storage unavailable).
- Environment: `REDUCE=1` enables reduced motion, `SHOTS=<dir>` saves screenshots.
