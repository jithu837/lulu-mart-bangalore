import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { FiCheckCircle, FiSmartphone, FiDollarSign, FiCreditCard } from 'react-icons/fi'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../api.js'

// Merchant UPI details for the billing QR code.
const UPI_ID = '7816096147@naviaxis'
const PAYEE_NAME = 'JITHENDRA KUMAR'

function buildUpiLink(amount) {
  const params = [
    `pa=${encodeURIComponent(UPI_ID)}`,
    `pn=${encodeURIComponent(PAYEE_NAME)}`,
    `am=${amount}`,
    'cu=INR',
    `tn=${encodeURIComponent('Lulu Mart Bangalore Bill')}`,
  ].join('&')
  return `upi://pay?${params}`
}

export default function Bill() {
  const { items, subtotal, discountAmount, bagPrice, grandTotal, earnedPoints, appliedCoupon, clearCart } = useCart()
  const [method, setMethod] = useState(null) // null | 'upi' | 'cash'
  const [paid, setPaid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [receiptData, setReceiptData] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [orderStatus, setOrderStatus] = useState('idle') // idle | creating | ready | error
  const [orderError, setOrderError] = useState('')
  const [payError, setPayError] = useState('')
  const [rzpLoading, setRzpLoading] = useState(false)
  const didCreateOrder = useRef(false)

  const createPendingOrder = async () => {
    if (items.length === 0) return

    setOrderStatus('creating')
    setOrderError('')

    try {
      const order = await api.createOrder({
        items: items.map((i) => ({ product: i._id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
        subtotal,
        discountAmount,
        bagPrice,
        grandTotal,
        earnedPoints,
        couponCode: appliedCoupon?.code || null,
      })

      setOrderId(order._id)
      setOrderStatus('ready')
      setOrderError('')
    } catch (err) {
      setOrderStatus('error')
      setOrderError(err.message || 'Could not reach the server to record this order.')
    }
  }

  // Create a pending order in MongoDB as soon as the bill screen loads
  useEffect(() => {
    if (didCreateOrder.current) return
    if (items.length === 0) return

    didCreateOrder.current = true
    createPendingOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmPaid = async (paymentMethod) => {
    setPayError('')
    const receipt = {
      items,
      subtotal,
      discountAmount,
      bagPrice,
      grandTotal,
      earnedPoints,
      couponCode: appliedCoupon?.code,
      paymentMethod,
      orderId,
    }

    try {
      if (orderId) {
        await api.payOrder(orderId, paymentMethod)
      }
      setReceiptData(receipt)
      setPaymentMethod(paymentMethod)
      setPaid(true)
      clearCart()
    } catch (err) {
      setPayError(err.message || 'Could not confirm payment. Please try again.')
    }
  }

  const payWithRazorpay = async () => {
    setPayError('')
    if (!orderId) {
      setPayError('Order is still being recorded. Please wait a moment and try again.')
      return
    }
    if (typeof window.Razorpay === 'undefined') {
      setPayError('Payment gateway failed to load. Check your connection and try again.')
      return
    }

    setRzpLoading(true)
    try {
      const rpOrder = await api.createRazorpayOrder(orderId)

      const rzp = new window.Razorpay({
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        order_id: rpOrder.razorpayOrderId,
        name: 'Lulu Mart Bangalore',
        description: 'Bill payment',
        theme: { color: '#7A1F2B' },
        handler: async (response) => {
          try {
            const updatedOrder = await api.verifyRazorpayPayment(orderId, response)
            setReceiptData({
              items,
              subtotal,
              discountAmount,
              bagPrice,
              grandTotal,
              earnedPoints,
              couponCode: appliedCoupon?.code,
              paymentMethod: 'razorpay',
              orderId: updatedOrder._id,
            })
            setPaymentMethod('razorpay')
            setPaid(true)
            clearCart()
          } catch (err) {
            setPayError(err.message || 'Payment succeeded but verification failed. Please show this screen to counter staff.')
          } finally {
            setRzpLoading(false)
          }
        },
        modal: {
          ondismiss: () => setRzpLoading(false),
        },
      })

      rzp.on('payment.failed', (resp) => {
        setPayError(resp.error?.description || 'Payment failed. Please try again.')
        setRzpLoading(false)
      })

      rzp.open()
    } catch (err) {
      setPayError(err.message || 'Could not start the payment. Please try again.')
      setRzpLoading(false)
    }
  }

  const printReceipt = () => {
    window.print()
  }

  if (paid) {
    const receiptSource = receiptData || {
      items,
      subtotal,
      discountAmount,
      bagPrice,
      grandTotal,
      earnedPoints,
      paymentMethod,
      orderId,
    }

    const today = new Date()
    const dateString = today.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div className="page-shell">
        <div className="container">
          <div className="receipt-wrap">
            <div className="receipt-ticket">
              <div className="receipt-header">
                <h1>Receipt</h1>
                <p className="receipt-company">Lulu Mart Hypermarket</p>
              </div>

              <div className="receipt-details">
                <span>Counter 01 · Self Checkout</span>
                <span>Cashier: Jithendra</span>
              </div>

              <div className="receipt-divider dashed" />

              <div className="receipt-meta date-time-row">
                <span>{dateString.split(',')[0]}</span>
                <span>{dateString.split(',')[1]?.trim()}</span>
              </div>

              <div className="receipt-meta small-row">
                <span>Bill ID: {receiptSource.orderId?.slice(-8) || 'N/A'}</span>
                <span>
                  {receiptSource.paymentMethod === 'upi'
                    ? 'UPI'
                    : receiptSource.paymentMethod === 'cash'
                    ? 'Cash'
                    : receiptSource.paymentMethod === 'razorpay'
                    ? 'Online (Razorpay)'
                    : 'Pending'}
                </span>
              </div>

              <div className="receipt-divider dashed" />

              {receiptSource.items && receiptSource.items.length > 0 ? (
                receiptSource.items.map((item) => (
                  <div className="receipt-row" key={item._id ?? `${item.name}-${item.price}`}>
                    <span className="receipt-item-name">
                      {item.name}
                      {item.qty > 1 ? <small> x{item.qty}</small> : null}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))
              ) : (
                <div className="receipt-row"><span>No items recorded</span></div>
              )}

              <div className="receipt-divider dashed" />
              <div className="receipt-row smaller-row">
                <span>Sub-total</span>
                <span>₹{receiptSource.subtotal}</span>
              </div>
              {receiptSource.discountAmount > 0 && (
                <div className="receipt-row smaller-row" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>
                  <span>Discount ({receiptSource.couponCode || 'Promo'})</span>
                  <span>-₹{receiptSource.discountAmount}</span>
                </div>
              )}
              {receiptSource.bagPrice > 0 && (
                <div className="receipt-row smaller-row">
                  <span>Eco Shopping Bag</span>
                  <span>+₹{receiptSource.bagPrice}</span>
                </div>
              )}
              <div className="receipt-row amount-row">
                <span className="amount-label">TOTAL PAID</span>
                <span className="amount-value">₹{receiptSource.grandTotal}</span>
              </div>
              <div className="receipt-divider dashed" />
              {receiptSource.earnedPoints > 0 && (
                <div className="receipt-row smaller-row" style={{ color: 'var(--forest)', fontWeight: 600, justifyContent: 'center' }}>
                  <span>✨ Lulu Club Points Earned: +{receiptSource.earnedPoints} PTS</span>
                </div>
              )}
              <p className="receipt-note">Thank you for shopping at Lulu Hypermarket!</p>
              <div className="receipt-actions">
                <button className="btn btn-primary" type="button" onClick={printReceipt}>
                  Print Receipt
                </button>
                <Link to="/ice-creams" className="btn btn-secondary">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before paying the bill.</p>
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
          <span className="section-eyebrow">Billing Counter</span>
          <h1>Pay Bill</h1>
          <p>Choose a payment method to pay ₹{grandTotal}.</p>
        </div>

        {orderStatus === 'error' && (
          <div className="empty-state card" style={{ marginBottom: 20 }}>
            <p>{orderError || 'Couldn\'t reach the server to record this order. Make sure the API is running — you can still confirm payment below, but it won\'t be saved to the database.'}</p>
            <button className="btn btn-secondary" type="button" onClick={createPendingOrder}>
              Retry recording order
            </button>
          </div>
        )}

        <div className="checkout-layout">
          <div className="qr-pay-card">
            {/* Step 1: choose payment method */}
            {!method && (
              <div className="method-select">
                <h3>Choose Payment Method</h3>
                <div className="method-options">
                  <button className="method-option" onClick={() => setMethod('razorpay')}>
                    <FiCreditCard />
                    <span>Pay Online</span>
                    <small>UPI, Card, Wallet — verified instantly</small>
                  </button>
                  <button className="method-option" onClick={() => setMethod('upi')}>
                    <FiSmartphone />
                    <span>UPI (direct)</span>
                    <small>Scan a QR code to pay</small>
                  </button>
                  <button className="method-option" onClick={() => setMethod('cash')}>
                    <FiDollarSign />
                    <span>Cash</span>
                    <small>Pay in cash at the counter</small>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2a: Razorpay - opens the hosted checkout, verified server-side */}
            {method === 'razorpay' && (
              <>
                <h3>Pay Online</h3>
                <p className="qr-amount">₹{grandTotal}</p>
                <p className="qr-hint">
                  Pay by UPI, card, netbanking or wallet through Razorpay's secure checkout.
                  Payment is verified automatically once completed.
                </p>
                <button
                  className="btn btn-primary confirm-manual-btn"
                  onClick={payWithRazorpay}
                  disabled={rzpLoading || orderStatus !== 'ready'}
                >
                  {rzpLoading ? 'Opening payment…' : `Pay ₹${grandTotal} Now`}
                </button>
                <button className="link-btn" onClick={() => setMethod(null)}>Change payment method</button>
                {payError && <p className="estimate-note" style={{ color: 'var(--burgundy)' }}>{payError}</p>}
              </>
            )}

            {/* Step 2b: UPI - show QR */}
            {method === 'upi' && (
              <>
                <h3>Scan &amp; Pay</h3>
                <div className="qr-code-wrap">
                  <QRCodeSVG value={buildUpiLink(grandTotal)} size={220} bgColor="#FFFCF5" fgColor="#34241A" />
                </div>
                <p className="qr-amount">₹{grandTotal}</p>
                <p className="qr-payee">{PAYEE_NAME} · {UPI_ID}</p>
                <p className="qr-hint">Scan with Google Pay, PhonePe, Paytm, Navi or any UPI app</p>

                <div className="qr-status qr-status-waiting">Waiting for payment…</div>

                <button className="btn btn-primary confirm-manual-btn" onClick={() => confirmPaid('upi')}>
                  I've completed the payment
                </button>
                <button className="link-btn" onClick={() => setMethod(null)}>Change payment method</button>
                {payError && <p className="estimate-note" style={{ color: 'var(--burgundy)' }}>{payError}</p>}
                <p className="estimate-note">
                  Demo note: this app has no payment gateway connected, so
                  payment isn't verified automatically — tap the button above
                  once you've actually paid. A real store would connect this
                  QR to a UPI payment gateway (e.g. Razorpay, Cashfree) to
                  confirm payment automatically via a webhook.
                </p>
              </>
            )}

            {/* Step 2c: Cash - confirm at counter */}
            {method === 'cash' && (
              <>
                <h3>Pay in Cash</h3>
                <p className="qr-amount">₹{grandTotal}</p>
                <p className="qr-hint">Hand ₹{grandTotal} in cash to the counter staff.</p>
                <button className="btn btn-primary confirm-manual-btn" onClick={() => confirmPaid('cash')}>
                  Confirm Cash Received
                </button>
                <button className="link-btn" onClick={() => setMethod(null)}>Change payment method</button>
                {payError && <p className="estimate-note" style={{ color: 'var(--burgundy)' }}>{payError}</p>}
                <p className="estimate-note">
                  Demo note: this button represents the counter staff marking
                  the bill as paid once cash is physically received.
                </p>
              </>
            )}
          </div>

          <div className="cart-summary">
            <h3>Bill Summary</h3>
            {items.map((item) => (
              <div className="summary-row" key={item._id ?? `${item.name}-${item.price}`}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discountAmount > 0 && (
              <div className="summary-row discount">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            {bagPrice > 0 && (
              <div className="summary-row"><span>Eco Shopping Bag</span><span>+₹{bagPrice}</span></div>
            )}
            <div className="summary-row total"><span>Total Payable</span><span>₹{grandTotal}</span></div>
            {earnedPoints > 0 && (
              <div className="summary-row" style={{ color: 'var(--forest)', fontWeight: 600, fontSize: '0.82rem' }}>
                <span>✨ Lulu Club Points</span>
                <span>+{earnedPoints} PTS</span>
              </div>
            )}
            <p className="estimate-note">*Prices are typical mart estimates, not confirmed shelf prices.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
