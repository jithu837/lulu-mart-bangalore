import { createContext, useContext, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage('lulumart-wishlist', [])

  const toggleWishlist = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i._id === product._id)
      return exists ? prev.filter((i) => i._id !== product._id) : [...prev, product]
    })
  }, [setItems])

  const removeFromWishlist = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id))
  }, [setItems])

  const isWishlisted = useCallback((id) => items.some((i) => i._id === id), [items])

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
