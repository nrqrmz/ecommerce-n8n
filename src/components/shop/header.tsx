import { Link, NavLink } from 'react-router-dom'
import { Heart, Moon, ShoppingBag, ShoppingCart, Sun } from 'lucide-react'

import { useCart } from '@/context/cart-context'
import { useFavorites } from '@/context/favorites-context'
import { useTheme } from '@/context/theme-context'
import { STORE_NAME, TAGLINE } from '@/lib/brand'
import { cn } from '@/lib/utils'

const iconButton =
  'relative flex size-11 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute top-1 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-background">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ShoppingBag className="size-4.5" />
      </span>
      <span className="text-lg">{STORE_NAME}</span>
    </Link>
  )
}

export function Header() {
  const { count, setDrawerOpen } = useCart()
  const { count: favCount } = useFavorites()
  const { resolved, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Logo />
        <nav className="flex items-center gap-0.5">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                'mr-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent text-accent-foreground',
              )
            }
          >
            Shop
          </NavLink>
          <button
            type="button"
            onClick={toggle}
            className={iconButton}
            aria-label={resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolved === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <NavLink to="/favorites" className={iconButton} aria-label={`Favorites, ${favCount} items`}>
            <Heart className="size-5" />
            <CountBadge count={favCount} />
          </NavLink>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={iconButton}
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingCart className="size-5" />
            <CountBadge count={count} />
          </button>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-12 border-t bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">{TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/products" className="hover:text-primary">All products</Link>
          <Link to="/favorites" className="hover:text-primary">Favorites</Link>
          <Link to="/cart" className="hover:text-primary">Cart</Link>
        </nav>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {STORE_NAME}. Demo store. Payments are simulated.
      </p>
    </footer>
  )
}
