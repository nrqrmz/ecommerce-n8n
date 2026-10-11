import { StrictMode } from 'react'
import { MotionConfig } from 'motion/react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ErrorBoundary } from './components/shop/error-boundary'
import { CartProvider } from './context/cart-context'
import { FavoritesProvider } from './context/favorites-context'
import { ProductsProvider } from './context/products-context'
import { FlyToCartProvider } from './context/fly-to-cart-context'
import './index.css'

// BASE_URL is "/" locally and on Vercel/Netlify, and "/<repo-name>/" on GitHub Pages.
// It is set automatically through vite.config.ts. Do not hardcode a basename here.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary>
          <ProductsProvider>
            <CartProvider>
              <FavoritesProvider>
                <FlyToCartProvider>
                  <App />
                </FlyToCartProvider>
              </FavoritesProvider>
            </CartProvider>
          </ProductsProvider>
        </ErrorBoundary>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
