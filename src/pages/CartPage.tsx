import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/shop/product-image'
import { useCart } from '@/context/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { lines, total, count, setQuantity, remove, checkout } = useCart()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)

  function pay() {
    setPaying(true)
    // Simulated payment: wait a moment, then clear the cart.
    setTimeout(() => {
      checkout()
      navigate('/order-confirmed', { replace: true })
    }, 1200)
  }

  if (lines.length === 0 && !paying) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something you like and it will show up here.</p>
        <Button asChild className="mt-6 h-11">
          <Link to="/products">Browse products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-40 md:py-8 md:pb-8">
      <h1 className="mb-4 text-2xl font-bold">Cart ({count})</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_20rem] md:items-start">
        <ul className="space-y-3">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-3 rounded-xl border p-3">
              <Link to={`/products/${product.id}`} className="w-20 shrink-0 sm:w-24">
                <ProductImage src={product.thumbnail} alt={product.title} className="rounded-md" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <Link to={`/products/${product.id}`} className="line-clamp-2 text-sm font-medium hover:underline">
                    {product.title}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mt-1 -mr-1 size-11 shrink-0"
                    aria-label={`Remove ${product.title}`}
                    onClick={() => remove(product.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="size-11" aria-label="Decrease quantity" onClick={() => setQuantity(product.id, quantity - 1)}>
                      <Minus />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" className="size-11" aria-label="Increase quantity" onClick={() => setQuantity(product.id, quantity + 1)}>
                      <Plus />
                    </Button>
                  </div>
                  <span className="font-semibold">{formatPrice(product.price * quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="fixed inset-x-0 bottom-0 z-30 space-y-3 border-t bg-background p-4 md:static md:rounded-xl md:border md:p-5">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button className="h-12 w-full" disabled={paying} onClick={pay}>
            {paying && <Loader2 className="animate-spin" />}
            {paying ? 'Processing…' : `Pay ${formatPrice(total)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Demo only. No real payment is made.</p>
        </aside>
      </div>
    </div>
  )
}
