export const SORT_OPTIONS = [
  { value: '', label: 'Önerilen' },
  { value: 'price-asc', label: 'Fiyat: Düşükten yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten düşüğe' },
  { value: 'rating-desc', label: 'Puan: Yüksekten düşüğe' },
  { value: 'rating-asc', label: 'Puan: Düşükten yükseğe' },
]

function SortSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="shrink-0 text-sm text-gray-600">
        Sırala:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortSelect