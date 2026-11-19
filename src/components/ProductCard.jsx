import { memo } from 'react'
import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'

function ProductCard({ product }) {
  const { id, title, thumbnail, price, rating, category } = product

  return (
    <div className="relative h-full">
      <Link to={`/product/${id}`} className="block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
          <div className="flex h-48 items-center justify-center bg-gray-50">
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {category}
            </span>
            <h3 className="line-clamp-2 font-semibold text-gray-800">
              {title}
            </h3>

            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              <span className="text-sm text-amber-500">
                ★ {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </article>
      </Link>

      <FavoriteButton product={product} className="absolute right-3 top-3" />
    </div>
  )
}

export default memo(ProductCard)