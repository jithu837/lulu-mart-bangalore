import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api.js'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import SearchBar from '../components/Search/SearchBar.jsx'

export default function IceCreams() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [iceCreams, setIceCreams] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    api.getProducts({ category: 'Ice Cream' })
      .then((data) => { setIceCreams(data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  const filtered = useMemo(() => {
    if (!query) return iceCreams
    const q = query.toLowerCase()
    return iceCreams.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }, [query, iceCreams])

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Ibaco Ice Creams</span>
          <h1>Signature Flavours</h1>
          <p>{status === 'ready' ? `${filtered.length} of ${iceCreams.length} flavours` : ''} — prices are typical mart estimates.</p>
        </div>

        <div className="listing-search">
          <SearchBar value={query} onChange={setQuery} placeholder="Search flavours, e.g. mango, chocolate…" />
        </div>

        {status === 'loading' && <div className="empty-state card"><p>Loading flavours…</p></div>}
        {status === 'error' && <div className="empty-state card"><p>Couldn't reach the server. Is the API running?</p></div>}
        {status === 'ready' && filtered.length === 0 && (
          <div className="empty-state card"><p>No flavours match that search. Try a different word.</p></div>
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
