import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { useSiteData } from "../context/SiteDataContext"
import { useAuth } from "../context/AuthContext"

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext)
  const { content } = useSiteData()
  const { isAuthenticated } = useAuth()
  const { theme } = content
  const navigate = useNavigate()
  const productId = product._id || product.id

  const handleBuyNow = () => {
    const checkoutPath = `/checkout?buyNow=${encodeURIComponent(productId)}`
    navigate(isAuthenticated ? checkoutPath : `/login?redirect=${encodeURIComponent(checkoutPath)}`)
  }

  return (
    <div
      className="group rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: "rgba(214,226,239,0.1)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#17253b"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.cardBg
      }}
    >
      <Link to={`/product/${productId}`}>
        <div className="overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-xl transition duration-500 group-hover:scale-110"
          />
        </div>

        <h2 className="text-lg font-semibold mt-4 transition text-slate-100 group-hover:text-white">
          {product.name}
        </h2>
      </Link>

      <p className="text-slate-300 mt-2 transition group-hover:text-slate-100">{product.description}</p>

      <p className="font-bold text-lg mt-3" style={{ color: theme.accentColor }}>${product.price}</p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <button
          onClick={() => addToCart(product)}
          className="w-full py-2 rounded-xl font-semibold transition hover:brightness-110"
          style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="w-full py-2 rounded-xl font-semibold transition hover:brightness-110"
          style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default ProductCard
