function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ürün ara..."
        aria-label="Ürün ara"
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-gray-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Aramayı temizle"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar