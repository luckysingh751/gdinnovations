import { useLocation } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function Shop() {
  const { products, loading, content } = useSiteData()
  const location = useLocation()
  const { theme } = content

  // Get search query from URL
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get("search")?.toLowerCase() || ""

  // Advanced filter (name + category + description)
  const filteredProducts = products.filter(product => {
    const searchableText = `
      ${product.name}
      ${product.category}
      ${product.description}
    `.toLowerCase()

    return searchableText.includes(searchQuery)
  })

  return (
    <div className="py-10 max-w-7xl mx-auto px-6 text-slate-100">
      {loading ? (
        <p className="text-slate-300 text-lg">Loading products...</p>
      ) : (
        <>

      <h1 className="text-3xl font-bold mb-2">
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : "All Products"}
      </h1>
      <p className="mb-8 text-slate-300">
        Confidential care, curated treatments, and fast delivery from a modern online pharmacy experience.
      </p>

      {filteredProducts.length === 0 ? (
        <div
          className="rounded-2xl border p-6 text-lg"
          style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}
        >
          No products found.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
        </>
      )}

    </div>
  )
}

export default Shop
