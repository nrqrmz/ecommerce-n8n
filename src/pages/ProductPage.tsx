import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronRight, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/shop/error-state'
import { HeartButton } from '@/components/shop/heart-button'
import { ImageGallery } from '@/components/shop/image-gallery'
import { ProductCard } from '@/components/shop/product-card'
import { QuantityStepper } from '@/components/shop/quantity-stepper'
import { useProducts } from '@/context/products-context'
import { useAddToCart } from '@/hooks/use-add-to-cart'
import { categoryLabel } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ProductPage() {
  const { id } = useParams()
  const { products, loading, error, retry } = useProducts()
  const addToCart = useAddToCart()
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
  const images = useMemo(
    () => (product ? [...new Set([product.image, product.thumbnail].filter(Boolean))] : []),
    [product],
  )

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ErrorState message={error} onRetry={retry} />
      </div>
    )
  }
  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-2 md:gap-10 md:py-10">
        <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-8 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }
  if (!product) return <NotFoundPage />

  function handleAdd() {
    addToCart(product!, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const addButton = (
    <Button className="h-12 flex-1 text-base md:flex-none md:px-8" onClick={handleAdd}>
      {added ? <Check /> : <ShoppingCart />}
      {added ? 'Added' : `Add to cart · ${formatPrice(product.price * quantity)}`}
    </Button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-28 md:py-10 md:pb-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 overflow-hidden text-sm text-muted-foreground">
        <Link to="/" className="shrink-0 hover:text-primary">Home</Link>
        <ChevronRight className="size-4 shrink-0" />
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="shrink-0 hover:text-primary"
        >
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight className="size-4 shrink-0" />
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <ImageGallery images={images} alt={product.title} />

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            {product.brand && (
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">{product.brand}</p>
            )}
            <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">{product.title}</h1>
            <p className="text-3xl font-bold tabular-nums">{formatPrice(product.price)}</p>
          </div>

          {product.description && <p className="leading-relaxed text-muted-foreground">{product.description}</p>}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {addButton}
            <HeartButton productId={product.id} title={product.title} className="size-12 border" />
          </div>

          <dl className="divide-y rounded-2xl border bg-card text-sm">
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{categoryLabel(product.category)}</dd>
            </div>
            {product.sku && (
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-mono text-xs font-medium">{product.sku}</dd>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted-foreground">Dimensions (W × H × D)</dt>
                <dd className="font-medium tabular-nums">
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Sticky add-to-cart bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        {addButton}
        <HeartButton productId={product.id} title={product.title} className="size-12 shrink-0 border" />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
            More in {categoryLabel(product.category)}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
