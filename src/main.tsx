import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ErrorBoundary } from './components/shop/error-boundary'
import { CartProvider } from './context/cart-context'
import { FavoritesProvider } from './context/favorites-context'
import { ProductsProvider } from './context/products-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'

// BASE_URL is "/" locally and on Vercel/Netlify, and "/<repo-name>/" on GitHub Pages.
// It is set automatically through vite.config.ts. Do not hardcode a basename here.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <ErrorBoundary>
          <ProductsProvider>
            <CartProvider>
              <FavoritesProvider>
                <App />
              </FavoritesProvider>
            </CartProvider>
          </ProductsProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
