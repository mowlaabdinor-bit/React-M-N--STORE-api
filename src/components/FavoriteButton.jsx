import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

function FavoriteButton({ product, className = '' }) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()

  const active = isFavorite(product.id)

  const handleClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    toggleFavorite(product)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow transition hover:scale-110 ${
        active ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
      } ${className}`}
    >
      {active ? '♥' : '♡'}
    </button>
  )
}

export default FavoriteButton