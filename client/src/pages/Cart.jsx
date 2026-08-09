import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal, grandTotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-icon"><FiShoppingCart /></div>
            <h2>Your cart is empty</h2>
            <p>Add ice creams or cakes from the counter to build your bill.</p>
            <Link to="/ice-creams" className="btn btn-primary">Browse Ice Creams</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">In-Store Cart</span>
          <h1>Your Cart</h1>
          <p>{items.length} item{items.length > 1 ? 's' : ''} — head to billing when ready.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item._id ?? `${item.name}-${item.price}`}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <span>{item.category}{item.serves ? ` · ${item.serves}` : ''}</span>
                  <h4>{item.name}</h4>
                  <div className="qty-control">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} aria-label="Decrease"><FiMinus size={12} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} aria-label="Increase"><FiPlus size={12} /></button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <strong>₹{item.price * item.qty}</strong>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Bill Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="summary-row total"><span>Total Payable</span><span>₹{grandTotal}</span></div>
            <p className="estimate-note">*Prices are typical mart estimates, not confirmed shelf prices.</p>
            <button className="btn btn-primary checkout-btn" onClick={() => navigate('/bill')}>
              Proceed to Pay Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
