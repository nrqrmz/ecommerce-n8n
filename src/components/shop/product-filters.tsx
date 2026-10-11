import { ChevronDown, Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { categoryLabel } from '@/lib/products'
import { cn } from '@/lib/utils'

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-10 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-transparent bg-gradient-to-r from-glow-1 to-glow-2 text-white shadow-[0_0_20px_var(--glow-1)]'
          : 'glass hover:bg-white/10',
      )}
    >
      {children}
    </button>
  )
}

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
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Search products"
            aria-label="Search products"
            className="glass h-12 rounded-full pr-11 pl-10 text-base md:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button
              type="button"
              onClick={() => onChange({ q: '' })}
              aria-label="Clear search"
              className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="relative w-36 shrink-0 sm:w-48">
          <select
            className="glass h-12 w-full appearance-none rounded-full pr-11 pl-4 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>option]:bg-popover"
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
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
      >
        <Chip active={!category} onClick={() => onChange({ category: '' })}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c} active={category === c} onClick={() => onChange({ category: c })}>
            {categoryLabel(c)}
          </Chip>
        ))}
      </div>
    </div>
  )
}
