import { Link } from 'react-router-dom'
import ProductList from '../components/ProductList'
import { useFavorites } from '../context/FavoritesContext'

function Favorites() {
  const { items, count } = useFavorites()

  if (count === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl text-red-400">♡</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Henüz favorin yok
        </h1>
        <p className="mb-6 text-gray-500">
          Beğendiğin ürünlerdeki kalbe dokunarak buraya ekleyebilirsin.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Ürünlere göz at
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Favorilerim <span className="text-lg text-gray-400">({count})</span>
      </h1>
      <ProductList products={items} />
    </main>
  )
}

export default Favorites