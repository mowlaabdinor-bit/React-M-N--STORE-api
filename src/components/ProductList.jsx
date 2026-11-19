import ProductCard from './ProductCard'

function ProductList({ products }) {
  if (products.length === 0) {
    return <p className="py-10 text-center text-gray-500">Ürün bulunamadı.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList