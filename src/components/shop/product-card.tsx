import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { HeartButton } from '@/components/shop/heart-button'
import { ProductImage } from '@/components/shop/product-image'
import { useAddToCart } from '@/hooks/use-add-to-cart'
import { categoryLabel, type Product } from '@/lib/products'
import { formatPrice } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition-shadow hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block overflow-hidden bg-muted">
        <ProductImage
          src={product.thumbnail}
          alt={product.title}
          className="bg-transparent transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <HeartButton productId={product.id} title={product.title} className="absolute top-2 right-2" />
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {product.brand || categoryLabel(product.category)}
        </p>
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 min-h-10 text-sm leading-5 font-medium hover:text-primary"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-base font-bold tabular-nums">{formatPrice(product.price)}</span>
          <Button
            size="icon"
            variant={added ? 'secondary' : 'default'}
            className="size-11 rounded-full"
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? <Check /> : <Plus />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border bg-card">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
