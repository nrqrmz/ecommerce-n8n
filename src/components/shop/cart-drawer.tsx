import { Link } from 'react-router-dom'
import { Loader2, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CartLineItem } from '@/components/shop/cart-line-item'
import { EmptyState } from '@/components/shop/empty-state'
import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/hooks/use-checkout'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { lines, count, total, drawerOpen, setDrawerOpen } = useCart()
  const { paying, pay } = useCheckout()
  const close = () => setDrawerOpen(false)

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b pr-14">
          <SheetTitle className="text-lg">Your cart ({count})</SheetTitle>
          <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
        </SheetHeader>
        {lines.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Find something you like.">
            <Button asChild className="h-11" onClick={close}>
              <Link to="/products">Browse products</Link>
            </Button>
          </EmptyState>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {lines.map((line) => (
                <CartLineItem key={line.product.id} line={line} onNavigate={close} />
              ))}
            </ul>
            <SheetFooter className="border-t bg-muted/40">
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              <Button className="h-12 w-full text-base" disabled={paying} onClick={pay}>
                {paying && <Loader2 className="animate-spin" />}
                {paying ? 'Processing…' : `Pay ${formatPrice(total)}`}
              </Button>
              <Button asChild variant="outline" className="h-11 w-full" onClick={close}>
                <Link to="/cart">View full cart</Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">Demo only. No real payment is made.</p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
