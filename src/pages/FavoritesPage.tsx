import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shop/empty-state'
import { ErrorState } from '@/components/shop/error-state'
import { ProductGrid, ProductGridSkeleton } from '@/components/shop/product-card'
import { useFavorites } from '@/context/favorites-context'
import { useProducts } from '@/context/products-context'

export default function FavoritesPage() {
  const { ids } = useFavorites()
  const { products, loading, error, retry } = useProducts()
  const byId = new Map(products.map((p) => [p.id, p]))
  const favorites = ids.flatMap((id) => byId.get(id) ?? [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight md:text-3xl">Favorites</h1>
      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : loading && ids.length > 0 ? (
        <ProductGridSkeleton count={Math.min(ids.length, 8)} />
      ) : favorites.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" description="Tap the heart on any product to save it here.">
          <Button asChild className="h-11">
            <Link to="/products">Browse products</Link>
          </Button>
        </EmptyState>
      ) : (
        <ProductGrid products={favorites} />
      )}
    </div>
  )
}
