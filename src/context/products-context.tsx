import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { parseProducts, type Product } from '@/lib/products'

interface ProductsState {
  products: Product[]
  categories: string[]
  loading: boolean
  error: string | null
  retry: () => void
}

const ProductsContext = createContext<ProductsState | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const url = import.meta.env.VITE_N8N_PRODUCTS_URL
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    if (!url) {
      setError('Missing VITE_N8N_PRODUCTS_URL in .env')
      setLoading(false)
      return
    }
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .then((json) => {
        const list = parseProducts(json)
        if (list.length === 0) throw new Error('The product list is empty')
        setProducts(list)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return
        setError(e instanceof Error ? e.message : 'Could not load products')
        setLoading(false)
      })
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
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
