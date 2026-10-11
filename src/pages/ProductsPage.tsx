import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ErrorState } from '@/components/shop/error-state'
import { Pagination } from '@/components/shop/pagination'
import { ProductGrid, ProductGridSkeleton } from '@/components/shop/product-card'
import { ProductFilters, type SortKey } from '@/components/shop/product-filters'
import { useProducts } from '@/context/products-context'

const PAGE_SIZE = 12
const SORTS: SortKey[] = ['default', 'price-asc', 'price-desc', 'name-asc', 'name-desc']

export default function ProductsPage() {
  const { products, categories, loading, error, retry } = useProducts()
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const sortParam = params.get('sort') as SortKey | null
  const sort: SortKey = sortParam && SORTS.includes(sortParam) ? sortParam : 'default'
  const requestedPage = Math.max(1, Number(params.get('page')) || 1)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!term || `${p.title} ${p.brand} ${p.category}`.toLowerCase().includes(term)),
    )
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'name-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title))
      case 'name-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return list
    }
  }, [products, q, category, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(requestedPage, pageCount)
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function update(patch: Record<string, string | undefined>, resetPage = true) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [k, v] of Object.entries(patch)) {
          if (v && v !== 'default') next.set(k, v)
          else next.delete(k)
        }
        if (resetPage) next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  function goToPage(p: number) {
    update({ page: p > 1 ? String(p) : undefined }, false)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <ProductFilters
        q={q}
        category={category}
        sort={sort}
        categories={categories}
        onChange={update}
      />
      <div className="mt-6">
        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : loading ? (
          <ProductGridSkeleton count={PAGE_SIZE} />
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No products match your search.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">{filtered.length} products</p>
            <ProductGrid products={visible} />
            <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
          </>
        )}
      </div>
    </div>
  )
}
