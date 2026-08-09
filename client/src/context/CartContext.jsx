import { createContext, useContext, useMemo, useCallback, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('lulumart-cart', [])
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = useCallback((message) => {
    setToastMessage(message)
    setToastVisible(true)
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => setToastVisible(false), 2200)
  }, [])

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id)
      if (existing) {
        showToast(`${product.name} quantity updated in cart`)
        return prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i))
      }
      showToast(`${product.name} added to cart`)
      return [...prev, { ...product, qty }]
    })
  }, [setItems, showToast])

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id))
  }, [setItems])

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  }, [setItems])

  const clearCart = useCallback(() => setItems([]), [setItems])

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])
  const grandTotal = subtotal
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal,
    grandTotal,
    count,
    toastMessage,
    toastVisible,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
