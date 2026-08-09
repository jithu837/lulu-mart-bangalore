import { useState, useMemo, useEffect } from 'react'
import { api } from '../api.js'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import SearchBar from '../components/Search/SearchBar.jsx'

export default function Cakes() {
  const [query, setQuery] = useState('')
  const [cakes, setCakes] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api.getProducts({ category: 'Ice Cream Cake' })
      .then((data) => { setCakes(data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  const filtered = useMemo(() => {
    if (!query) return cakes
    const q = query.toLowerCase()
    return cakes.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }, [query, cakes])

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Ibaco Ice Cream Cakes</span>
          <h1>Celebration Cakes</h1>
          <p>{status === 'ready' ? `${filtered.length} of ${cakes.length} cakes` : ''} — prices are typical mart estimates.</p>
        </div>

        <div className="listing-search">
          <SearchBar value={query} onChange={setQuery} placeholder="Search cakes, e.g. chocolate, mango…" />
        </div>

        {status === 'loading' && <div className="empty-state card"><p>Loading cakes…</p></div>}
        {status === 'error' && <div className="empty-state card"><p>Couldn't reach the server. Is the API running?</p></div>}
        {status === 'ready' && filtered.length === 0 && (
          <div className="empty-state card"><p>No cakes match that search. Try a different word.</p></div>
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
