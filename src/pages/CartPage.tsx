import { Link } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { ShoppingBag } from 'lucide-react'

import { CartLineItem } from '@/components/shop/cart-line-item'
import { EmptyState } from '@/components/shop/empty-state'
import { PayButton } from '@/components/shop/pay-button'
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
          <Link
            to="/products"
            className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-glow-1 to-glow-2 px-6 font-semibold text-white"
          >
            Browse products
          </Link>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-48 md:py-12 md:pb-12">
      <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight md:text-5xl">
        Your <span className="text-gradient">cart</span>
      </h1>
      <div className="grid gap-6 md:grid-cols-[1fr_22rem] md:items-start">
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <CartLineItem key={line.product.id} line={line} />
            ))}
          </AnimatePresence>
        </ul>

        <aside className="fixed inset-x-0 bottom-0 z-30 space-y-3 border-t border-white/10 bg-[oklch(0.16_0.03_278/0.9)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-2xl md:glass md:sticky md:top-28 md:rounded-3xl md:p-6">
          <h2 className="hidden font-display text-lg font-bold md:block">Order summary</h2>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Items</span>
            <span className="tabular-nums">{count}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(total)}</span>
          </div>
          <PayButton total={total} paying={paying} onPay={pay} />
          <p className="text-center text-xs text-muted-foreground">Demo only. No real payment is made.</p>
        </aside>
      </div>
    </div>
  )
}
