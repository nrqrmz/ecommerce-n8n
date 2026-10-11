import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { Footer, Header } from '@/components/shop/header'
import CartPage from '@/pages/CartPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import OrderConfirmedPage from '@/pages/OrderConfirmedPage'
import ProductPage from '@/pages/ProductPage'
import ProductsPage from '@/pages/ProductsPage'

function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo({ top: 0 }), [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
