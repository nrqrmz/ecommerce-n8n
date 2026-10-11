const { chromium, devices } = require('playwright')
const U = 'http://localhost:4173/ecommerce-n8n/'
const variant = process.argv[2], pre = process.argv[3] || 'none'
;(async () => {
  await fetch('http://localhost:8787/mode?m=' + variant)
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
  const ctx = await b.newContext({ ...devices['Pixel 7'] })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push('pageerror: ' + e.message))
  p.on('console', m => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errs.push('console: ' + m.text().slice(0, 200)))
  const bad = async step => { const t = await p.locator('body').innerText(); if (/Something went wrong/.test(t)) { console.log(`  BOUNDARY at "${step}":`, t.split('Technical details')[1]?.slice(0, 250).replace(/\n/g, ' ')); return true } return false }
  if (pre === 'promise') await ctx.addInitScript(() => { const o = window.scrollTo.bind(window); window.scrollTo = (...a) => { o(...a); return Promise.resolve() } })
  if (pre === 'oldcart') await ctx.addInitScript(() => { localStorage.setItem('cart:v1', JSON.stringify([{ product: { id: 1, title: 'x', price: 'abc' }, quantity: 2 }, { id: 3 }])) })
  if (pre === 'blocked') await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked') } }) })
  let ok = true
  const step = async (name, fn) => { if (!ok) return; try { await fn(); await p.waitForTimeout(500); if (await bad(name)) ok = false } catch (e) { console.log(`  STEP FAIL "${name}": ${e.message.split('\n')[0]}`); ok = false } }
  await step('home', async () => { await p.goto(U); await p.waitForSelector('[aria-label^="Add Product"]', { timeout: 8000 }) })
  await step('tap product', async () => { await p.locator('a[href*="/products/"]').first().tap(); await p.waitForSelector('h1', { timeout: 5000 }); await p.waitForSelector('text=Quantity', { timeout: 5000 }) })
  await step('add to cart', async () => { await p.getByRole('button', { name: /Add to cart/ }).last().tap() })
  await step('open cart', async () => { await p.getByLabel(/^Cart/).tap(); await p.waitForSelector('text=/Cart \\(\\d+\\)/', { timeout: 5000 }) })
  await step('pay', async () => { await p.getByRole('button', { name: /^Pay/ }).tap(); await p.waitForURL('**/order-confirmed', { timeout: 6000 }) })
  await step('confirmation', async () => { await p.waitForSelector('span.font-mono', { timeout: 3000 }) })
  await step('reload confirm', async () => { await p.reload(); await p.waitForSelector('span.font-mono', { timeout: 4000 }) })
  await step('catalog', async () => { await p.goto(U + 'products?page=3'); await p.waitForSelector('[aria-label^="Add Product"]', { timeout: 6000 }) })
  await step('direct detail', async () => { await p.goto(U + 'products/7'); await p.waitForSelector('text=Quantity', { timeout: 6000 }) })
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${variant}/${pre}` + (errs.length ? '  errors: ' + errs.join(' | ') : ''))
  await b.close()
})()
