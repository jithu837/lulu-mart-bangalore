import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { addToCart } = useCart()
  const [quickView, setQuickView] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const wished = isWishlisted(product._id)

  return (
    <>
      <div className="product-card card">
        <div className={`product-media ${!imgLoaded && !imgError ? 'is-loading' : ''}`}>
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
              className={`product-img ${imgLoaded ? 'loaded' : ''}`}
            />
          ) : (
            <div className="img-fallback">🍦</div>
          )}
          {product.serves && <span className="badge badge-gold product-serves">{product.serves}</span>}
          <button
            className={`product-fav ${wished ? 'active' : ''}`}
            aria-label="Toggle wishlist"
            onClick={() => toggleWishlist(product)}
          >
            <FiHeart />
          </button>
          <button className="product-quick" onClick={() => setQuickView(true)}>
            <FiEye /> View Details
          </button>
        </div>

        <div className="product-body">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">₹{product.price}<sup>*</sup></span>
            <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
              <FiShoppingCart /> Add
            </button>
          </div>
        </div>
      </div>

      {quickView && (
        <div className="quickview-overlay" onClick={() => setQuickView(false)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
            {!imgError ? (
              <img src={product.image} alt={product.name} decoding="async" />
            ) : (
              <div className="img-fallback large">🍦</div>
            )}
            <div className="quickview-body">
              <span className="product-category-tag">{product.category}{product.serves ? ` · ${product.serves}` : ''}</span>
              <h3>{product.name}</h3>
              <p className="quickview-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{product.price}<sup>*</sup></span>
                <button className="btn btn-primary" onClick={() => { addToCart(product); setQuickView(false) }}>
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

