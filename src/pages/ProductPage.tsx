import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, ChevronRight, ShoppingCart } from 'lucide-react'

import { Reveal } from '@/components/fx/reveal'
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
  const imageRef = useRef<HTMLDivElement>(null)

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
        <div className="glass aspect-square animate-pulse rounded-[2rem]" />
        <div className="space-y-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-8 w-1/4 animate-pulse rounded bg-white/10" />
          <div className="h-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    )
  }
  if (!product) return <NotFoundPage />

  function handleAdd() {
    addToCart(product!, quantity, imageRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const addButton = (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={handleAdd}
      className={
        'flex h-13 flex-1 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-white transition-shadow md:flex-none ' +
        (added
          ? 'bg-emerald-500 shadow-[0_0_24px_rgb(16_185_129/0.6)]'
          : 'bg-gradient-to-r from-glow-1 to-glow-2 shadow-[0_0_30px_var(--glow-1)] hover:shadow-[0_0_45px_var(--glow-2)]')
      }
    >
      {added ? <Check className="size-5" /> : <ShoppingCart className="size-5" />}
      {added ? 'Added' : `Add to cart · ${formatPrice(product.price * quantity)}`}
    </motion.button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-32 md:py-10 md:pb-10">
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
        <div className="relative">
          <div className="absolute inset-[8%] rounded-full bg-glow-1/45 blur-[90px]" aria-hidden />
          <div className="relative">
            <ImageGallery images={images} alt={product.title} imageRef={imageRef} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            {product.brand && (
              <p className="text-xs font-bold tracking-[0.2em] text-glow-3 uppercase">{product.brand}</p>
            )}
            <h1 className="font-display text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">{product.title}</h1>
            <p className="font-display text-4xl font-bold tabular-nums text-gradient">{formatPrice(product.price)}</p>
          </div>

          {product.description && <p className="leading-relaxed text-muted-foreground">{product.description}</p>}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {addButton}
            <HeartButton productId={product.id} title={product.title} className="size-13" />
          </div>

          <dl className="glass divide-y divide-white/10 rounded-3xl text-sm">
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
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-white/10 bg-[oklch(0.16_0.03_278/0.88)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-2xl md:hidden">
        {addButton}
        <HeartButton productId={product.id} title={product.title} className="size-13 shrink-0" />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl font-bold tracking-tight md:text-3xl">
            More in {categoryLabel(product.category)}
          </h2>
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} index={i}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
