function CategoryFilter({ categories, selected, onSelect }) {
  const base =
    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium capitalize transition'
  const active = 'bg-brand-orange text-white'
  const passive = 'text-gray-700 hover:bg-gray-100'

  return (
    <ul className="space-y-1">
      <li>
        <button
          type="button"
          onClick={() => onSelect('')}
          aria-current={selected === '' ? 'true' : undefined}
          className={`${base} ${selected === '' ? active : passive}`}
        >
          Tümü
        </button>
      </li>

      {categories.map((cat) => (
        <li key={cat.slug}>
          <button
            type="button"
            onClick={() => onSelect(cat.slug)}
            aria-current={selected === cat.slug ? 'true' : undefined}
            className={`${base} ${selected === cat.slug ? active : passive}`}
          >
            {cat.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default CategoryFilter