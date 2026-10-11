import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import { InteractiveCard } from '@/components/fx/interactive-card'
import { Reveal } from '@/components/fx/reveal'
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
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-3 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-5">
      {categories.map((c, i) => {
        const Icon = categoryIcon(c)
        return (
          <Reveal key={c} index={i} className="w-36 shrink-0 snap-start md:w-auto">
            <InteractiveCard className="h-full">
              <Link
                to={`/products?category=${encodeURIComponent(c)}`}
                className="flex h-full flex-col gap-6 p-4"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-glow-1/40 to-glow-2/30 text-white ring-1 ring-white/15 transition-shadow group-hover/card:shadow-[0_0_24px_var(--glow-1)]">
                    <Icon className="size-6" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground" />
                </div>
                <div>
                  <p className="font-display leading-tight font-semibold">{categoryLabel(c)}</p>
                  <p className="text-xs text-muted-foreground">{counts.get(c) ?? 0} items</p>
                </div>
              </Link>
            </InteractiveCard>
          </Reveal>
        )
      })}
    </div>
  )
}
