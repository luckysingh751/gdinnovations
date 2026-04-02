import { createContext, useEffect, useState } from "react"

export const CartContext = createContext()
const CART_STORAGE_KEY = "gdinnovations_cart_v1"

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      return storedCart ? JSON.parse(storedCart) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    const productId = String(product._id || product.id)
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => String(item._id || item.id) === productId)

      if (itemExists) {
        return prevItems.map((item) =>
          String(item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    const targetId = String(id)
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item._id || item.id) !== targetId)
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
