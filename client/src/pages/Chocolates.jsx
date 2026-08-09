import { useState, useMemo, useEffect } from 'react'
import { api } from '../api.js'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import SearchBar from '../components/Search/SearchBar.jsx'

export default function Chocolates() {
  const [query, setQuery] = useState('')
  const [chocolates, setChocolates] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api.getProducts({ category: 'Chocolate' })
      .then((data) => { setChocolates(data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  const filtered = useMemo(() => {
    if (!query) return chocolates
    const q = query.toLowerCase()
    return chocolates.filter((p) => p.name.toLowerCase().includes(q) || (p.group || '').toLowerCase().includes(q))
  }, [query, chocolates])

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Ibaco Chocolates</span>
          <h1>Gifting Chocolates</h1>
          <p>{status === 'ready' ? `${filtered.length} of ${chocolates.length} pieces` : ''} — prices are typical mart estimates.</p>
        </div>

        <div className="listing-search">
          <SearchBar value={query} onChange={setQuery} placeholder="Search chocolates, e.g. almond, ganache…" />
        </div>

        {status === 'loading' && <div className="empty-state card"><p>Loading chocolates…</p></div>}
        {status === 'error' && <div className="empty-state card"><p>Couldn't reach the server. Is the API running?</p></div>}
        {status === 'ready' && filtered.length === 0 && (
          <div className="empty-state card"><p>No chocolates match that search. Try a different word.</p></div>
        )}
        {status === 'ready' && filtered.length > 0 && (
          <div className="grid grid-4 listing-page">
            {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
