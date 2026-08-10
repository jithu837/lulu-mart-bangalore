import { FiHeart, FiEye, FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi'
import { useState } from 'react'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { items, addToCart, updateQty } = useCart()
  const [quickView, setQuickView] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const wished = isWishlisted(product._id)
  const cartItem = items.find((i) => i._id === product._id)

  return (
    <>
      <div className={`product-card card ${cartItem ? 'in-trolley-card' : ''}`}>
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
          {cartItem && <span className="badge badge-trolley-active">In Trolley 🛒 ({cartItem.qty})</span>}
          <button
            className={`product-fav ${wished ? 'active' : ''}`}
            aria-label="Toggle wishlist"
            onClick={() => toggleWishlist(product)}
          >
            <FiHeart />
          </button>
          <button className="product-quick" onClick={() => setQuickView(true)}>
            <FiEye /> Details
          </button>
        </div>

        <div className="product-body">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">₹{product.price}<sup>*</sup></span>

            {cartItem ? (
              <div className="product-card-qty">
                <button
                  className="card-qty-btn"
                  onClick={() => updateQty(product._id, cartItem.qty - 1)}
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={12} />
                </button>
                <span className="card-qty-num">{cartItem.qty}</span>
                <button
                  className="card-qty-btn"
                  onClick={() => updateQty(product._id, cartItem.qty + 1)}
                  aria-label="Increase quantity"
                >
                  <FiPlus size={12} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm add-trolley-btn" onClick={() => addToCart(product)}>
                <FiShoppingCart /> Add 🛒
              </button>
            )}
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
                {cartItem ? (
                  <div className="product-card-qty large">
                    <button
                      className="card-qty-btn"
                      onClick={() => updateQty(product._id, cartItem.qty - 1)}
                    >
                      <FiMinus />
                    </button>
                    <span className="card-qty-num">{cartItem.qty} in Trolley</span>
                    <button
                      className="card-qty-btn"
                      onClick={() => updateQty(product._id, cartItem.qty + 1)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={() => { addToCart(product); setQuickView(false); }}>
                    <FiShoppingCart /> Add to Trolley 🛒
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


