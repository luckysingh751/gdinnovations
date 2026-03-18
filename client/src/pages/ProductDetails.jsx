import { Link, useParams } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const { products } = useSiteData()

  const product = products.find((p) => String(p.id) === String(id))

  if (!product) {
    return (
      <div className="p-10 text-center text-xl">
        Product not found.
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-5 text-sm text-slate-500">
        <Link to="/shop" className="hover:text-slate-700">Shop</Link> / <Link to={`/category/${product.category}`} className="hover:text-slate-700">{product.category}</Link> / {product.name}
      </div>
      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow p-6 md:p-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-lg object-cover h-[380px]"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-cyan-700 font-semibold mb-2">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-600 mb-4 text-lg">{product.description}</p>

          <p className="text-2xl font-semibold text-cyan-700 mb-6">${product.price}</p>

          <button
            onClick={() => addToCart(product)}
            className="bg-amber-400 px-6 py-3 rounded-lg font-semibold hover:bg-amber-300"
          >
            Add to Cart
          </button>
          <div className="mt-6 space-y-2 text-sm text-gray-600">
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
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default ProductDetails
