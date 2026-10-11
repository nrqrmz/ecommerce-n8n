import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { parseProducts, type Product } from '@/lib/products'
import { CACHE_TTL_MS, readProductsCache, writeProductsCache } from '@/lib/products-cache'

interface ProductsState {
  products: Product[]
  categories: string[]
  loading: boolean
  error: string | null
  retry: () => void
}

const ProductsContext = createContext<ProductsState | null>(null)

const TIMEOUT_MS = 15_000
const RETRIES = 2

async function fetchProducts(url: string, signal: AbortSignal): Promise<Product[]> {
  let lastError: unknown
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 800 * attempt))
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
    const timeout = new AbortController()
    const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS)
    const onAbort = () => timeout.abort()
    signal.addEventListener('abort', onAbort)
    try {
      const res = await fetch(url, { signal: timeout.signal })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const text = await res.text()
      if (!text.trim()) throw new Error('The server returned an empty response')
      const list = parseProducts(JSON.parse(text))
      if (list.length === 0) throw new Error('The product list is empty')
      return list
    } catch (e) {
      if (signal.aborted) throw e
      lastError = e instanceof DOMException && e.name === 'AbortError' ? new Error('The request timed out') : e
    } finally {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
    }
  }
  throw lastError
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  // Start from the browser copy so returning visitors see products immediately.
  const [cached] = useState(readProductsCache)
  const [products, setProducts] = useState<Product[]>(cached?.products ?? [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const url = import.meta.env.VITE_N8N_PRODUCTS_URL
    const fresh = cached && Date.now() - cached.savedAt < CACHE_TTL_MS && attempt === 0
    if (fresh) return
    if (!url) {
      setError('Missing VITE_N8N_PRODUCTS_URL in .env')
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setError(null)
    fetchProducts(url, controller.signal)
      .then((list) => {
        writeProductsCache(list)
        setProducts(list)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return
        // Keep showing cached products if a background refresh fails.
        if (!cached) setError(e instanceof Error ? e.message : 'Could not load products')
        setLoading(false)
      })
    return () => controller.abort()
  }, [attempt, cached])

  const retry = useCallback(() => {
    setLoading(true)
    setAttempt((a) => a + 1)
  }, [])
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products],
  )

  const value = useMemo(
    () => ({ products, categories, loading, error, retry }),
    [products, categories, loading, error, retry],
  )
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider')
  return ctx
}
