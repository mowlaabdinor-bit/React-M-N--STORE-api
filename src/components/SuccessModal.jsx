import { useEffect } from 'react'

function SuccessModal({ order, onClose }) {
  // Escape tuşuyla kapat
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
    >
      {/* max-h-[90vh] overflow-y-auto buraya eklendi */}
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>

        <h2
          id="order-success-title"
          className="mb-2 text-2xl font-bold text-gray-900"
        >
          Siparişin alındı!
        </h2>
        <p className="mb-6 text-gray-600">
          Teşekkürler {order.customer.fullName.split(' ')[0]}. Sipariş
          bilgileri <strong>{order.customer.email}</strong> adresine
          gönderilecek.
        </p>

        <dl className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Sipariş no</dt>
            <dd className="font-mono font-semibold text-gray-800">
              {order.id}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Ürün adedi</dt>
            <dd className="font-semibold text-gray-800">{order.itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Toplam</dt>
            <dd className="font-semibold text-gray-800">
              ${order.total.toFixed(2)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Alışverişe devam et
        </button>
      </div>
    </div>
  )
}

export default SuccessModal