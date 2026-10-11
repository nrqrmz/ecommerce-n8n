import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check, Plus } from 'lucide-react'

import { InteractiveCard } from '@/components/fx/interactive-card'
import { Reveal } from '@/components/fx/reveal'
import { HeartButton } from '@/components/shop/heart-button'
import { ProductImage } from '@/components/shop/product-image'
import { useAddToCart } from '@/hooks/use-add-to-cart'
import { categoryLabel, type Product } from '@/lib/products'
import { cn, formatPrice } from '@/lib/utils'

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const addToCart = useAddToCart()
  const imageRef = useRef<HTMLDivElement>(null)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart(product, 1, imageRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <InteractiveCard className="flex h-full flex-col">
      <Link
        to={`/products/${product.id}`}
        className={cn('relative block overflow-hidden rounded-[1.25rem] m-1.5', featured && 'flex-1')}
      >
        <ProductImage
          ref={imageRef}
          src={featured ? product.image : product.thumbnail}
          alt={product.title}
          className={cn(
            'rounded-[1.25rem] transition-transform duration-500 ease-out group-hover/card:scale-[1.06]',
            featured && 'h-full lg:aspect-auto',
          )}
        />
      </Link>
      <HeartButton productId={product.id} title={product.title} className="absolute top-3 right-3" />
      <div className="flex flex-col gap-1 px-3.5 pt-2 pb-3.5">
        <p className="truncate text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {product.brand || categoryLabel(product.category)}
        </p>
        <Link
          to={`/products/${product.id}`}
          className={cn(
            'line-clamp-2 min-h-10 font-display text-sm leading-5 font-semibold hover:text-accent-foreground',
            featured && 'lg:text-xl lg:leading-7',
          )}
        >
          {product.title}
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className={cn('font-display text-lg font-bold tabular-nums', featured && 'lg:text-2xl')}>
            {formatPrice(product.price)}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
            className={cn(
              'flex size-11 items-center justify-center rounded-full text-white transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
              added
                ? 'bg-emerald-500 shadow-[0_0_20px_rgb(16_185_129/0.6)]'
                : 'bg-gradient-to-br from-glow-1 to-glow-2 shadow-[0_0_18px_var(--glow-1)] hover:shadow-[0_0_28px_var(--glow-2)]',
            )}
          >
            {added ? <Check className="size-5" /> : <Plus className="size-5" />}
          </motion.button>
        </div>
      </div>
    </InteractiveCard>
  )
}

const gridClass = 'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={gridClass}>
      {products.map((p, i) => (
        <Reveal key={p.id} index={i}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClass}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="glass overflow-hidden rounded-3xl p-1.5">
          <div className="aspect-square animate-pulse rounded-[1.25rem] bg-white/10" />
          <div className="space-y-2 p-2.5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
