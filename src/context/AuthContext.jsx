import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { readJSON, removeKey, writeJSON } from '../utils/storage'

const USERS_KEY = 'mini-store-users'
const SESSION_KEY = 'mini-store-session'

const AuthContext = createContext(null)

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function loadSession() {
  const session = readJSON(SESSION_KEY, null)
  return session &&
    typeof session.id === 'string' &&
    typeof session.email === 'string'
    ? session
    : null
}

function loadUsers() {
  const users = readJSON(USERS_KEY, [])
  return Array.isArray(users) ? users : []
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  const startSession = useCallback((account) => {
    const session = { id: account.id, name: account.name, email: account.email }
    writeJSON(SESSION_KEY, session)
    setUser(session)
  }, [])

  const register = useCallback(
    async ({ name, email, password }) => {
      const passwordHash = await hashPassword(password)
      const normalizedEmail = email.trim().toLowerCase()

      // Okuma ve yazma aynı senkron blokta: hash beklerken araya giren yazma kaybolmaz
      const users = loadUsers()
      if (users.some((u) => u.email === normalizedEmail)) {
        throw new Error('Bu e-posta ile kayıtlı bir hesap zaten var.')
      }

      const account = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      }

      if (!writeJSON(USERS_KEY, [...users, account])) {
        throw new Error('Kayıt oluşturulamadı: tarayıcı depolaması kullanılamıyor.')
      }

      startSession(account)
    },
    [startSession],
  )

  const login = useCallback(
    async ({ email, password }) => {
      const passwordHash = await hashPassword(password)
      const normalizedEmail = email.trim().toLowerCase()

      const account = loadUsers().find(
        (u) => u.email === normalizedEmail && u.passwordHash === passwordHash,
      )

      // Hangi alanın yanlış olduğunu belli etmeyen tek mesaj
      if (!account) throw new Error('E-posta veya şifre hatalı.')

      startSession(account)
    },
    [startSession],
  )

  const logout = useCallback(() => {
    removeKey(SESSION_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth yalnızca AuthProvider içinde kullanılabilir')
  }
  return context
}