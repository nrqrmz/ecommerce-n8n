import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shop/empty-state'
import { ErrorState } from '@/components/shop/error-state'
import { Pagination } from '@/components/shop/pagination'
import { ProductGrid, ProductGridSkeleton } from '@/components/shop/product-card'
import { ProductFilters, type SortKey } from '@/components/shop/product-filters'
import { useProducts } from '@/context/products-context'
import { categoryLabel } from '@/lib/products'

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
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight md:text-3xl">
        {category ? categoryLabel(category) : 'All products'}
      </h1>
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
          <EmptyState icon={SearchX} title="No products found" description="Try another search or category.">
            <Button variant="outline" className="h-11" onClick={() => update({ q: undefined, category: undefined })}>
              Clear filters
            </Button>
          </EmptyState>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              {category && ` in ${categoryLabel(category)}`}
            </p>
            <ProductGrid products={visible} />
            <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
          </>
        )}
      </div>
    </div>
  )
}
