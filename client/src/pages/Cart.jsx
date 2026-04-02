import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useSiteData } from "../context/SiteDataContext"

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext)
  const { isAuthenticated } = useAuth()
  const { content } = useSiteData()
  const { theme } = content

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 text-slate-100">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div
          className="max-w-2xl mx-auto rounded-2xl border p-6 text-center text-slate-300"
          style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}
        >
          Your cart is empty.
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id || item.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border p-4 sm:p-6 rounded-lg"
                style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-slate-300">
                    ${item.price} x {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id || item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-left sm:text-right">
            <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={clearCart}
                className="px-6 py-3 rounded w-full sm:w-auto"
                style={{ backgroundColor: "#1f2d42", color: "#f8fafc" }}
              >
                Clear Cart
              </button>
              <Link
                to={isAuthenticated ? "/checkout" : "/login"}
                className="px-6 py-3 rounded w-full sm:w-auto text-center"
                style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
              >
                {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
