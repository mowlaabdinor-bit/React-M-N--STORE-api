import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'
import { readJSON, writeJSON } from '../utils/storage'

const KEY_PREFIX = 'mini-store-favorites-'

const FavoritesContext = createContext(null)

function isValid(item) {
  return (
    item &&
    typeof item.id === 'number' &&
    typeof item.price === 'number' &&
    typeof item.rating === 'number'
  )
}

function loadFavorites(userId) {
  if (!userId) return []
  const data = readJSON(KEY_PREFIX + userId, [])
  return Array.isArray(data) ? data.filter(isValid) : []
}

// Listede ihtiyaç duyulan alanları sakla
function toFavorite(product) {
  const { id, title, price, thumbnail, rating, category, stock } = product
  return { id, title, price, thumbnail, rating, category, stock }
}

function FavoritesStore({ userId, children }) {
  const [items, setItems] = useState(() => loadFavorites(userId))

  useEffect(() => {
    if (userId) writeJSON(KEY_PREFIX + userId, items)
  }, [userId, items])

  const value = useMemo(() => {
    const ids = new Set(items.map((item) => item.id))

    return {
      items,
      count: items.length,
      isFavorite: (id) => ids.has(id),
      toggleFavorite: (product) =>
        setItems((prev) =>
          prev.some((item) => item.id === product.id)
            ? prev.filter((item) => item.id !== product.id)
            : [toFavorite(product), ...prev],
        ),
    }
  }, [items])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth()

  return (
    <FavoritesStore key={user?.id ?? 'guest'} userId={user?.id}>
      {children}
    </FavoritesStore>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites yalnızca FavoritesProvider içinde kullanılabilir')
  }
  return context
}