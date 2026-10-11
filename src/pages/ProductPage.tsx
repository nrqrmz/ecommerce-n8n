import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/shop/error-state'
import { ProductCard } from '@/components/shop/product-card'
import { ProductImage } from '@/components/shop/product-image'
import { useCart } from '@/context/cart-context'
import { useProducts } from '@/context/products-context'
import { categoryLabel } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ProductPage() {
  const { id } = useParams()
  const { products, loading, error, retry } = useProducts()
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => String(p.id) === id)
  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [],
    [products, product],
  )

  if (error) return <div className="mx-auto max-w-6xl px-4 py-8"><ErrorState message={error} onRetry={retry} /></div>
  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }
  if (!product) return <NotFoundPage />

  function handleAdd() {
    add(product!, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const addButton = (
    <Button className="h-12 w-full md:w-auto md:px-8" onClick={handleAdd}>
      {added ? <Check /> : <ShoppingCart />}
      {added ? 'Added' : `Add to cart · ${formatPrice(product.price * quantity)}`}
    </Button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-28 md:py-8 md:pb-8">
      <Link to="/products" className="text-sm text-muted-foreground hover:underline">
        ← Back to products
      </Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
        <ProductImage src={product.image} alt={product.title} eager className="rounded-xl" />
        <div className="space-y-4">
          <Badge variant="secondary">{categoryLabel(product.category)}</Badge>
          <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
          {product.brand && <p className="text-muted-foreground">by {product.brand}</p>}
          <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <Button
              variant="outline"
              size="icon"
              className="size-11"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => q - 1)}
            >
              <Minus />
            </Button>
            <span className="w-8 text-center font-medium" aria-live="polite">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-11"
              aria-label="Increase quantity"
              disabled={quantity >= 99}
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus />
            </Button>
          </div>

          <div className="hidden md:block">{addButton}</div>

          <dl className="grid grid-cols-2 gap-y-2 border-t pt-4 text-sm">
            {product.sku && (<><dt className="text-muted-foreground">SKU</dt><dd>{product.sku}</dd></>)}
            {product.dimensions && (
              <>
                <dt className="text-muted-foreground">Dimensions (W × H × D)</dt>
                <dd>
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>

      {/* Sticky add-to-cart bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background p-3 md:hidden">{addButton}</div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">More in {categoryLabel(product.category)}</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
