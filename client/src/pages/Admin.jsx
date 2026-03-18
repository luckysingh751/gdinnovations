import { useEffect, useMemo, useState } from "react"
import { useSiteData } from "../context/SiteDataContext"

const ADMIN_CODE = "gdadmin2026"

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
}

function Admin() {
  const {
    products,
    content,
    addProduct,
    updateProduct,
    deleteProduct,
    replaceContent,
    resetAllData,
  } = useSiteData()

  const [adminCode, setAdminCode] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [tab, setTab] = useState("products")
  const [newProduct, setNewProduct] = useState(emptyProduct)
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(content, null, 2))
  const [jsonError, setJsonError] = useState("")

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(a.id) - Number(b.id)),
    [products]
  )

  useEffect(() => {
    setJsonDraft(JSON.stringify(content, null, 2))
  }, [content])

  const unlock = (e) => {
    e.preventDefault()
    if (adminCode === ADMIN_CODE) {
      setIsUnlocked(true)
    } else {
      alert("Invalid admin code")
    }
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    addProduct(newProduct)
    setNewProduct(emptyProduct)
  }

  const saveJsonContent = () => {
    try {
      const parsed = JSON.parse(jsonDraft)
      replaceContent(parsed)
      setJsonError("")
      alert("Content saved successfully")
    } catch {
      setJsonError("Invalid JSON. Please correct the format and try again.")
    }
  }

  if (!isUnlocked) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Admin Access</h1>
        <p className="text-gray-600 mb-6">
          Enter admin code to access product and content management.
        </p>
        <form onSubmit={unlock} className="bg-white rounded-xl shadow p-6 space-y-4">
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Enter admin code"
            className="w-full border rounded px-3 py-2"
          />
          <button className="bg-slate-900 text-white px-5 py-2 rounded">Unlock Admin</button>
          <p className="text-xs text-gray-500">Current code: gdadmin2026 (change later in code)</p>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={resetAllData}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reset Demo Data
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded ${tab === "products" ? "bg-slate-900 text-white" : "bg-white border"}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("content")}
          className={`px-4 py-2 rounded ${tab === "content" ? "bg-slate-900 text-white" : "bg-white border"}`}
        >
          Website Content
        </button>
      </div>

      {tab === "products" ? (
        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Category slug (e.g. weight-loss)"
                value={newProduct.category}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
              <input
                className="border rounded px-3 py-2"
                type="number"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
              <input
                className="border rounded px-3 py-2"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, image: e.target.value }))}
                required
              />
              <textarea
                className="border rounded px-3 py-2 md:col-span-2 min-h-24"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
              <button className="bg-emerald-600 text-white px-4 py-2 rounded w-fit">
                Add Product
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Edit Existing Products</h2>
            {sortedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow p-5 grid md:grid-cols-2 gap-3">
                <input
                  className="border rounded px-3 py-2"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                />
                <input
                  className="border rounded px-3 py-2"
                  value={product.category}
                  onChange={(e) => updateProduct(product.id, { category: e.target.value })}
                />
                <input
                  className="border rounded px-3 py-2"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                />
                <input
                  className="border rounded px-3 py-2"
                  value={product.image}
                  onChange={(e) => updateProduct(product.id, { image: e.target.value })}
                />
                <textarea
                  className="border rounded px-3 py-2 md:col-span-2 min-h-20"
                  value={product.description}
                  onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                />
                <div className="md:col-span-2">
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Website Content JSON</h2>
          <p className="text-sm text-gray-600 mb-4">
            Edit any homepage/about/footer/navbar content from one place. Keep valid JSON format.
          </p>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[420px] font-mono text-sm"
            value={jsonDraft}
            onChange={(e) => setJsonDraft(e.target.value)}
          />
          {jsonError ? <p className="text-red-600 mt-2 text-sm">{jsonError}</p> : null}
          <div className="mt-4">
            <button
              onClick={saveJsonContent}
              className="bg-slate-900 text-white px-5 py-2 rounded hover:bg-black"
            >
              Save Content
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
