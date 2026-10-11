# Manual end-to-end checks (not part of the build)

Reproduces the GitHub Pages setup locally and drives the shop on an emulated Android phone.
Requires Playwright (global install) and Chromium.

```
node scripts/mock-n8n.mjs &                                  # fake N8N on :8787 (modes: clean, messy, wrapped)
echo "VITE_N8N_PRODUCTS_URL=http://localhost:8787/" > .env.local
VITE_BASE=/ecommerce-n8n/ npm run build && cp dist/index.html dist/404.html
rm .env.local
node scripts/pages-server.mjs dist &                         # serves dist at :4173 like GitHub Pages
NODE_PATH=$(npm root -g) node scripts/flow.cjs messy         # home -> product -> cart -> pay -> confirmation
```
