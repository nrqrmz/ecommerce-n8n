import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Store } from 'lucide-react'

import { useCart } from '@/context/cart-context'
import { cn } from '@/lib/utils'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn('px-2 py-2 text-sm font-medium hover:underline', isActive && 'underline')

export function Header() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Store className="size-5" />
          Shop
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={(s) => cn(navClass(s), 'hidden md:block')}>
            Home
          </NavLink>
          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className="relative ml-1 flex size-11 items-center justify-center rounded-md hover:bg-accent"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute top-1 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      Demo store. Payments are simulated.
    </footer>
  )
}
