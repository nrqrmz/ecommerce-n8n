import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CategoryTiles } from '@/components/shop/category-tiles'
import { ErrorState } from '@/components/shop/error-state'
import { ProductCard, ProductGridSkeleton } from '@/components/shop/product-card'
import { useProducts } from '@/context/products-context'
import { STORE_NAME, TAGLINE } from '@/lib/brand'
import type { Product } from '@/lib/products'

function sample(list: Product[], n: number) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

function SectionHeader({ title, to, linkLabel }: { title: string; to: string; linkLabel: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
      <Link to={to} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        {linkLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}

export default function HomePage() {
  const { products, categories, loading, error, retry } = useProducts()
  // Reshuffled each time the products load or the page is visited.
  const suggested = useMemo(() => sample(products, 8), [products])

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 text-white dark:from-indigo-950 dark:via-indigo-900 dark:to-violet-950">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-14 md:py-24">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            {STORE_NAME}
          </span>
          <h1 className="max-w-xl text-4xl font-extrabold tracking-tight md:text-6xl">{TAGLINE}</h1>
          <p className="max-w-md text-white/85 md:text-lg">
            {products.length > 0 ? `${products.length} products` : 'Products'} across{' '}
            {categories.length > 0 ? `${categories.length} categories` : 'many categories'}, from beauty to tech.
            Checkout in seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 bg-white px-7 text-indigo-700 hover:bg-white/90">
              <Link to="/products">Shop now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/40 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#categories">Browse categories</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 md:py-14">
        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (
          <>
            <section id="categories" className="scroll-mt-20">
              <SectionHeader title="Shop by category" to="/products" linkLabel="All products" />
              {loading ? (
                <div className="flex gap-3 overflow-hidden">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="h-32 w-32 shrink-0 animate-pulse rounded-2xl bg-muted md:flex-1" />
                  ))}
                </div>
              ) : (
                <CategoryTiles />
              )}
            </section>

            <section>
              <SectionHeader title="Suggested for you" to="/products" linkLabel="View all" />
              {loading ? (
                <ProductGridSkeleton count={4} />
              ) : (
                <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
                  {suggested.map((p, i) => (
                    <div
                      key={p.id}
                      className={`w-44 shrink-0 snap-start sm:w-52 lg:w-auto ${i >= 4 ? 'lg:hidden' : ''}`}
                    >
                      <ProductCard product={p} />
                    </div>
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
