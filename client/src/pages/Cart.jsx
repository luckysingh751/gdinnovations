import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext)

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="py-20 max-w-6xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-center mb-12">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white shadow-md p-6 rounded-lg"
              >
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    ${item.price} x {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right">
            <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>

            <button
              onClick={clearCart}
              className="mt-4 bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
