import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import RequireAuth from './components/RequireAuth'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'

function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">404</h1>
      <p className="mb-6 text-gray-500">Aradığın sayfa bulunamadı.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Ana sayfaya dön
      </Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Auth key="login" mode="login" />} />
          <Route
            path="/register"
            element={<Auth key="register" mode="register" />}
          />
          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App