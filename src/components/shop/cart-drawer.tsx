import { Link } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { ShoppingBag } from 'lucide-react'

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CartLineItem } from '@/components/shop/cart-line-item'
import { EmptyState } from '@/components/shop/empty-state'
import { PayButton } from '@/components/shop/pay-button'
import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/hooks/use-checkout'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn, formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { lines, count, total, drawerOpen, setDrawerOpen } = useCart()
  const { paying, pay } = useCheckout()
  const desktop = useMediaQuery('(min-width: 768px)')
  const close = () => setDrawerOpen(false)

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side={desktop ? 'right' : 'bottom'}
        className={cn(
          'gap-0 border-white/10 bg-[oklch(0.16_0.03_278/0.92)] p-0 backdrop-blur-2xl',
          desktop ? 'w-full sm:max-w-md' : 'max-h-[88dvh] rounded-t-[2rem]',
        )}
      >
        {!desktop && <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/25" aria-hidden />}
        <SheetHeader className="pr-14">
          <SheetTitle className="font-display text-xl">
            Your cart <span className="text-muted-foreground">({count})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
        </SheetHeader>
        {lines.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Find something you like.">
            <Link
              to="/products"
              onClick={close}
              className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-glow-1 to-glow-2 px-6 font-semibold text-white"
            >
              Browse products
            </Link>
          </EmptyState>
        ) : (
          <>
            <ul className="flex-1 space-y-2.5 overflow-y-auto px-4 pb-2">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <CartLineItem key={line.product.id} line={line} onNavigate={close} />
                ))}
              </AnimatePresence>
            </ul>
            <SheetFooter className="border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(total)}</span>
              </div>
              <PayButton total={total} paying={paying} onPay={pay} />
              <Link
                to="/cart"
                onClick={close}
                className="flex h-11 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                View full cart
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
