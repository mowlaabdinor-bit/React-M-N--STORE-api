const BASE_URL = 'https://dummyjson.com'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options)

  if (!res.ok) {
    throw new Error(`İstek başarısız oldu (HTTP ${res.status})`)
  }

  return res.json()
}

// GET /products?limit=&skip=
export async function getProducts({ limit = 30, skip = 0, signal } = {}) {
  return request(`/products?limit=${limit}&skip=${skip}`, { signal })
}

// GET /products/{id}
export async function getProductById(id, { signal } = {}) {
  return request(`/products/${id}`, { signal })
}

// GET /products/categories
// Yeni DummyJSON sürümü { slug, name, url } nesneleri döndürür,
// eski sürüm düz string döndürür. İkisini de aynı şekle çeviriyoruz.
export async function getCategories({ signal } = {}) {
  const data = await request('/products/categories', { signal })

  return data.map((item) =>
    typeof item === 'string'
      ? { slug: item, name: item.replace(/-/g, ' ') }
      : { slug: item.slug, name: item.name },
  )
}

// GET /products/category/{slug}
export async function getProductsByCategory(
  slug,
  { limit = 100, signal } = {},
) {
  return request(
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}`,
    { signal },
  )
}