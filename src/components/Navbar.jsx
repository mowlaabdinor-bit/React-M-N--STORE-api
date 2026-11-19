import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

const linkClass =
  'relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700'

const badgeClass =
  'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold'

function Navbar() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { count: favoriteCount } = useFavorites()

  const firstName = user?.name.split(' ')[0]

  return (
    <header className="bg-indigo-600 py-3 shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4">
        <Link to="/" className="text-xl font-bold text-white">
          Mini Store
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <span className="mr-1 hidden text-sm text-indigo-100 md:inline">
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
                className="hidden rounded-lg bg-white px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 sm:inline-flex"
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
              <span className={`${badgeClass} bg-amber-400 text-gray-900`}>
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar