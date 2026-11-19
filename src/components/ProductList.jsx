import { memo } from 'react'
import ProductCard from './ProductCard'

function ProductList({ products }) {
  if (products.length === 0) {
    return <p className="py-10 text-center text-gray-500">Ürün bulunamadı.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default memo(ProductList)