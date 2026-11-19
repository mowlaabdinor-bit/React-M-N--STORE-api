import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getProductsByCategory } from '../api/productService'
import Loader from '../components/Loader'
import ProductList from '../components/ProductList'
import { SORT_OPTIONS } from '../components/SortSelect'

const COMPARATORS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'rating-desc': (a, b) => b.rating - a.rating,
  'rating-asc': (a, b) => a.rating - b.rating,
}

const VALID_SORTS = SORT_OPTIONS.map((o) => o.value)

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') ?? ''
  const searchTerm = searchParams.get('q') ?? ''

  const rawSort = searchParams.get('sort') ?? ''
  const sort = VALID_SORTS.includes(rawSort) ? rawSort : ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Kategori değişince ürünleri çek
  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)

        const data = selectedCategory
          ? await getProductsByCategory(selectedCategory, {
              signal: controller.signal,
            })
          : await getProducts({ limit: 100, signal: controller.signal })

        setProducts(data.products)
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

    loadProducts()
    return () => controller.abort()
  }, [selectedCategory])

  // Arama
  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return products

    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query)),
    )
  }, [products, searchTerm])

  // Sıralama
  const visibleProducts = useMemo(() => {
    const compare = COMPARATORS[sort]
    if (!compare) return filteredProducts
    return [...filteredProducts].sort(compare)
  }, [filteredProducts, sort])

  const clearCategory = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('category')
        return next
      },
      { replace: true },
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">
          Ürünler
        </h1>

        {selectedCategory && (
          <button
            type="button"
            onClick={clearCategory}
            aria-label="Kategori filtresini kaldır"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-sm font-medium capitalize text-brand-orange transition hover:bg-brand-orange/20"
          >
            {selectedCategory.replace(/-/g, ' ')}
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {loading && <Loader />}

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-600">
          Bir hata oluştu: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {visibleProducts.length} ürün listeleniyor
          </p>
          <ProductList products={visibleProducts} />
        </>
      )}
    </main>
  )
}

export default Home