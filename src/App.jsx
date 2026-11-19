import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import RequireAuth from './components/RequireAuth'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'

function HeroBanner() {
  return (
    <section
      aria-label="Somali Mini Mall Vitrin Banner"
      className="mx-auto max-w-7xl px-4 pt-5 pb-2"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#0A2540] shadow-sm">
        <img
          src="/images/hero-banner.jpg"
          alt="Somali Mini Mall"
          className="block h-36 w-full object-cover object-[50%_42%] sm:h-48 md:h-52"
        />
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2540]">404</h1>
      <p className="mb-6 text-gray-500">Aradığın sayfa bulunamadı.</p>
      <Link
        to="/"
        className="font-semibold text-[#FF7A00] hover:underline"
      >
        Ana sayfaya dön
      </Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroBanner />
                <Home />
              </>
            }
          />
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