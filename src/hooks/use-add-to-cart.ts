import { useCallback } from 'react'
import { toast } from 'sonner'

import { useCart } from '@/context/cart-context'
import type { Product } from '@/lib/products'

/** Adds a product to the cart and shows a toast with a shortcut to the cart drawer. */
export function useAddToCart() {
  const { add, setDrawerOpen } = useCart()
  return useCallback(
    (product: Product, quantity = 1) => {
      add(product, quantity)
      toast.success('Added to cart', {
        description: quantity > 1 ? `${quantity} × ${product.title}` : product.title,
        action: { label: 'View cart', onClick: () => setDrawerOpen(true) },
      })
    },
    [add, setDrawerOpen],
  )
}
