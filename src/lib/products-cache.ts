import type { Product } from '@/lib/products'

const KEY = 'products:v1'
/** Products rarely change, so the browser copy is considered fresh for 24 hours. */
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface Cached {
  savedAt: number
  products: Product[]
}

export function readProductsCache(): Cached | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Cached
    if (typeof data.savedAt !== 'number' || !Array.isArray(data.products) || data.products.length === 0) {
      return null
    }
    return data
  } catch {
    return null
  }
}

export function writeProductsCache(products: Product[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), products } satisfies Cached))
  } catch {
    // Storage may be full or blocked (private mode). The app still works without it.
  }
}
