import { useLocation } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function Shop() {
  const { products } = useSiteData()
  const location = useLocation()

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
    <div className="py-10 max-w-7xl mx-auto px-6">

      <h1 className="text-3xl font-bold mb-8">
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : "All Products"}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No products found.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  )
}

export default Shop
