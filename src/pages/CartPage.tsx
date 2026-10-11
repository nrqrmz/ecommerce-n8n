import { Link } from 'react-router-dom'
import { Loader2, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CartLineItem } from '@/components/shop/cart-line-item'
import { EmptyState } from '@/components/shop/empty-state'
import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/hooks/use-checkout'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { lines, total, count } = useCart()
  const { paying, pay } = useCheckout()

  if (lines.length === 0 && !paying) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add something you like and it will show up here.">
          <Button asChild className="h-11">
            <Link to="/products">Browse products</Link>
          </Button>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-44 md:py-10 md:pb-10">
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight md:text-3xl">Cart ({count})</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_22rem] md:items-start">
        <ul className="space-y-3">
          {lines.map((line) => (
            <CartLineItem key={line.product.id} line={line} />
          ))}
        </ul>

        <aside className="fixed inset-x-0 bottom-0 z-30 space-y-3 border-t bg-background/95 p-4 backdrop-blur md:sticky md:top-24 md:rounded-2xl md:border md:bg-card md:p-5">
          <h2 className="hidden text-lg font-bold md:block">Order summary</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Items</span>
            <span className="tabular-nums">{count}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          <Button className="h-12 w-full text-base" disabled={paying} onClick={pay}>
            {paying && <Loader2 className="animate-spin" />}
            {paying ? 'Processing…' : `Pay ${formatPrice(total)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">Demo only. No real payment is made.</p>
        </aside>
      </div>
    </div>
  )
}
