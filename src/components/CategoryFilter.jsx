function CategoryFilter({ categories, selected, onSelect }) {
  const base =
    'whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition'
  const active = 'border-indigo-600 bg-indigo-600 text-white'
  const passive =
    'border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600'

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`${base} ${selected === '' ? active : passive}`}
      >
        Tümü
      </button>

      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => onSelect(cat.slug)}
          className={`${base} ${selected === cat.slug ? active : passive}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter