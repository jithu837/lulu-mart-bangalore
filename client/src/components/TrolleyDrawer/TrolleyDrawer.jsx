import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiX, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiTag, FiCheck, FiCamera, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../../context/CartContext.jsx'
import './TrolleyDrawer.css'

export default function TrolleyDrawer() {
  const {
    items,
    isTrolleyOpen,
    closeTrolley,
    removeFromCart,
    updateQty,
    subtotal,
    discountAmount,
    bagPrice,
    grandTotal,
    count,
    totalWeightKg,
    earnedPoints,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    openScanner,
  } = useCart()

  const [inputCoupon, setInputCoupon] = useState('')
  const navigate = useNavigate()

  if (!isTrolleyOpen) return null

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (applyCoupon(inputCoupon)) {
      setInputCoupon('')
    }
  }

  const handleCheckout = () => {
    closeTrolley()
    navigate('/bill')
  }

  const handleViewCart = () => {
    closeTrolley()
    navigate('/cart')
  }

  const weightNum = parseFloat(totalWeightKg)
  const weightPercent = Math.min(100, Math.round((weightNum / 15) * 100))

  return (
    <div className="trolley-overlay" onClick={closeTrolley}>
      <div className="trolley-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="trolley-header">
          <div className="trolley-title">
            <div className="trolley-icon-badge">
              🛒
              <span className="trolley-count-bubble">{count}</span>
            </div>
            <div>
              <h3>Lulu Mall Trolley</h3>
              <p className="trolley-subtitle">In-Store Shopping Cart · Counter 01</p>
            </div>
          </div>
          <button className="trolley-close-btn" onClick={closeTrolley} aria-label="Close Trolley">
            <FiX size={20} />
          </button>
        </div>

        {/* Capacity & Weight Gauge */}
        <div className="trolley-gauge-card">
          <div className="gauge-header">
            <span>Trolley Load ({totalWeightKg} kg / 15 kg max)</span>
            <span className={`gauge-status ${weightPercent > 80 ? 'heavy' : ''}`}>
              {weightPercent > 80 ? 'Heavy Load ⚠️' : 'Normal Load'}
            </span>
          </div>
          <div className="gauge-bar-bg">
            <div
              className={`gauge-bar-fill ${weightPercent > 80 ? 'warning' : ''}`}
              style={{ width: `${weightPercent}%` }}
            />
          </div>
          <div className="gauge-points">
            ✨ Earn <strong>+{earnedPoints} Lulu Club Points</strong> on checkout
          </div>
        </div>

        {/* Action shortcut bar */}
        <div className="trolley-quick-actions">
          <button className="scan-shortcut-btn" onClick={() => { closeTrolley(); openScanner() }}>
            <FiCamera /> Scan Item Barcode
          </button>
        </div>

        {/* Trolley Items List */}
        <div className="trolley-items-wrap">
          {items.length === 0 ? (
            <div className="trolley-empty">
              <div className="trolley-empty-icon">🛒</div>
              <h4>Your Trolley is empty</h4>
              <p>Scan product barcodes or pick items from frozen freezer & bakery sections!</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  closeTrolley()
                  navigate('/ice-creams')
                }}
              >
                Explore Ice Creams
              </button>
            </div>
          ) : (
            <div className="trolley-items-list">
              {items.map((item) => (
                <div className="trolley-item" key={item._id ?? `${item.name}-${item.price}`}>
                  <img src={item.image} alt={item.name} className="trolley-item-img" />
                  <div className="trolley-item-details">
                    <span className="trolley-category-tag">{item.category}</span>
                    <h4 className="trolley-item-name">{item.name}</h4>
                    <span className="trolley-unit-price">₹{item.price} / unit</span>

                    <div className="trolley-qty-controls">
                      <button
                        onClick={() => updateQty(item._id, item.qty - 1)}
                        aria-label="Decrease"
                        className="trolley-qty-btn"
                      >
                        <FiMinus size={11} />
                      </button>
                      <span className="trolley-qty-val">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        aria-label="Increase"
                        className="trolley-qty-btn"
                      >
                        <FiPlus size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="trolley-item-right">
                    <strong className="trolley-item-total">₹{item.price * item.qty}</strong>
                    <button
                      className="trolley-delete-btn"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {items.length > 0 && (
          <div className="trolley-footer">
            {/* Coupon Code Section */}
            {!appliedCoupon ? (
              <form className="trolley-coupon-form" onSubmit={handleApplyCoupon}>
                <div className="coupon-input-wrap">
                  <FiTag className="coupon-icon" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. LULU10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                  />
                  <button type="submit" className="coupon-apply-btn">Apply</button>
                </div>
                {couponError && <p className="coupon-error-msg">{couponError}</p>}
                <p className="coupon-hint-msg">Try code <strong>LULU10</strong> for 10% off!</p>
              </form>
            ) : (
              <div className="applied-coupon-badge">
                <span className="badge-text"><FiCheck /> Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                <span className="badge-savings">-₹{discountAmount}</span>
                <button className="remove-coupon-btn" onClick={removeCoupon}>Remove</button>
              </div>
            )}

            {/* Bill Summary Lines */}
            <div className="trolley-summary">
              <div className="summary-row">
                <span>Subtotal ({count} items)</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Mall Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              {bagPrice > 0 && (
                <div className="summary-row"><span>Shopping Bag</span><span>+₹{bagPrice}</span></div>
              )}
              <div className="summary-row total-row">
                <span>Total Payable</span>
                <span className="grand-val">₹{grandTotal}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="trolley-actions">
              <button className="btn btn-secondary full-cart-btn" onClick={handleViewCart}>
                Full Aisle View
              </button>
              <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                Proceed to Pay <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
