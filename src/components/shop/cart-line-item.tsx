import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/shop/product-image'
import { QuantityStepper } from '@/components/shop/quantity-stepper'
import { useCart, type CartLine } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQuantity, remove } = useCart()
  const { product, quantity } = line
  return (
    <li className="flex gap-3 rounded-xl border bg-card p-3">
      <Link to={`/products/${product.id}`} onClick={onNavigate} className="w-20 shrink-0 sm:w-24">
        <ProductImage src={product.thumbnail} alt={product.title} className="rounded-lg" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${product.id}`}
              onClick={onNavigate}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {product.title}
            </Link>
            <p className="text-xs text-muted-foreground">{formatPrice(product.price)} each</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-1 -mr-1 size-11 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${product.title}`}
            onClick={() => remove(product.id)}
          >
            <Trash2 />
          </Button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <QuantityStepper value={quantity} min={0} onChange={(q) => setQuantity(product.id, q)} />
          <span className="font-semibold tabular-nums">{formatPrice(product.price * quantity)}</span>
        </div>
      </div>
    </li>
  )
}
