import { useState } from 'react'
import { Search, Sparkles, ArrowRight } from 'lucide-react'

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')

  const examples = [
    { label: 'rs121434568', value: 'rs121434568' },
    { label: 'chr7:g.55241707G>T', value: 'chr7:g.55241707G>T' },
    { label: 'NM_000546.5:c.743G>A', value: 'NM_000546.5:c.743G>A' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleExampleClick = (value) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入 HGVS 标识符或 rs 号 (例如: chr7:g.55241707G>T)"
            className="input-field pl-12 pr-32 py-4 text-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>查询</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Example Queries */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <span className="text-gray-500 text-sm flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          试试这些:
        </span>
        {examples.map((example) => (
          <button
            key={example.value}
            onClick={() => handleExampleClick(example.value)}
            disabled={loading}
            className="px-4 py-1.5 bg-lab-light hover:bg-lab-medium border border-lab-light hover:border-primary-500/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
