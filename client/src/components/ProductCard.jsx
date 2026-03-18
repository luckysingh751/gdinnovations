import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext)

  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300 bg-white">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />

        <h2 className="text-lg font-semibold mt-4 hover:text-blue-600">
          {product.name}
        </h2>
      </Link>

      <p className="text-gray-600 mt-2">{product.description}</p>

      <p className="text-blue-600 font-bold text-lg mt-3">${product.price}</p>

      <button
        onClick={() => addToCart(product)}
        className="bg-yellow-400 w-full mt-4 py-2 rounded hover:bg-yellow-500 font-semibold"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
