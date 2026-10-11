import { Link, Navigate } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

export default function OrderConfirmedPage() {
  const { lastOrder } = useCart()
  if (!lastOrder) return <Navigate to="/" replace />
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <CircleCheck className="mx-auto size-16 text-green-600" />
      <h1 className="mt-4 text-2xl font-bold">Thank you for your order!</h1>
      <p className="mt-2 text-muted-foreground">
        Your order number is <span className="font-mono font-semibold text-foreground">{lastOrder}</span>.
        This was a simulated payment, so nothing was charged.
      </p>
      <Button asChild className="mt-6 h-11">
        <Link to="/products">Continue shopping</Link>
      </Button>
    </div>
  )
}
