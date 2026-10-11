import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useProducts } from '@/context/products-context'
import { categoryIcon } from '@/lib/category-icons'
import { categoryLabel } from '@/lib/products'

export function CategoryTiles() {
  const { products, categories } = useProducts()
  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of products) m.set(p.category, (m.get(p.category) ?? 0) + 1)
    return m
  }, [products])

  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-5">
      {categories.map((c) => {
        const Icon = categoryIcon(c)
        return (
          <Link
            key={c}
            to={`/products?category=${encodeURIComponent(c)}`}
            className="group flex w-32 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center transition hover:border-primary/40 hover:shadow-md md:w-auto"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-6" />
            </span>
            <span className="text-sm font-semibold leading-tight">{categoryLabel(c)}</span>
            <span className="text-xs text-muted-foreground">{counts.get(c) ?? 0} items</span>
          </Link>
        )
      })}
    </div>
  )
}
