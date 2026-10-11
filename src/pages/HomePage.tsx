import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/shop/error-state'
import { ProductCard, ProductGridSkeleton } from '@/components/shop/product-card'
import { useProducts } from '@/context/products-context'
import type { Product } from '@/lib/products'

function sample(list: Product[], n: number) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export default function HomePage() {
  const { products, loading, error, retry } = useProducts()
  // Reshuffled each time the products load or the page is visited.
  const suggested = useMemo(() => sample(products, 8), [products])

  return (
    <div>
      <section className="bg-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 md:py-20">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Everything you need,
            <br />
            in one place.
          </h1>
          <p className="max-w-md text-muted-foreground md:text-lg">
            Browse over a hundred products, from beauty to electronics, and check out in seconds.
          </p>
          <Button asChild size="lg" className="h-12 px-8">
            <Link to="/products">Shop now</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Suggested for you</h2>
          <Link to="/products" className="text-sm font-medium underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        {error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
            {suggested.slice(0, 8).map((p, i) => (
              <div key={p.id} className={`w-44 shrink-0 snap-start sm:w-52 lg:w-auto ${i >= 4 ? 'lg:hidden' : ''}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
