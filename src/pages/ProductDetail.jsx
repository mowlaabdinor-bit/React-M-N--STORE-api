import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../api/productService'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import FavoriteButton from '../components/FavoriteButton'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, getQuantity } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [justAdded, setJustAdded] = useState(false)

  // Temiz ve güvenli setTimeout yönetimi (Unmount korumalı)
  useEffect(() => {
    if (!justAdded) return
    const t = setTimeout(() => setJustAdded(false), 1500)
    return () => clearTimeout(t)
  }, [justAdded])

  useEffect(() => {
    const controller = new AbortController()
    async function loadDetail() {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(id, { signal: controller.signal })
        setProduct(data)
        setSelectedImage(data.thumbnail)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    loadDetail()
    return () => controller.abort()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, 1)
    setJustAdded(true)
  }

  if (loading) return <Loader text="Ürün detayları yükleniyor..." />

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="rounded-lg bg-red-50 p-4 text-red-600">Hata: {error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Geri Dön
        </button>
      </div>
    )
  }

  if (!product) return null

  const { title, description, price, rating, stock, category, thumbnail, images } = product
  const gallery = [thumbnail, ...(images || [])]
  const inCart = getQuantity(product.id)
  const reachedLimit = inCart >= stock

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        ← Geri Dön
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Görsel Alanı */}
        <div className="flex flex-col gap-4">
          <div className="flex h-96 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <img
              src={selectedImage || thumbnail}
              alt={title}
              className="h-full w-full object-contain"
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`h-20 w-20 flex-shrink-0 rounded-lg border-2 bg-white p-1 transition ${
                    selectedImage === imgUrl ? 'border-indigo-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={imgUrl} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ürün Bilgileri ve Sepet Alanı */}
        <div className="flex flex-col justify-start">
          <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            {category}
          </span>
          
          {/* Başlık ve Favori Butonu Yan Yana */}
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <FavoriteButton
              product={product}
              className="shrink-0 border border-gray-200"
            />
          </div>

          <div className="mt-3 flex items-center gap-4">
            <span className="text-3xl font-extrabold text-gray-900">${price.toFixed(2)}</span>
            <span className="rounded-md bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700">
              ★ {rating.toFixed(1)}
            </span>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-700">
              Stok Durumu: <span className={stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {stock > 0 ? `${stock} adet stokta` : 'Tükendi'}
              </span>
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock === 0 || reachedLimit}
              className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
            >
              {stock === 0
                ? 'Stokta yok'
                : reachedLimit
                  ? 'Stok sınırına ulaşıldı'
                  : justAdded
                    ? '✓ Sepete eklendi'
                    : 'Sepete Ekle'}
            </button>

            {inCart > 0 && (
              <p className="mt-3 text-sm text-gray-500">
                Sepetinde {inCart} adet var.{' '}
                <Link to="/cart" className="font-medium text-indigo-600 hover:underline">
                  Sepete git →
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetail