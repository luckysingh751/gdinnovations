import { useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function Category() {
  const { products } = useSiteData()
  const { categoryName } = useParams()

  const filteredProducts = products.filter(
    product => product.category === categoryName
  )

  return (
    <div className="py-10 max-w-6xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {categoryName.replace("-", " ")}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">No products found in this category.</p>
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

export default Category
