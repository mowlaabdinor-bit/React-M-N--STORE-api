import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getCategories,
  getProducts,
  getProductsByCategory,
} from '../api/productService'
import CategoryFilter from '../components/CategoryFilter'
import Loader from '../components/Loader'
import ProductList from '../components/ProductList'
import SearchBar from '../components/SearchBar'
import SortSelect, { SORT_OPTIONS } from '../components/SortSelect'

// Sıralama anahtarı -> karşılaştırma fonksiyonu
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

  // URL'e elle yazılan geçersiz değerler "Önerilen"e düşer
  const rawSort = searchParams.get('sort') ?? ''
  const sort = VALID_SORTS.includes(rawSort) ? rawSort : ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const updateParam = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value) next.set(key, value)
          else next.delete(key)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const handleSearch = useCallback(
    (value) => updateParam('q', value),
    [updateParam],
  )
  const handleCategory = useCallback(
    (slug) => updateParam('category', slug),
    [updateParam],
  )
  const handleSort = useCallback(
    (value) => updateParam('sort', value),
    [updateParam],
  )

  useEffect(() => {
    const controller = new AbortController()

    getCategories({ signal: controller.signal })
      .then(setCategories)
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Kategoriler yüklenemedi:', err)
        }
      })

    return () => controller.abort()
  }, [])

  // 1. halka: kategori (API'den gelir, sadece kategori değişince çekilir)
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

  // 2. halka: arama (products veya searchTerm değişince)
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

  // 3. halka: sıralama (filtre sonucu veya sort değişince)
  // sort() diziyi yerinde değiştirir, bu yüzden önce kopyalıyoruz
  const visibleProducts = useMemo(() => {
    const compare = COMPARATORS[sort]
    if (!compare) return filteredProducts
    return [...filteredProducts].sort(compare)
  }, [filteredProducts, sort])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Ürünler</h1>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:flex-1">
            <SearchBar value={searchTerm} onChange={handleSearch} />
          </div>
          <div className="sm:w-72">
            <SortSelect value={sort} onChange={handleSort} />
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategory}
        />
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