import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCart } from '@/context/cart-context'

/** Simulated payment: waits a moment, clears the cart and shows the confirmation page. */
export function useCheckout() {
  const { checkout, setDrawerOpen } = useCart()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)

  const pay = useCallback(() => {
    setPaying(true)
    setTimeout(() => {
      // Close the drawer and leave the page first, so the empty cart is never flashed.
      setDrawerOpen(false)
      navigate('/order-confirmed', { replace: true })
      checkout()
      setPaying(false)
    }, 1200)
  }, [checkout, navigate, setDrawerOpen])

  return { paying, pay }
}
