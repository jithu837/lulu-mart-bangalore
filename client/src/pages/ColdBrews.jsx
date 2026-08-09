import { useState, useEffect } from 'react'
import { api } from '../api.js'
import ProductCard from '../components/ProductCard/ProductCard.jsx'

export default function ColdBrews() {
  const [coldBrews, setColdBrews] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    api.getProducts({ category: 'Cold Brew' })
      .then((data) => { setColdBrews(data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Ibaco Cold Brews</span>
          <h1>Cold Brews</h1>
          <p>{status === 'ready' ? `${coldBrews.length} chilled brews` : ''} — prices are typical mart estimates.</p>
        </div>

        {status === 'loading' && <div className="empty-state card"><p>Loading cold brews…</p></div>}
        {status === 'error' && <div className="empty-state card"><p>Couldn't reach the server. Is the API running?</p></div>}
        {status === 'ready' && (
          <div className="grid grid-4 listing-page">
            {coldBrews.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
