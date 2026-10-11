import { useCallback } from 'react'
import { toast } from 'sonner'

import { useCart } from '@/context/cart-context'
import { useFlyToCart } from '@/context/fly-to-cart-context'
import type { Product } from '@/lib/products'

/**
 * Adds a product to the cart: the product image flies into the cart icon, and a toast offers a
 * shortcut to the cart drawer.
 */
export function useAddToCart() {
  const { add, setDrawerOpen } = useCart()
  const { fly } = useFlyToCart()
  return useCallback(
    (product: Product, quantity = 1, source?: HTMLElement | null) => {
      add(product, quantity)
      fly(source, product.thumbnail || product.image)
      toast.success('Added to cart', {
        duration: 6000,
        description: quantity > 1 ? `${quantity} × ${product.title}` : product.title,
        action: { label: 'View cart', onClick: () => setDrawerOpen(true) },
      })
    },
    [add, fly, setDrawerOpen],
  )
}
