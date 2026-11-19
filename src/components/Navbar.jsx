import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { getCategories } from '../api/productService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import CategoryFilter from './CategoryFilter'
import SearchBar from './SearchBar'
import SortSelect, { SORT_OPTIONS } from './SortSelect'

const VALID_SORTS = SORT_OPTIONS.map((o) => o.value)

const linkClass =
  'relative inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:px-3'

const badgeClass =
  'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold'

function Navbar() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { count: favoriteCount } = useFavorites()

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  // Arama ve sıralama sadece ana sayfada görünür
  const isHome = location.pathname === '/'

  const searchTerm = isHome ? (searchParams.get('q') ?? '') : ''
  const rawSort = isHome ? (searchParams.get('sort') ?? '') : ''
  const sort = VALID_SORTS.includes(rawSort) ? rawSort : ''
  const selectedCategory = isHome ? (searchParams.get('category') ?? '') : ''

  const [categories, setCategories] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  const firstName = user?.name.split(' ')[0]

  // Kategorileri bir kez çek
  useEffect(() => {
    const controller = new AbortController()

    getCategories({ signal: controller.signal })
      .then(setCategories)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Kategoriler yüklenemedi:', err)
        }
      })

    return () => controller.abort()
  }, [])

  // Menü açıkken: Escape ile kapat, arka plan kaymasını engelle
  useEffect(() => {
    if (!menuOpen) return

    function handleKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  // Boş değerler URL'den silinir; her tuş vuruşu geçmişe yeni kayıt eklemez
  const updateParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  const handleCategory = (slug) => {
    // Ana sayfadaysak q ve sort korunur, başka sayfadaysak temiz filtreyle ana sayfaya gideriz
    const next = new URLSearchParams(isHome ? searchParams : undefined)
    if (slug) next.set('category', slug)
    else next.delete('category')

    const search = next.toString()
    navigate(
      { pathname: '/', search: search ? `?${search}` : '' },
      { replace: isHome },
    )

    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow">
      {/* Üst başlık */}
      <div className="bg-brand-navy py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src="/images/navbar-logo.jpg"
              alt="Somali Mini Mall"
              className="h-9 w-auto rounded sm:h-11"
            />
          </Link>

          <nav className="flex items-center gap-0.5 sm:gap-1">
            {user ? (
              <>
                <span className="mr-1 hidden text-sm text-blue-100 lg:inline">
                  Merhaba, {firstName}
                </span>

                <Link
                  to="/favorites"
                  aria-label={`Favoriler, ${favoriteCount} ürün`}
                  className={linkClass}
                >
                  <span aria-hidden="true">♥</span>
                  <span className="hidden sm:inline">Favoriler</span>
                  {favoriteCount > 0 && (
                    <span className={`${badgeClass} bg-red-500 text-white`}>
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                <button type="button" onClick={logout} className={linkClass}>
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110 sm:inline-flex"
                >
                  Kayıt Ol
                </Link>
              </>
            )}

            <Link
              to="/cart"
              aria-label={`Sepet, ${totalItems} ürün`}
              className={linkClass}
            >
              <span aria-hidden="true">🛒</span>
              <span className="hidden sm:inline">Sepet</span>
              {totalItems > 0 && (
                <span className={`${badgeClass} bg-brand-orange text-white`}>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger menü butonu */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Kategorileri aç"
              aria-expanded={menuOpen}
              aria-controls="category-menu"
              className="ml-1 rounded-lg p-2 text-white transition hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      {/* Arama + Sıralama (yalnızca ana sayfada) */}
      {isHome && (
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="sm:flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(value) => updateParam('q', value)}
              />
            </div>
            <div className="sm:w-72">
              <SortSelect
                value={sort}
                onChange={(value) => updateParam('sort', value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Kategori paneli */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside
            id="category-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Kategoriler"
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between bg-brand-navy px-4 py-3">
              <h2 className="font-semibold text-white">Kategoriler</h2>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Menüyü kapat"
                className="rounded-lg px-2 py-1 text-white transition hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={handleCategory}
              />
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}

export default Navbar