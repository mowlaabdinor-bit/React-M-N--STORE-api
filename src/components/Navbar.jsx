import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

const linkClass =
  'relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white transition hover:bg-white/10'

const badgeClass =
  'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold'

function Navbar() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { count: favoriteCount } = useFavorites()

  const firstName = user?.name.split(' ')[0]

  return (
    <header className="bg-[#0A2540] py-2 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/navbar-logo.jpg"
            alt="Somali Mini Mall"
            className="h-10 w-auto rounded object-contain"
          />
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <span className="hidden text-xs text-slate-200 xs:inline sm:mr-1">
                Merhaba, {firstName}
              </span>

              <Link
                to="/favorites"
                aria-label={`Favoriler, ${favoriteCount} ürün`}
                className={`${linkClass} group`}
              >
                <span aria-hidden="true" className="group-hover:scale-110 transition-transform">♥</span>
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
                className="inline-flex rounded-lg bg-[#FF7A00] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#e56d00]"
              >
                Kayıt Ol
              </Link>
            </>
          )}

          <Link
            to="/cart"
            aria-label={`Sepet, ${totalItems} ürün`}
            className={`${linkClass} group`}
          >
            <span aria-hidden="true" className="group-hover:scale-110 transition-transform">🛒</span>
            <span className="hidden sm:inline">Sepet</span>
            {totalItems > 0 && (
              <span className={`${badgeClass} bg-[#FF7A00] text-white`}>
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