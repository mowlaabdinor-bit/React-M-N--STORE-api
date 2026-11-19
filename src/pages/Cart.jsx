import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🛒</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Sepetin boş
        </h1>
        <p className="mb-6 text-gray-500">
          Henüz sepetine ürün eklemedin.
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sepetim</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Sepeti temizle
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ürün listesi */}
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <Link
                to={`/product/${item.id}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-50"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-contain"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${item.id}`}
                    className="font-semibold text-gray-800 hover:text-indigo-600"
                  >
                    {item.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`${item.title} ürününü sepetten çıkar`}
                    className="text-gray-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  Birim fiyat: ${item.price.toFixed(2)}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label="Adedi azalt"
                      className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Adedi artır"
                      className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {item.quantity >= item.stock && (
                  <p className="text-xs text-amber-600">
                    Stok sınırına ulaştın ({item.stock} adet)
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Özet */}
      <aside className="h-fit lg:sticky lg:top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Sipariş Özeti
          </h2>

          <dl className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <dt>Ürün adedi</dt>
              <dd>{totalItems}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Kargo</dt>
              <dd className="text-green-600">Ücretsiz</dd>
            </div>
          </dl>

          <div className="my-4 border-t border-gray-200" />

          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Toplam</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          {/* Checkout Sayfasına Yönlendiren Link Butonu */}
          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
          >
            Siparişi Tamamla
          </Link>
        </aside>
      </div>
    </main>
  )
}

export default Cart