export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  brand: string
  sku: string
  dimensions: { width: number; height: number; depth: number } | null
  image: string
  thumbnail: string
}

type Raw = Record<string, unknown>

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

/** Maps one raw JSON row from N8N to a Product. Returns null if essential fields are missing. */
export function normalizeProduct(raw: Raw): Product | null {
  const id = num(raw.id)
  const price = num(raw.price)
  const title = str(raw.title)
  if (id === null || price === null || !title) return null

  const width = num(raw.width)
  const height = num(raw.height)
  const depth = num(raw.depth)
  const image = str(raw.image_url) || str(raw.thumbnail)

  return {
    id,
    title,
    description: str(raw.description),
    category: str(raw.category),
    price,
    brand: str(raw.brand),
    sku: str(raw.sku),
    dimensions:
      width !== null && height !== null && depth !== null ? { width, height, depth } : null,
    image,
    thumbnail: str(raw.thumbnail) || image,
  }
}

/** Accepts a bare array or a wrapper such as { data: [...] } / { products: [...] }. */
export function parseProducts(payload: unknown): Product[] {
  let rows: unknown = payload
  if (rows && !Array.isArray(rows) && typeof rows === 'object') {
    const obj = rows as Raw
    rows = obj.data ?? obj.products ?? obj.items ?? []
  }
  if (!Array.isArray(rows)) return []
  const seen = new Set<number>()
  const out: Product[] = []
  for (const row of rows) {
    const p = row && typeof row === 'object' ? normalizeProduct(row as Raw) : null
    if (p && !seen.has(p.id)) {
      seen.add(p.id)
      out.push(p)
    }
  }
  return out
}

/** "home-decoration" -> "Home Decoration" */
export function categoryLabel(slug: string) {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}
