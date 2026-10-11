import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { Reveal } from '@/components/fx/reveal'
import { CategoryTiles } from '@/components/shop/category-tiles'
import { ErrorState } from '@/components/shop/error-state'
import { Hero } from '@/components/shop/hero'
import { ProductCard, ProductGridSkeleton } from '@/components/shop/product-card'
import { useProducts } from '@/context/products-context'
import { categoryLabel, type Product } from '@/lib/products'

function sample(list: Product[], n: number) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

function SectionHeader({ eyebrow, title, to, linkLabel }: { eyebrow: string; title: string; to: string; linkLabel: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-bold tracking-[0.2em] text-glow-3 uppercase">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
      </div>
      <Link to={to} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent-foreground hover:underline">
        {linkLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}

function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null
  const row = [...items, ...items]
  return (
    <div className="relative mt-14 overflow-hidden border-y border-white/10 py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee flex w-max gap-10 hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <Link
            key={c + i}
            to={`/products?category=${encodeURIComponent(c)}`}
            className="flex items-center gap-10 font-display text-xl font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground md:text-2xl"
          >
            {categoryLabel(c)}
            <span className="text-glow-2">✦</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { products, categories, loading, error, retry } = useProducts()
  // Reshuffled each time the products load or the page is visited.
  const suggested = useMemo(() => sample(products, 7), [products])

  return (
    <div>
      <Hero />
      <Marquee items={categories} />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14 md:py-20">
        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (
          <>
            <section id="categories" className="scroll-mt-24">
              <SectionHeader eyebrow="Browse" title="Shop by category" to="/products" linkLabel="All products" />
              {loading ? (
                <div className="flex gap-3 overflow-hidden">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="glass h-36 w-36 shrink-0 animate-pulse rounded-3xl md:flex-1" />
                  ))}
                </div>
              ) : (
                <CategoryTiles />
              )}
            </section>

            <section>
              <SectionHeader eyebrow="Picked for you" title="Suggested for you" to="/products" linkLabel="View all" />
              {loading ? (
                <ProductGridSkeleton count={4} />
              ) : (
                <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-5 lg:overflow-visible lg:px-0">
                  {suggested.map((p, i) => (
                    <Reveal
                      key={p.id}
                      index={i}
                      className={
                        i === 0
                          ? 'w-56 shrink-0 snap-start sm:w-64 lg:col-span-2 lg:row-span-2 lg:w-auto'
                          : 'w-44 shrink-0 snap-start sm:w-52 lg:w-auto'
                      }
                    >
                      <ProductCard product={p} featured={i === 0} />
                    </Reveal>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
