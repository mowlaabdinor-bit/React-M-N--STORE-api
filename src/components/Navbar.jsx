import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

const linkClass =
  'relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white transition hover:bg-white/10'

const badgeClass =
  'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const { count: favoriteCount } = useFavorites()

  const firstName = user?.name?.split(' ')[0]

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <header className="bg-[#0A2540] py-2 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src="/images/navbar-logo.jpg"
            alt="Somali Mini Mall"
            className="h-10 w-auto rounded object-contain"
          />
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <span className="hidden text-xs text-slate-200 sm:mr-1 md:inline">
                Merhaba, {firstName}
              </span>

              <Link
                to="/favorites"
                aria-label={`Favoriler, ${favoriteCount} ürün`}
                className={`${linkClass} group hidden sm:inline-flex`}
              >
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:scale-110"
                >
                  ♥
                </span>
                <span>Favoriler</span>
                {favoriteCount > 0 && (
                  <span className={`${badgeClass} bg-red-500 text-white`}>
                    {favoriteCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={logout}
                className={`${linkClass} hidden sm:inline-flex`}
              >
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
            <span
              aria-hidden="true"
              className="transition-transform group-hover:scale-110"
            >
              🛒
            </span>
            <span className="hidden sm:inline">Sepet</span>
            {totalItems > 0 && (
              <span className={`${badgeClass} bg-[#FF7A00] text-white`}>
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menüyü aç veya kapat"
            aria-expanded={menuOpen}
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          >
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0A2540] px-4 py-3 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              Ana Sayfa / Ürünler
            </Link>
            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              <span>Sepet</span>
              <span className="rounded-full bg-[#FF7A00] px-2 py-0.5 text-xs font-bold">
                {totalItems}
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/favorites"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
                >
                  <span>Favoriler</span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">
                    {favoriteCount}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-orange-300 hover:bg-white/10"
                >
                  Çıkış Yap ({firstName})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-[#FF7A00] px-3 py-2 text-center text-sm font-semibold hover:bg-[#e56d00]"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar