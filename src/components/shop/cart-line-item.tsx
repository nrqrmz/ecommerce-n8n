import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Trash2 } from 'lucide-react'

import { ProductImage } from '@/components/shop/product-image'
import { QuantityStepper } from '@/components/shop/quantity-stepper'
import { useCart, type CartLine } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQuantity, remove } = useCart()
  const { product, quantity } = line
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
      className="glass flex gap-3 rounded-2xl p-2.5"
    >
      <Link to={`/products/${product.id}`} onClick={onNavigate} className="w-20 shrink-0 sm:w-24">
        <ProductImage src={product.thumbnail} alt={product.title} className="rounded-xl" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${product.id}`}
              onClick={onNavigate}
              className="line-clamp-2 font-display text-sm font-semibold hover:text-accent-foreground"
            >
              {product.title}
            </Link>
            <p className="text-xs text-muted-foreground">{formatPrice(product.price)} each</p>
          </div>
          <button
            type="button"
            className="-mt-1 -mr-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-destructive"
            aria-label={`Remove ${product.title}`}
            onClick={() => remove(product.id)}
          >
            <Trash2 className="size-4.5" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <QuantityStepper value={quantity} min={0} onChange={(q) => setQuantity(product.id, q)} />
          <span className="font-display font-bold tabular-nums">{formatPrice(product.price * quantity)}</span>
        </div>
      </div>
    </motion.li>
  )
}
