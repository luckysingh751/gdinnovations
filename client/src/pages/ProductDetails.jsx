import { Link, useNavigate, useParams } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"
import { useAuth } from "../context/AuthContext"

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { isAuthenticated } = useAuth()
  const { products, loading, content } = useSiteData()
  const { theme } = content

  const product = products.find((p) => String(p._id || p.id) === String(id))

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-10 text-slate-300">Loading product...</div>
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-xl text-slate-100">
        Product not found.
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && String(p._id || p.id) !== String(product._id || product.id))
    .slice(0, 3)

  const handleBuyNow = () => {
    const productId = product._id || product.id
    const checkoutPath = `/checkout?buyNow=${encodeURIComponent(productId)}`
    navigate(isAuthenticated ? checkoutPath : `/login?redirect=${encodeURIComponent(checkoutPath)}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-slate-100">
      <div className="mb-5 text-sm text-slate-400">
        <Link to="/shop" className="hover:text-white">Shop</Link> / <Link to={`/category/${product.category}`} className="hover:text-white">{product.category}</Link> / {product.name}
      </div>
      <div
        className="grid md:grid-cols-2 gap-10 rounded-2xl border p-6 md:p-8"
        style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)", boxShadow: "0 18px 48px rgba(0,0,0,0.24)" }}
      >
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-lg object-cover h-[380px]"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: theme.accentColor }}>
            {product.category}
          </p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-slate-300 mb-4 text-lg">{product.description}</p>

          <p className="text-2xl font-semibold mb-6" style={{ color: theme.accentColor }}>${product.price}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product)}
              className="px-6 py-3 rounded-lg font-semibold hover:brightness-110"
              style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 rounded-lg font-semibold hover:brightness-110"
              style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
            >
              Buy Now
            </button>
          </div>
          <div className="mt-6 space-y-2 text-sm text-slate-300">
            <p>Private and secure packaging</p>
            <p>Online support available</p>
            <p>Delivery tracking at checkout</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default ProductDetails
