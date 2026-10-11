import { Route, Routes, useLocation, useOutlet } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { AuroraBackground } from '@/components/fx/aurora-background'
import { Footer, Header } from '@/components/shop/header'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { Toaster } from '@/components/ui/sonner'
import CartPage from '@/pages/CartPage'
import FavoritesPage from '@/pages/FavoritesPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import OrderConfirmedPage from '@/pages/OrderConfirmedPage'
import ProductPage from '@/pages/ProductPage'
import ProductsPage from '@/pages/ProductsPage'

function Layout() {
  const { pathname } = useLocation()
  const outlet = useOutlet()
  // Use a block body: newer browsers return a Promise from scrollTo, and React would
  // mistake a returned value for a cleanup function and crash on the next navigation.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <AuroraBackground />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="bottom-center" offset={24} mobileOffset={{ bottom: 84 }} closeButton />
    </div>
  )
}

// All routes live here.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
