// Manual end-to-end check on an emulated Android phone. See scripts/README.md.
// Usage: node scripts/flow.cjs <mock mode: clean|messy|wrapped> [promise|oldcart|blocked]
const { chromium, devices } = require('playwright')
const U = process.env.SHOP_URL || 'http://localhost:4173/ecommerce-n8n/'
const variant = process.argv[2] || 'clean', pre = process.argv[3] || 'none'
const SHOTS = process.env.SHOTS
;(async () => {
  await fetch('http://localhost:8787/mode?m=' + variant)
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
  const ctx = await b.newContext({ ...devices['Pixel 7'] })
  if (pre === 'promise') await ctx.addInitScript(() => { const o = window.scrollTo.bind(window); window.scrollTo = (...a) => { o(...a); return Promise.resolve() } })
  if (pre === 'oldcart') await ctx.addInitScript(() => { localStorage.setItem('cart:v1', JSON.stringify([{ product: { id: 1, title: 'x', price: 'abc' }, quantity: 2 }, { id: 3 }])) })
  if (pre === 'blocked') await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked') } }) })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push('pageerror: ' + e.message))
  p.on('console', m => m.type() === 'error' && !/Failed to load resource|fonts\.g/.test(m.text()) && errs.push('console: ' + m.text().slice(0, 200)))
  let ok = true
  const shot = async n => { if (SHOTS) await p.screenshot({ path: `${SHOTS}/${n}.png` }) }
  const step = async (name, fn) => {
    if (!ok) return
    try {
      await fn(); await p.waitForTimeout(400)
      if (/Something went wrong/.test(await p.locator('body').innerText())) throw new Error('error screen shown')
      console.log('  ok  ', name)
    } catch (e) { console.log(`  FAIL "${name}": ${e.message.split('\n')[0]}`); ok = false }
  }
  await step('home + categories', async () => { await p.goto(U); await p.waitForSelector('text=Shop by category'); await p.waitForSelector('[aria-label^="Add Product"]', { timeout: 8000 }); await shot('home') })
  await step('category tile -> filtered catalog', async () => { await p.locator('a[href*="/products?category="]').first().tap(); await p.waitForURL(/category=/); await p.waitForSelector('[aria-pressed="true"]:not(:has-text("All"))'); await shot('catalog') })
  await step('favorite from card', async () => { await p.locator('[aria-label^="Add"][aria-label$="to favorites"]').first().tap(); await p.getByLabel('Favorites, 1 items').waitFor() })
  await step('tap product', async () => { await p.locator('a[href*="/products/"]').first().tap(); await p.waitForSelector('text=Quantity', { timeout: 5000 }); await shot('detail') })
  await step('lightbox opens and zooms', async () => { await p.getByLabel('Open image in full screen').tap(); await p.getByTestId('lightbox').waitFor(); await p.getByLabel('Zoom in').tap(); await p.getByLabel('Zoom out').waitFor(); await shot('lightbox'); await p.keyboard.press('Escape'); await p.getByTestId('lightbox').waitFor({ state: 'detached' }) })
  await step('add to cart -> toast', async () => { await p.getByLabel('Increase quantity').first().tap(); await p.getByRole('button', { name: /Add to cart/ }).last().tap(); await p.getByText('Added to cart').waitFor(); await shot('toast') })
  await step('toast "View cart" opens drawer', async () => { await p.getByRole('button', { name: 'View cart' }).tap(); await p.getByText(/Your cart \(2\)/).waitFor(); await shot('drawer') })
  await step('quantity in drawer', async () => { await p.getByRole('dialog').getByLabel('Increase quantity').tap(); await p.getByText(/Your cart \(3\)/).waitFor() })
  await step('pay from drawer', async () => { await p.getByRole('dialog').getByRole('button', { name: /^Pay/ }).tap(); await p.waitForURL('**/order-confirmed', { timeout: 6000 }); await p.waitForSelector('span.font-mono'); await shot('confirmed') })
  await step('reload confirmation', async () => { await p.reload(); await p.waitForSelector('span.font-mono', { timeout: 4000 }) })
  await step('favorites page survives reload', async () => { await p.goto(U + 'favorites'); await p.reload(); await p.waitForSelector('[aria-label^="Add Product"]', { timeout: 6000 }) })
  await step('dark mode toggle survives reload', async () => { await p.getByLabel('Switch to dark mode').tap(); await p.reload(); if (!(await p.evaluate(() => document.documentElement.classList.contains('dark')))) throw new Error('not dark'); await p.waitForSelector('[aria-label^="Add Product"]'); await shot('favorites-dark') })
  await step('search + clear', async () => { await p.goto(U + 'products'); await p.fill('[aria-label="Search products"]', 'zzzz'); await p.getByText('No products found').waitFor(); await p.getByRole('button', { name: 'Clear filters' }).tap(); await p.waitForSelector('[aria-label^="Add Product"]') })
  await step('no horizontal scroll', async () => { if (!(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth))) throw new Error('overflow') })
  console.log(`${ok && !errs.length ? 'OK  ' : 'FAIL'} ${variant}/${pre}` + (errs.length ? '  errors: ' + errs.join(' | ') : ''))
  await b.close()
})()
