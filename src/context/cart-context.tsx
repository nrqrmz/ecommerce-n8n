import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'

import type { Product } from '@/lib/products'

export interface CartLine {
  product: Product
  quantity: number
}

type Action =
  | { type: 'replace'; lines: CartLine[] }
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'setQuantity'; id: number; quantity: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' }

const MAX_QTY = 99

function reducer(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'replace':
      return action.lines
    case 'add': {
      const existing = lines.find((l) => l.product.id === action.product.id)
      if (!existing) return [...lines, { product: action.product, quantity: action.quantity }]
      return lines.map((l) =>
        l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.quantity) } : l,
      )
    }
    case 'setQuantity':
      if (action.quantity < 1) return lines.filter((l) => l.product.id !== action.id)
      return lines.map((l) =>
        l.product.id === action.id ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l,
      )
    case 'remove':
      return lines.filter((l) => l.product.id !== action.id)
    case 'clear':
      return []
  }
}

interface CartState {
  lines: CartLine[]
  count: number
  total: number
  lastOrder: string | null
  add: (product: Product, quantity?: number) => void
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
  /** Simulated payment: empties the cart and returns a fake order number. */
  checkout: () => string
}

const CartContext = createContext<CartState | null>(null)

const CART_KEY = 'cart:v1'
const ORDER_KEY = 'lastOrder:v1'

function isLine(v: unknown): v is CartLine {
  const l = v as CartLine
  return (
    !!l &&
    typeof l.quantity === 'number' &&
    l.quantity >= 1 &&
    !!l.product &&
    typeof l.product.id === 'number' &&
    typeof l.product.title === 'string' &&
    typeof l.product.price === 'number'
  )
}

function loadCart(): CartLine[] {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    return Array.isArray(data) ? data.filter(isLine) : []
  } catch {
    return []
  }
}

function saveCart(lines: CartLine[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines))
  } catch {
    // Storage may be blocked or full; the cart keeps working in memory.
  }
}

function loadOrder(): string | null {
  try {
    return sessionStorage.getItem(ORDER_KEY)
  } catch {
    return null
  }
}

// The cart is saved in localStorage so it survives reloads and is shared between tabs.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadCart)
  const [lastOrder, setLastOrder] = useState<string | null>(loadOrder)

  useEffect(() => saveCart(lines), [lines])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === CART_KEY) dispatch({ type: 'replace', lines: loadCart() })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback(
    (product: Product, quantity = 1) => dispatch({ type: 'add', product, quantity }),
    [],
  )
  const setQuantity = useCallback(
    (id: number, quantity: number) => dispatch({ type: 'setQuantity', id, quantity }),
    [],
  )
  const remove = useCallback((id: number) => dispatch({ type: 'remove', id }), [])
  const checkout = useCallback(() => {
    const order = `ORD-${Date.now().toString(36).toUpperCase()}`
    setLastOrder(order)
    try {
      sessionStorage.setItem(ORDER_KEY, order)
    } catch {
      // Ignore: the confirmation page then only works until the next reload.
    }
    dispatch({ type: 'clear' })
    return order
  }, [])

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      total: lines.reduce((sum, l) => sum + l.quantity * l.product.price, 0),
      lastOrder,
      add,
      setQuantity,
      remove,
      checkout,
    }),
    [lines, lastOrder, add, setQuantity, remove, checkout],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
