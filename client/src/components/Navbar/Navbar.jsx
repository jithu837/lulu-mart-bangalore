import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/ice-creams', label: 'Ice Creams' },
  { to: '/ice-cream-cakes', label: 'Cakes' },
  { to: '/chocolates', label: 'Chocolates' },
  { to: '/cold-brews', label: 'Cold Brews' },
  { to: '/about', label: 'About' },
  { to: '/orders', label: 'Bills' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { items: wishItems } = useWishlist()
  const { count } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/ice-creams?q=${encodeURIComponent(query)}`)
    setSearchOpen(false)
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-mark">L</span>
          <span className="navbar-logo-text">
            Lulu Mart Bangalore
            <small>Ice Cream Counter · In-Store</small>
          </span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="navbar-mobile-actions">
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist ({wishItems.length})</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({count})</Link>
          </div>
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>
            <FiSearch />
          </button>
          <Link className="icon-btn" aria-label="Wishlist" to="/wishlist">
            <FiHeart />
            {wishItems.length > 0 && <span className="icon-badge">{wishItems.length}</span>}
          </Link>
          <Link className="icon-btn" aria-label="Cart" to="/cart">
            <FiShoppingCart />
            {count > 0 && <span className="icon-badge">{count}</span>}
          </Link>
          <button className="icon-btn menu-toggle" aria-label="Menu" onClick={() => setMenuOpen((m) => !m)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form className="navbar-search" onSubmit={submitSearch}>
          <div className="container navbar-search-inner">
            <FiSearch />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flavours…"
            />
            <button type="submit" className="btn btn-gold btn-sm">Search</button>
          </div>
        </form>
      )}
      <div className="stripe-divider" />
    </header>
  )
}
