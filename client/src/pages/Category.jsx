import { useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function Category() {
  const { products, content } = useSiteData()
  const { categoryName } = useParams()
  const { theme } = content

  const filteredProducts = products.filter(
    product => product.category === categoryName
  )

  return (
    <div className="py-10 max-w-6xl mx-auto px-6 text-slate-100">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {categoryName.replace("-", " ")}
      </h1>

      {filteredProducts.length === 0 ? (
        <div
          className="rounded-2xl border p-6 text-slate-300"
          style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}
        >
          No products found in this category.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Category
