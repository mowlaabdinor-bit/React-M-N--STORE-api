import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'
import {
  initialLoginValues,
  initialRegisterValues,
  validateLogin,
  validateRegister,
} from '../utils/validators'

function Auth({ mode }) {
  const isRegister = mode === 'register'
  const { user, login, register } = useAuth()
  const location = useLocation()

  // Korumalı sayfadan yönlendirildiyse girişten sonra oraya dön
  const from = location.state?.from
  const redirectTo = from ? `${from.pathname}${from.search}` : '/'

  const [values, setValues] = useState(
    isRegister ? initialRegisterValues : initialLoginValues,
  )
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const errors = isRegister ? validateRegister(values) : validateLogin(values)
  const errorFor = (name) => (touched[name] || submitted ? errors[name] : '')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setFormError('')
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitted(true)

    const errorKeys = Object.keys(errors)
    if (errorKeys.length > 0) {
      document.querySelector(`[name="${errorKeys[0]}"]`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      if (isRegister) await register(values)
      else await login(values)
      // Başarılıysa user dolar ve aşağıdaki <Navigate> devreye girer
    } catch (err) {
      setFormError(err.message)
      setSubmitting(false)
    }
  }

  if (user) return <Navigate to={redirectTo} replace />

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">
          {isRegister ? 'Hesap oluştur' : 'Giriş yap'}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {isRegister
            ? 'Favorilerini kaydetmek için kayıt ol.'
            : 'Favori ürünlerine ulaşmak için giriş yap.'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isRegister && (
            <FormField
              label="Ad Soyad"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor('name')}
              autoComplete="name"
              placeholder="Ayşe Yılmaz"
            />
          )}

          <FormField
            label="E-posta"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('email')}
            autoComplete="email"
            placeholder="ayse@site.com"
          />

          <FormField
            label="Şifre"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('password')}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />

          {isRegister && (
            <FormField
              label="Şifre Tekrar"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor('confirmPassword')}
              autoComplete="new-password"
            />
          )}

          {formError && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {submitting
              ? 'Lütfen bekle...'
              : isRegister
                ? 'Kayıt Ol'
                : 'Giriş Yap'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}{' '}
          <Link
            to={isRegister ? '/login' : '/register'}
            state={location.state}
            className="font-medium text-indigo-600 hover:underline"
          >
            {isRegister ? 'Giriş yap' : 'Kayıt ol'}
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Auth