import { Link } from 'react-router-dom'
import { Check, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/shop/product-image'
import { useCart } from '@/context/cart-context'
import { categoryLabel, type Product } from '@/lib/products'
import { formatPrice } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <Link to={`/products/${product.id}`} className="block">
        <ProductImage src={product.thumbnail} alt={product.title} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Badge variant="secondary" className="w-fit">
          {categoryLabel(product.category)}
        </Badge>
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 min-h-10 text-sm font-medium hover:underline"
        >
          {product.title}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <Button
            size="icon"
            variant={added ? 'secondary' : 'default'}
            className="size-11"
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
          >
            {added ? <Check /> : <ShoppingCart />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
