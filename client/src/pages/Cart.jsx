import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiCamera,
  FiTag,
  FiCheck,
  FiShoppingBag,
  FiArrowRight,
  FiGrid,
  FiMonitor,
  FiUserCheck
} from 'react-icons/fi'
import { useCart } from '../context/CartContext.jsx'

const AISLE_METADATA = {
  'Ice Cream': { title: '🍦 Frozen Ice Cream Aisle', desc: 'Freezer Counter 03 · Cold Storage' },
  'Ice Cream Cake': { title: '🍰 Bakery & Fresh Cake Counter', desc: 'Confectionery Section · Freshly Baked' },
  'Chocolates': { title: '🍫 Sweet Confectionery Shelf', desc: 'Aisle 05 · Gourmet Chocolates' },
  'Cold Brew': { title: '☕ Express Cold Brew Bar', desc: 'Beverage Station 02 · Chilled Drinks' },
  'In-Store Item': { title: '📦 General Supermarket Items', desc: 'Scan & Go Self-Checkout Shelf' },
}

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQty,
    subtotal,
    discountAmount,
    bagOption,
    bagPrice,
    setBagOption,
    grandTotal,
    count,
    totalWeightKg,
    earnedPoints,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    openScanner,
    clearCart
  } = useCart()

  const [inputCoupon, setInputCoupon] = useState('')
  const [checkoutMode, setCheckoutMode] = useState('self') // 'self' | 'cashier'
  const navigate = useNavigate()

  // Group items by Aisle/Category
  const groupedItems = useMemo(() => {
    const map = {}
    items.forEach((item) => {
      const cat = item.category || 'In-Store Item'
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    })
    return map
  }, [items])

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (applyCoupon(inputCoupon)) {
      setInputCoupon('')
    }
  }

  const weightNum = parseFloat(totalWeightKg)
  const weightPercent = Math.min(100, Math.round((weightNum / 15) * 100))

  if (items.length === 0) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="empty-cart card">
            <div className="empty-icon">🛒</div>
            <h2>Your Lulu Mall Trolley is Empty</h2>
            <p>Scan product barcodes or pick fresh items from our hypermarket shelves!</p>
            <div className="empty-cart-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-gold" onClick={openScanner}>
                <FiCamera /> Scan Barcode Now
              </button>
              <Link to="/ice-creams" className="btn btn-primary">
                Browse Ice Cream Freezer
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="container">
        {/* Header & Mode Switcher */}
        <div className="page-header hypermarket-header">
          <div>
            <span className="section-eyebrow">Lulu Hypermarket · Bangalore Store #01</span>
            <h1>Real Mall Shopping Trolley</h1>
            <p>Smart Self-Checkout Aisle View · {count} item{count > 1 ? 's' : ''} in trolley</p>
          </div>

          <div className="checkout-mode-switch">
            <button
              className={`mode-tab ${checkoutMode === 'self' ? 'active' : ''}`}
              onClick={() => setCheckoutMode('self')}
            >
              <FiMonitor /> Express Self-Kiosk
            </button>
            <button
              className={`mode-tab ${checkoutMode === 'cashier' ? 'active' : ''}`}
              onClick={() => setCheckoutMode('cashier')}
            >
              <FiUserCheck /> Cashier Counter
            </button>
          </div>
        </div>

        {/* Trolley Capacity Gauge */}
        <div className="hypermarket-trolley-gauge card">
          <div className="gauge-info-left">
            <div className="gauge-icon-large">🛒</div>
            <div>
              <h4>Supermarket Trolley Capacity</h4>
              <p>Current weight limit status: <strong>{totalWeightKg} kg</strong> / 15 kg max capacity</p>
            </div>
          </div>
          <div className="gauge-visual">
            <div className="gauge-percentage-label">{weightPercent}% Full</div>
            <div className="gauge-track">
              <div
                className={`gauge-fill ${weightPercent > 85 ? 'warning' : ''}`}
                style={{ width: `${weightPercent}%` }}
              />
            </div>
          </div>
          <div className="gauge-actions">
            <button className="btn btn-secondary btn-sm" onClick={openScanner}>
              <FiCamera /> Scan Barcode
            </button>
          </div>
        </div>

        <div className="cart-layout">
          {/* Left Column: Grouped Trolley Items */}
          <div className="cart-items-column">
            {Object.entries(groupedItems).map(([category, catItems]) => {
              const meta = AISLE_METADATA[category] || {
                title: `📦 ${category} Aisle`,
                desc: 'Department Store Section',
              }

              return (
                <div className="aisle-section card" key={category}>
                  <div className="aisle-header">
                    <div>
                      <h3>{meta.title}</h3>
                      <p>{meta.desc}</p>
                    </div>
                    <span className="aisle-badge">{catItems.reduce((acc, i) => acc + i.qty, 0)} items</span>
                  </div>

                  <div className="aisle-items-list">
                    {catItems.map((item) => (
                      <div className="cart-item hypermarket-item" key={item._id ?? `${item.name}-${item.price}`}>
                        <img src={item.image} alt={item.name} />
                        <div className="cart-item-info">
                          <span className="item-sku-tag">SKU-{item._id ? item._id.slice(-6).toUpperCase() : 'LULU'}</span>
                          <h4>{item.name}</h4>
                          <span className="item-unit-rate">₹{item.price} per pack / scoop</span>

                          <div className="qty-control">
                            <button
                              onClick={() => updateQty(item._id, item.qty - 1)}
                              aria-label="Decrease"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="qty-val">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item._id, item.qty + 1)}
                              aria-label="Increase"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-price">
                          <strong>₹{item.price * item.qty}</strong>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item._id)}
                            title="Remove from trolley"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Shopping Bag Selection Box */}
            <div className="eco-bag-section card">
              <div className="eco-bag-header">
                <FiShoppingBag className="eco-icon" />
                <div>
                  <h3>Eco-Friendly Carry Bag Options</h3>
                  <p>Save green! Pick a reusable packaging option for your order.</p>
                </div>
              </div>

              <div className="bag-options-grid">
                <label className={`bag-card ${bagOption === 'none' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="bagOption"
                    value="none"
                    checked={bagOption === 'none'}
                    onChange={() => setBagOption('none')}
                  />
                  <div className="bag-details">
                    <span className="bag-title">No Bag Carry Out</span>
                    <span className="bag-desc">Bring your own bag / carry items directly</span>
                  </div>
                  <span className="bag-price-tag free">FREE</span>
                </label>

                <label className={`bag-card ${bagOption === 'eco' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="bagOption"
                    value="eco"
                    checked={bagOption === 'eco'}
                    onChange={() => setBagOption('eco')}
                  />
                  <div className="bag-details">
                    <span className="bag-title">Eco Carry Bag</span>
                    <span className="bag-desc">100% Recyclable biodegradable paper bag</span>
                  </div>
                  <span className="bag-price-tag">+₹10</span>
                </label>

                <label className={`bag-card ${bagOption === 'jute' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="bagOption"
                    value="jute"
                    checked={bagOption === 'jute'}
                    onChange={() => setBagOption('jute')}
                  />
                  <div className="bag-details">
                    <span className="bag-title">Reusable Lulu Jute Tote</span>
                    <span className="bag-desc">Premium washable heavy-duty jute bag</span>
                  </div>
                  <span className="bag-price-tag">+₹25</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary & Loyalty */}
          <div className="cart-summary-column">
            {/* Lulu Club Points Rewards Badge */}
            <div className="lulu-club-card card">
              <div className="club-badge-header">
                <span className="club-logo">👑</span>
                <div>
                  <h4>Lulu Club Membership Rewards</h4>
                  <p>In-Store Loyalty Program</p>
                </div>
              </div>
              <div className="club-points-box">
                <div className="points-amount">+{earnedPoints} PTS</div>
                <div className="points-note">Earn 1 Lulu point per ₹10 spent on this purchase.</div>
              </div>
            </div>

            {/* Coupons Section */}
            <div className="cart-coupon-box card">
              <h4><FiTag /> Mall Offers & Promo Coupons</h4>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="coupon-form-page">
                  <div className="coupon-field-wrap">
                    <input
                      type="text"
                      placeholder="Enter promo code..."
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                    />
                    <button type="submit" className="btn btn-gold btn-sm">Apply</button>
                  </div>
                  {couponError && <p className="coupon-err">{couponError}</p>}

                  <div className="available-vouchers">
                    <small>Tap coupon to auto-apply:</small>
                    <div className="voucher-chips">
                      <button type="button" onClick={() => applyCoupon('LULU10')}>LULU10 (10% Off)</button>
                      <button type="button" onClick={() => applyCoupon('SUPERMALL')}>SUPERMALL (₹150 Off)</button>
                      <button type="button" onClick={() => applyCoupon('FREEDEL')}>FREEDEL (₹50 Off)</button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="active-coupon-pill">
                  <div>
                    <strong><FiCheck /> {appliedCoupon.code} Applied</strong>
                    <small>{appliedCoupon.label}</small>
                  </div>
                  <button className="remove-coupon-link" onClick={removeCoupon}>Remove</button>
                </div>
              )}
            </div>

            {/* Final Bill Breakdown Summary */}
            <div className="cart-summary hypermarket-summary card">
              <h3>Hypermarket Bill Summary</h3>
              <div className="summary-row">
                <span>Items Subtotal ({count})</span>
                <span>₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {bagPrice > 0 && (
                <div className="summary-row">
                  <span>Eco Carry Bag</span>
                  <span>+₹{bagPrice}</span>
                </div>
              )}

              <div className="summary-row">
                <span>GST Tax (Included)</span>
                <span>₹0</span>
              </div>

              <div className="summary-row total">
                <span>Total Amount Payable</span>
                <span className="grand-price">₹{grandTotal}</span>
              </div>

              <div className="summary-mode-notice">
                {checkoutMode === 'self' ? '⚡ Mode: Express Self-Checkout Kiosk' : '🛒 Mode: Staff Billing Counter'}
              </div>

              <button
                className="btn btn-primary checkout-btn full-width"
                onClick={() => navigate('/bill')}
              >
                Proceed to Payment Counter <FiArrowRight />
              </button>

              <button className="btn-clear-cart" onClick={clearCart}>
                Clear Entire Trolley
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
