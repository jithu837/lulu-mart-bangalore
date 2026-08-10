import { createContext, useContext, useMemo, useCallback, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const VALID_COUPONS = {
  LULU10: { code: 'LULU10', type: 'percent', value: 10, label: '10% Mall Discount', minSubtotal: 0 },
  SUPERMALL: { code: 'SUPERMALL', type: 'fixed', value: 150, label: '₹150 Supermall Offer', minSubtotal: 600 },
  FREEDEL: { code: 'FREEDEL', type: 'fixed', value: 50, label: '₹50 Express Counter Voucher', minSubtotal: 200 },
}

const BAG_PRICES = {
  none: 0,
  eco: 10,
  jute: 25,
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('lulumart-cart', [])
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [isTrolleyOpen, setIsTrolleyOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [bagOption, setBagOption] = useState('none') // 'none' | 'eco' | 'jute'

  const showToast = useCallback((message) => {
    setToastMessage(message)
    setToastVisible(true)
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => setToastVisible(false), 2200)
  }, [])

  const openTrolley = useCallback(() => setIsTrolleyOpen(true), [])
  const closeTrolley = useCallback(() => setIsTrolleyOpen(false), [])
  const toggleTrolley = useCallback(() => setIsTrolleyOpen((prev) => !prev), [])

  const openScanner = useCallback(() => setIsScannerOpen(true), [])
  const closeScanner = useCallback(() => setIsScannerOpen(false), [])

  const addToCart = useCallback((product, qty = 1, silent = false) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id)
      if (existing) {
        if (!silent) showToast(`${product.name} quantity updated in cart`)
        return prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i))
      }
      if (!silent) showToast(`${product.name} added to trolley 🛒`)
      return [...prev, { ...product, qty }]
    })
  }, [setItems, showToast])

  const removeFromCart = useCallback((id) => {
    setItems((prev) => {
      const item = prev.find((i) => i._id === id)
      if (item) showToast(`${item.name} removed from trolley`)
      return prev.filter((i) => i._id !== id)
    })
  }, [setItems, showToast])

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, qty } : i)))
  }, [setItems, removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedCoupon(null)
    setBagOption('none')
  }, [setItems])

  const applyCoupon = useCallback((codeStr) => {
    setCouponError('')
    const cleanCode = (codeStr || '').trim().toUpperCase()
    if (!cleanCode) {
      setCouponError('Please enter a coupon code.')
      return false
    }

    const matched = VALID_COUPONS[cleanCode]
    if (!matched) {
      setCouponError('Invalid coupon code. Try LULU10, SUPERMALL, or FREEDEL.')
      return false
    }

    setAppliedCoupon(matched)
    showToast(`Coupon '${matched.code}' applied! 🎉`)
    return true
  }, [showToast])

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
    setCouponError('')
    showToast('Coupon removed.')
  }, [showToast])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (subtotal < appliedCoupon.minSubtotal) return 0

    if (appliedCoupon.type === 'percent') {
      return Math.round((subtotal * appliedCoupon.value) / 100)
    }
    return Math.min(subtotal, appliedCoupon.value)
  }, [subtotal, appliedCoupon])

  const bagPrice = BAG_PRICES[bagOption] || 0

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + bagPrice)
  }, [subtotal, discountAmount, bagPrice])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const totalWeightKg = useMemo(() => {
    return (count * 0.45).toFixed(1)
  }, [count])

  const earnedPoints = useMemo(() => {
    return Math.floor(grandTotal / 10)
  }, [grandTotal])

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal,
    discountAmount,
    bagOption,
    bagPrice,
    setBagOption,
    grandTotal,
    count,
    totalWeightKg,
    earnedPoints,
    isTrolleyOpen,
    openTrolley,
    closeTrolley,
    toggleTrolley,
    isScannerOpen,
    openScanner,
    closeScanner,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    toastMessage,
    toastVisible,
    validCouponsList: Object.values(VALID_COUPONS),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

