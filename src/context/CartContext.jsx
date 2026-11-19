import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'mini-store-cart'

const CartContext = createContext(null)

// LocalStorage'dan güvenli okuma
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Bozuk kayıtları ele
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'number' &&
        typeof item.price === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    )
  } catch {
    return []
  }
}

// LocalStorage'a güvenli yazma
function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Sepet kaydedilemedi:', err)
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, quantity } = action.payload
      const existing = state.find((item) => item.id === product.id)

      if (existing) {
        return state.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, item.stock),
              }
            : item,
        )
      }

      return [
        ...state,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ]
    }

    case 'INCREASE':
      return state.map((item) =>
        item.id === action.payload && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )

    case 'DECREASE':
      // Adet 1'in altına düşerse ürün sepetten çıkar
      return state
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0)

    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload)

    case 'REPLACE':
      return action.payload
      
    case 'CLEAR':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  // Lazy initializer: LocalStorage sadece ilk render'da okunur
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  // Sepet her değiştiğinde kalıcı hâle getir
  useEffect(() => {
    saveCart(items)
  }, [items])

  // Başka sekmede yapılan sepet değişikliklerini senkronize et
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY) {
        dispatch({ type: 'REPLACE', payload: loadCart() })
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    return {
      items,
      totalItems,
      totalPrice,
      addToCart: (product, quantity = 1) =>
        dispatch({ type: 'ADD', payload: { product, quantity } }),
      increaseQuantity: (id) => dispatch({ type: 'INCREASE', payload: id }),
      decreaseQuantity: (id) => dispatch({ type: 'DECREASE', payload: id }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE', payload: id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      getQuantity: (id) =>
        items.find((item) => item.id === id)?.quantity ?? 0,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart yalnızca CartProvider içinde kullanılabilir')
  }
  return context
}