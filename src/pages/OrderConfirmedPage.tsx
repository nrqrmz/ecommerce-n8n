import { Link, Navigate } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

export default function OrderConfirmedPage() {
  const { lastOrder } = useCart()
  if (!lastOrder) return <Navigate to="/" replace />
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
        <CircleCheck className="size-11 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight md:text-3xl">Thank you for your order!</h1>
      <p className="mt-3 text-muted-foreground">
        Your order number is{' '}
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono font-semibold text-foreground">{lastOrder}</span>.
        <br />
        This was a simulated payment, so nothing was charged.
      </p>
      <Button asChild className="mt-8 h-12 px-8">
        <Link to="/products">Continue shopping</Link>
      </Button>
    </div>
  )
}
