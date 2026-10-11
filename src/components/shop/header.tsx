import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react'

import { useCart } from '@/context/cart-context'
import { useFavorites } from '@/context/favorites-context'
import { useFlyToCart } from '@/context/fly-to-cart-context'
import { STORE_NAME, TAGLINE } from '@/lib/brand'
import { cn } from '@/lib/utils'

const iconButton =
  'relative flex size-11 items-center justify-center rounded-full text-foreground/85 transition-colors hover:bg-white/10 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none'

/** Count bubble whose number flips when it changes. */
function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-glow-1 to-glow-2 px-1 text-[11px] font-bold text-white shadow-[0_0_12px_var(--glow-1)]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {count > 99 ? '99+' : count}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-glow-3 via-glow-1 to-glow-2 text-white shadow-[0_0_20px_var(--glow-1)]">
        <ShoppingBag className="size-4.5" />
      </span>
      {STORE_NAME}
    </Link>
  )
}

export function Header() {
  const { count, setDrawerOpen } = useCart()
  const { count: favCount } = useFavorites()
  const { setTarget, landed } = useFlyToCart()

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="glass mx-auto flex h-16 max-w-6xl !bg-[oklch(0.15_0.03_278/0.72)] items-center justify-between gap-2 rounded-full pr-2 pl-4 shadow-[0_8px_32px_rgb(0_0_0/0.35)]">
        <Logo />
        <nav className="flex items-center gap-1">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                'mr-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10',
                isActive && 'bg-white/10',
              )
            }
          >
            Shop
          </NavLink>
          <NavLink to="/favorites" className={iconButton} aria-label={`Favorites, ${favCount} items`}>
            <Heart className="size-5" />
            <CountBadge count={favCount} />
          </NavLink>
          <motion.button
            key={landed}
            ref={setTarget}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(iconButton, 'bg-white/10')}
            aria-label={`Cart, ${count} items`}
            initial={landed > 0 ? { scale: 1.3, rotate: -12 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <ShoppingCart className="size-5" />
            <CountBadge count={count} />
          </motion.button>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="font-display text-3xl font-bold tracking-tight text-gradient md:text-4xl">{TAGLINE}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/products" className="hover:text-foreground">All products</Link>
          <Link to="/favorites" className="hover:text-foreground">Favorites</Link>
          <Link to="/cart" className="hover:text-foreground">Cart</Link>
        </nav>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {STORE_NAME}. Demo store. Payments are simulated.
      </p>
    </footer>
  )
}
