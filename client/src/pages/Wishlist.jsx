import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">Saved for Later</span>
          <h1>Your Wishlist</h1>
          <p>{items.length} {items.length === 1 ? 'treat' : 'treats'} saved.</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon"><FiHeart /></div>
            <h2>Your wishlist is empty</h2>
            <p>Tap the heart on any treat to save it here for later.</p>
            <Link to="/ice-creams" className="btn btn-primary">Browse Ice Creams</Link>
          </div>
        ) : (
          <div className="grid grid-4 wishlist-grid">
            {items.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
