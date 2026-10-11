import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { categoryLabel } from '@/lib/products'

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

const selectClass =
  'h-11 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

export function ProductFilters({
  q,
  category,
  sort,
  categories,
  onChange,
}: {
  q: string
  category: string
  sort: SortKey
  categories: string[]
  onChange: (patch: { q?: string; category?: string; sort?: SortKey }) => void
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_14rem_14rem]">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Search by name, brand or category"
          aria-label="Search products"
          className="h-11 pl-9"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:contents">
        <select
          className={selectClass}
          value={category}
          onChange={(e) => onChange({ category: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={sort}
          onChange={(e) => onChange({ sort: e.target.value as SortKey })}
          aria-label="Sort products"
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  )
}
