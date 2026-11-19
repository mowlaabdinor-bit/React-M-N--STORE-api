import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import SuccessModal from '../components/SuccessModal'
import { useCart } from '../context/CartContext'
import { initialCheckoutValues, validateCheckout } from '../utils/validators'

// Gerçek bir sunucu isteğini simüle eder
const fakeSubmit = () => new Promise((resolve) => setTimeout(resolve, 900))

function Checkout() {
  const navigate = useNavigate()
  const { items, totalItems, totalPrice, clearCart } = useCart()

  const [values, setValues] = useState(initialCheckoutValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState(null)

  // Hatalar state değil, her render'da değerlerden türetilir
  const errors = validateCheckout(values)

  // Alan hatası sadece dokunulduysa ya da form gönderilmeye çalışıldıysa görünür
  const errorFor = (name) => (touched[name] || submitted ? errors[name] : '')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
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
      // İlk hatalı alana odaklan
      document.querySelector(`[name="${errorKeys[0]}"]`)?.focus()
      return
    }

    setSubmitting(true)
    await fakeSubmit()

    // Sepet temizlenmeden önce sipariş özetini kopyala
    setOrder({
      id: `MS-${Date.now().toString().slice(-8)}`,
      itemCount: totalItems,
      total: totalPrice,
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
      },
    })
    clearCart()
    setSubmitting(false)
  }

  const handleCloseModal = () => {
    setOrder(null)
    navigate('/')
  }

  // Sipariş verildiyse sepet boş olsa da modal gösterilmeli
  if (items.length === 0 && !order) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Sepetin boş
        </h1>
        <p className="mb-6 text-gray-500">
          Sipariş verebilmek için önce sepetine ürün eklemelisin.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Alışverişe başla
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        ← Sepete dön
      </Link>

      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Teslimat Bilgileri
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <FormField
            label="Ad Soyad"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('fullName')}
            autoComplete="name"
            placeholder="Ayşe Yılmaz"
          />

          <div className="grid gap-4 sm:grid-cols-2">
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
              label="Telefon"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor('phone')}
              autoComplete="tel"
              inputMode="tel"
              placeholder="05XX XXX XX XX"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Şehir"
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor('city')}
              autoComplete="address-level1"
              placeholder="Ankara"
            />
            <FormField
              label="Posta Kodu"
              name="postalCode"
              value={values.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor('postalCode')}
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={5}
              placeholder="06000"
            />
          </div>

          <FormField
            label="Açık Adres"
            name="address"
            multiline
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('address')}
            autoComplete="street-address"
            placeholder="Mahalle, sokak, bina ve daire no"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {submitting ? 'Sipariş işleniyor...' : 'Siparişi Onayla'}
          </button>
        </form>

        {/* Sipariş özeti */}
      <aside className="h-fit lg:sticky lg:top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Sipariş Özeti
          </h2>

          <ul className="space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="text-gray-700">
                  {item.title}{' '}
                  <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-gray-200" />

          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Toplam</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </aside>
      </div>

      {order && <SuccessModal order={order} onClose={handleCloseModal} />}
    </main>
  )
}

export default Checkout