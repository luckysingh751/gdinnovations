import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useSiteData } from "../context/SiteDataContext"
import { useAuth } from "../context/AuthContext"
import { apiRequest, authHeaders } from "../lib/api"

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
}

function Admin() {
  const { user, isAdmin, authLoading, token } = useAuth()
  const {
    products,
    content,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    replaceContent,
    refreshProducts,
  } = useSiteData()

  const [tab, setTab] = useState("products")
  const [newProduct, setNewProduct] = useState(emptyProduct)
  const [contentDraft, setContentDraft] = useState(content)
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(content, null, 2))
  const [jsonError, setJsonError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [savingId, setSavingId] = useState("")
  const [busy, setBusy] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderSavingId, setOrderSavingId] = useState("")
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [applicationSavingId, setApplicationSavingId] = useState("")
  const [referrals, setReferrals] = useState([])
  const [referralsLoading, setReferralsLoading] = useState(false)
  const [referralSavingId, setReferralSavingId] = useState("")

  useEffect(() => {
    setJsonDraft(JSON.stringify(content, null, 2))
    setContentDraft(content)
  }, [content])

  useEffect(() => {
    if (tab === "orders" && isAdmin && orders.length === 0) {
      void loadOrders()
    }
  }, [tab, isAdmin])

  useEffect(() => {
    if (tab === "applications" && isAdmin && applications.length === 0) {
      void loadApplications()
    }
  }, [tab, isAdmin])

  useEffect(() => {
    if (tab === "referrals" && isAdmin && referrals.length === 0) {
      void loadReferrals()
    }
  }, [tab, isAdmin])

  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  )

  const loadOrders = async () => {
    setOrdersLoading(true)
    setJsonError("")
    try {
      const data = await apiRequest("/orders", {
        headers: authHeaders(token),
      })
      setOrders(data)
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setOrdersLoading(false)
    }
  }

  const loadApplications = async () => {
    setApplicationsLoading(true)
    setJsonError("")
    try {
      const data = await apiRequest("/programs/applications/all", {
        headers: authHeaders(token),
      })
      setApplications(data)
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setApplicationsLoading(false)
    }
  }

  const loadReferrals = async () => {
    setReferralsLoading(true)
    setJsonError("")
    try {
      const data = await apiRequest("/auth/referrals", {
        headers: authHeaders(token),
      })
      setReferrals(data)
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setReferralsLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setBusy(true)
    setJsonError("")
    setSuccessMessage("")
    try {
      await addProduct(newProduct)
      setNewProduct(emptyProduct)
      setSuccessMessage("Product added successfully.")
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const handleProductSave = async (id, updates) => {
    setSavingId(String(id))
    setJsonError("")
    setSuccessMessage("")
    try {
      const saved = await updateProduct(id, updates)
      setSuccessMessage(`${saved.name} updated successfully.`)
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setSavingId("")
    }
  }

  const handleDelete = async (id) => {
    setSavingId(String(id))
    setJsonError("")
    setSuccessMessage("")
    try {
      await deleteProduct(id)
      setSuccessMessage("Product deleted successfully.")
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setSavingId("")
    }
  }

  const updateContentDraft = (updater) => {
    setContentDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      updater(next)
      return next
    })
  }

  const handleSaveContentEditor = async () => {
    setBusy(true)
    setJsonError("")
    setSuccessMessage("")
    try {
      await replaceContent(contentDraft)
      setSuccessMessage("Website content saved successfully.")
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setBusy(false)
    }
  }

  const saveJsonContent = async () => {
    setBusy(true)
    setSuccessMessage("")
    try {
      const parsed = JSON.parse(jsonDraft)
      await replaceContent(parsed)
      setJsonError("")
      setSuccessMessage("Website content saved successfully.")
    } catch (error) {
      setJsonError(error.message || "Invalid JSON. Please correct the format and try again.")
    } finally {
      setBusy(false)
    }
  }

  const handleUpdateOrder = async (orderId, updates) => {
    setOrderSavingId(String(orderId))
    setJsonError("")
    setSuccessMessage("")
    try {
      const updated = await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify(updates),
      })
      setOrders((currentOrders) =>
        currentOrders.map((order) => (String(order._id) === String(orderId) ? updated : order))
      )
      setSuccessMessage("Order updated successfully.")
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setOrderSavingId("")
    }
  }

  const handleUpdateApplication = async (applicationId, status) => {
    setApplicationSavingId(String(applicationId))
    setJsonError("")
    setSuccessMessage("")
    try {
      const updated = await apiRequest(`/programs/applications/${applicationId}`, {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({ status }),
      })
      setApplications((current) =>
        current.map((item) => (String(item._id) === String(applicationId) ? updated : item))
      )
      setSuccessMessage("Application updated successfully.")
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setApplicationSavingId("")
    }
  }

  const handleMarkReferralPaid = async (referralUserId) => {
    setReferralSavingId(String(referralUserId))
    setJsonError("")
    setSuccessMessage("")
    try {
      const updated = await apiRequest(`/auth/referrals/${referralUserId}/pay`, {
        method: "PATCH",
        headers: authHeaders(token),
      })
      setReferrals((current) =>
        current.map((item) => (String(item._id) === String(referralUserId) ? updated : item))
      )
      setSuccessMessage("Referral payout marked as paid.")
    } catch (error) {
      setJsonError(error.message)
    } finally {
      setReferralSavingId("")
    }
  }

  const updateArrayByPath = (path, updater) => {
    updateContentDraft((next) => {
      const target = getValueAtPath(next, path)
      updater(target)
    })
  }

  const addArrayItem = (path, item) => {
    updateArrayByPath(path, (target) => {
      target.push(item)
    })
  }

  const removeArrayItem = (path, index) => {
    updateArrayByPath(path, (target) => {
      target.splice(index, 1)
    })
  }

  const moveArrayItem = (path, fromIndex, toIndex) => {
    updateArrayByPath(path, (target) => {
      if (toIndex < 0 || toIndex >= target.length || fromIndex === toIndex) return
      const [moved] = target.splice(fromIndex, 1)
      target.splice(toIndex, 0, moved)
    })
  }

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-slate-600">Loading admin dashboard...</div>
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Admin Access</h1>
        <p className="text-gray-600 mb-6">Please sign in with an admin account to manage products and content.</p>
        <Link to="/login" className="bg-slate-900 text-white px-5 py-2 rounded inline-block">
          Go to Login
        </Link>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
        <p className="text-gray-600">Your account is signed in, but it does not have admin permissions.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Manage products, images, page content, colors, and orders.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={async () => {
              setJsonError("")
              setSuccessMessage("")
              try {
                await refreshProducts()
                setSuccessMessage("Products reloaded from database.")
              } catch (error) {
                setJsonError(error.message)
              }
            }}
            className="bg-white border px-4 py-2 rounded w-full sm:w-auto"
          >
            Reload Products
          </button>
          <button
            onClick={() => {
              setContentDraft(content)
              setJsonDraft(JSON.stringify(content, null, 2))
              setSuccessMessage("Editor reset to latest saved content.")
            }}
            className="bg-white border px-4 py-2 rounded w-full sm:w-auto"
          >
            Reset Editor
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
          Products
        </TabButton>
        <TabButton active={tab === "content"} onClick={() => setTab("content")}>
          Visual Content
        </TabButton>
        <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
          Orders
        </TabButton>
        <TabButton active={tab === "applications"} onClick={() => setTab("applications")}>
          Partner Leads
        </TabButton>
        <TabButton active={tab === "referrals"} onClick={() => setTab("referrals")}>
          Referrals
        </TabButton>
        <TabButton active={tab === "json"} onClick={() => setTab("json")}>
          Raw JSON
        </TabButton>
      </div>

      {jsonError ? <p className="mb-4 text-sm text-red-600">{jsonError}</p> : null}
      {successMessage ? <p className="mb-4 text-sm text-emerald-700">{successMessage}</p> : null}

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
                list="product-categories"
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
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Upload product image</label>
                <ImagePicker
                  onImageSelected={(image) => setNewProduct((prev) => ({ ...prev, image }))}
                />
                {newProduct.image ? (
                  <img src={newProduct.image} alt="Preview" className="mt-3 h-24 w-24 object-cover rounded" />
                ) : null}
              </div>
              <textarea
                className="border rounded px-3 py-2 md:col-span-2 min-h-24"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
              <button
                disabled={busy}
                className="bg-emerald-600 text-white px-4 py-2 rounded w-full sm:w-fit disabled:opacity-60"
              >
                {busy ? "Adding..." : "Add Product"}
              </button>
              <datalist id="product-categories">
                {categoryOptions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Edit Existing Products</h2>
            {products.map((product) => {
              const productId = product._id || product.id
              return (
                <ProductEditor
                  key={productId}
                  product={product}
                  isSaving={savingId === String(productId)}
                  onSave={handleProductSave}
                  onDelete={handleDelete}
                />
              )
            })}
          </section>
        </div>
      ) : null}

      {tab === "content" ? (
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Theme Colors</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <ColorField label="Accent Color" value={contentDraft.theme.accentColor} onChange={(value) => updateContentDraft((next) => { next.theme.accentColor = value })} />
              <ColorField label="Accent Soft" value={contentDraft.theme.accentSoft} onChange={(value) => updateContentDraft((next) => { next.theme.accentSoft = value })} />
              <ColorField label="Button Text" value={contentDraft.theme.buttonText} onChange={(value) => updateContentDraft((next) => { next.theme.buttonText = value })} />
              <ColorField label="Hero Start" value={contentDraft.theme.heroGradientStart} onChange={(value) => updateContentDraft((next) => { next.theme.heroGradientStart = value })} />
              <ColorField label="Hero Middle" value={contentDraft.theme.heroGradientMiddle} onChange={(value) => updateContentDraft((next) => { next.theme.heroGradientMiddle = value })} />
              <ColorField label="Hero End" value={contentDraft.theme.heroGradientEnd} onChange={(value) => updateContentDraft((next) => { next.theme.heroGradientEnd = value })} />
              <ColorField label="Page Start" value={contentDraft.theme.pageBackgroundStart} onChange={(value) => updateContentDraft((next) => { next.theme.pageBackgroundStart = value })} />
              <ColorField label="Page Middle" value={contentDraft.theme.pageBackgroundMiddle} onChange={(value) => updateContentDraft((next) => { next.theme.pageBackgroundMiddle = value })} />
              <ColorField label="Page End" value={contentDraft.theme.pageBackgroundEnd} onChange={(value) => updateContentDraft((next) => { next.theme.pageBackgroundEnd = value })} />
              <ColorField label="Header Bar" value={contentDraft.theme.headerBarBg} onChange={(value) => updateContentDraft((next) => { next.theme.headerBarBg = value })} />
              <ColorField label="Header Text" value={contentDraft.theme.headerBarText} onChange={(value) => updateContentDraft((next) => { next.theme.headerBarText = value })} />
              <ColorField label="Footer Background" value={contentDraft.theme.footerBg} onChange={(value) => updateContentDraft((next) => { next.theme.footerBg = value })} />
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Site Header</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.site.brandName} onChange={(e) => updateContentDraft((next) => { next.site.brandName = e.target.value })} placeholder="Brand name" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.site.topBarText} onChange={(e) => updateContentDraft((next) => { next.site.topBarText = e.target.value })} placeholder="Top bar left text" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.site.topBarRight} onChange={(e) => updateContentDraft((next) => { next.site.topBarRight = e.target.value })} placeholder="Top bar right text" />
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Home Hero</h2>
              <button
                type="button"
                onClick={() => addArrayItem("home.heroSupportImages", "")}
                className="bg-slate-900 text-white px-4 py-2 rounded"
              >
                Add Hero Photo
              </button>
            </div>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.heroTitle} onChange={(e) => updateContentDraft((next) => { next.home.heroTitle = e.target.value })} placeholder="Hero title" />
            <textarea className="w-full border rounded px-3 py-2 min-h-24" value={contentDraft.home.heroSubtitle} onChange={(e) => updateContentDraft((next) => { next.home.heroSubtitle = e.target.value })} placeholder="Hero subtitle" />
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="w-full border rounded px-3 py-2" value={contentDraft.home.primaryButtonLabel} onChange={(e) => updateContentDraft((next) => { next.home.primaryButtonLabel = e.target.value })} placeholder="Primary button label" />
              <input className="w-full border rounded px-3 py-2" value={contentDraft.home.secondaryButtonLabel} onChange={(e) => updateContentDraft((next) => { next.home.secondaryButtonLabel = e.target.value })} placeholder="Secondary button label" />
            </div>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.heroImage} onChange={(e) => updateContentDraft((next) => { next.home.heroImage = e.target.value })} placeholder="Hero image URL" />
            <ImagePicker onImageSelected={(image) => updateContentDraft((next) => { next.home.heroImage = image })} />
            {contentDraft.home.heroImage ? <img src={contentDraft.home.heroImage} alt="Hero preview" className="h-32 rounded object-cover" /> : null}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">Hero Highlights</p>
                <button
                  type="button"
                  onClick={() => addArrayItem("home.heroHighlights", "")}
                  className="border px-3 py-2 rounded"
                >
                  Add Text
                </button>
              </div>
              {(contentDraft.home.heroHighlights || []).map((highlight, index) => (
                <SortableCard
                  key={`hero-highlight-${index}`}
                  index={index}
                  onMove={(from, to) => moveArrayItem("home.heroHighlights", from, to)}
                  onRemove={() => removeArrayItem("home.heroHighlights", index)}
                >
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-20"
                    value={highlight}
                    onChange={(e) => updateContentDraft((next) => { next.home.heroHighlights[index] = e.target.value })}
                    placeholder={`Highlight ${index + 1}`}
                  />
                </SortableCard>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-medium">Hero Support Images</p>
              {(contentDraft.home.heroSupportImages || []).map((image, index) => (
                <SortableCard
                  key={`hero-support-${index}`}
                  index={index}
                  onMove={(from, to) => moveArrayItem("home.heroSupportImages", from, to)}
                  onRemove={() => removeArrayItem("home.heroSupportImages", index)}
                >
                  <input className="w-full border rounded px-3 py-2" value={image} onChange={(e) => updateContentDraft((next) => { next.home.heroSupportImages[index] = e.target.value })} placeholder={`Hero support image ${index + 1}`} />
                  <ImagePicker onImageSelected={(data) => updateContentDraft((next) => { next.home.heroSupportImages[index] = data })} />
                  {image ? <img src={image} alt={`Hero support ${index + 1}`} className="h-24 rounded object-cover" /> : null}
                </SortableCard>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Gallery Section</h2>
              <button type="button" onClick={() => addArrayItem("home.galleryImages", "")} className="bg-slate-900 text-white px-4 py-2 rounded">
                Add Photo
              </button>
            </div>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.galleryHeading} onChange={(e) => updateContentDraft((next) => { next.home.galleryHeading = e.target.value })} placeholder="Gallery heading" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.home.gallerySubtitle} onChange={(e) => updateContentDraft((next) => { next.home.gallerySubtitle = e.target.value })} placeholder="Gallery subtitle" />
            {contentDraft.home.galleryImages.map((image, index) => (
              <SortableCard key={`gallery-${index}`} index={index} onMove={(from, to) => moveArrayItem("home.galleryImages", from, to)} onRemove={() => removeArrayItem("home.galleryImages", index)}>
                <input className="w-full border rounded px-3 py-2" value={image} onChange={(e) => updateContentDraft((next) => { next.home.galleryImages[index] = e.target.value })} placeholder={`Gallery image ${index + 1}`} />
                <ImagePicker onImageSelected={(data) => updateContentDraft((next) => { next.home.galleryImages[index] = data })} />
                {image ? <img src={image} alt={`Gallery ${index + 1}`} className="h-24 rounded object-cover" /> : null}
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Treatment Cards</h2>
              <button
                type="button"
                onClick={() => addArrayItem("home.treatments", { title: "", slug: "", description: "", image: "" })}
                className="bg-slate-900 text-white px-4 py-2 rounded"
              >
                Add Card
              </button>
            </div>
            {contentDraft.home.treatments.map((treatment, index) => (
              <SortableCard key={treatment.slug || index} index={index} onMove={(from, to) => moveArrayItem("home.treatments", from, to)} onRemove={() => removeArrayItem("home.treatments", index)}>
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="border rounded px-3 py-2" value={treatment.title} onChange={(e) => updateContentDraft((next) => { next.home.treatments[index].title = e.target.value })} placeholder="Title" />
                  <input className="border rounded px-3 py-2" value={treatment.slug} onChange={(e) => updateContentDraft((next) => { next.home.treatments[index].slug = e.target.value })} placeholder="Slug" />
                </div>
                <textarea className="w-full border rounded px-3 py-2 min-h-20" value={treatment.description} onChange={(e) => updateContentDraft((next) => { next.home.treatments[index].description = e.target.value })} placeholder="Description" />
                <input className="w-full border rounded px-3 py-2" value={treatment.image} onChange={(e) => updateContentDraft((next) => { next.home.treatments[index].image = e.target.value })} placeholder="Image URL" />
                <ImagePicker onImageSelected={(image) => updateContentDraft((next) => { next.home.treatments[index].image = image })} />
                {treatment.image ? <img src={treatment.image} alt={treatment.title} className="h-24 rounded object-cover" /> : null}
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">How It Works Steps</h2>
              <button type="button" onClick={() => addArrayItem("home.steps", { title: "", description: "" })} className="bg-slate-900 text-white px-4 py-2 rounded">
                Add Step
              </button>
            </div>
            {contentDraft.home.steps.map((step, index) => (
              <SortableCard key={index} index={index} onMove={(from, to) => moveArrayItem("home.steps", from, to)} onRemove={() => removeArrayItem("home.steps", index)}>
                <input className="border rounded px-3 py-2" value={step.title} onChange={(e) => updateContentDraft((next) => { next.home.steps[index].title = e.target.value })} placeholder="Step title" />
                <input className="border rounded px-3 py-2" value={step.description} onChange={(e) => updateContentDraft((next) => { next.home.steps[index].description = e.target.value })} placeholder="Step description" />
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Start My Treatment Comparison</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.comparisonHeading} onChange={(e) => updateContentDraft((next) => { next.home.comparisonHeading = e.target.value })} placeholder="Comparison heading" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.home.comparisonSubtitle} onChange={(e) => updateContentDraft((next) => { next.home.comparisonSubtitle = e.target.value })} placeholder="Comparison subtitle" />
            {contentDraft.home.comparisonRows.map((row, index) => (
              <div key={row.feature + index} className="grid md:grid-cols-3 gap-3 border rounded-lg p-4">
                <input className="border rounded px-3 py-2" value={row.feature} onChange={(e) => updateContentDraft((next) => { next.home.comparisonRows[index].feature = e.target.value })} placeholder="Feature" />
                <input className="border rounded px-3 py-2" value={row.traditional} onChange={(e) => updateContentDraft((next) => { next.home.comparisonRows[index].traditional = e.target.value })} placeholder="Traditional pharmacy" />
                <input className="border rounded px-3 py-2" value={row.online} onChange={(e) => updateContentDraft((next) => { next.home.comparisonRows[index].online = e.target.value })} placeholder="Online pharmacy" />
              </div>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Expert Doctors Section</h2>
              <button type="button" onClick={() => addArrayItem("home.expertPoints", "")} className="bg-slate-900 text-white px-4 py-2 rounded">
                Add Text
              </button>
            </div>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.expertHeading} onChange={(e) => updateContentDraft((next) => { next.home.expertHeading = e.target.value })} placeholder="Expert heading" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.home.expertSubtitle} onChange={(e) => updateContentDraft((next) => { next.home.expertSubtitle = e.target.value })} placeholder="Expert subtitle" />
            {contentDraft.home.expertPoints.map((point, index) => (
              <SortableCard key={`expert-${index}`} index={index} onMove={(from, to) => moveArrayItem("home.expertPoints", from, to)} onRemove={() => removeArrayItem("home.expertPoints", index)}>
                <input className="w-full border rounded px-3 py-2" value={point} onChange={(e) => updateContentDraft((next) => { next.home.expertPoints[index] = e.target.value })} placeholder={`Expert point ${index + 1}`} />
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Media / Video Section</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.mediaHeading} onChange={(e) => updateContentDraft((next) => { next.home.mediaHeading = e.target.value })} placeholder="Media heading" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.home.mediaText} onChange={(e) => updateContentDraft((next) => { next.home.mediaText = e.target.value })} placeholder="Media text" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.mediaEmbedUrl} onChange={(e) => updateContentDraft((next) => { next.home.mediaEmbedUrl = e.target.value })} placeholder="Video embed or YouTube URL" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.mediaPosterImage} onChange={(e) => updateContentDraft((next) => { next.home.mediaPosterImage = e.target.value })} placeholder="Poster image URL" />
            <ImagePicker onImageSelected={(image) => updateContentDraft((next) => { next.home.mediaPosterImage = image })} />
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Reviews Section</h2>
              <button type="button" onClick={() => addArrayItem("home.reviews", { name: "", role: "", quote: "" })} className="bg-slate-900 text-white px-4 py-2 rounded">
                Add Review
              </button>
            </div>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.reviewHeading} onChange={(e) => updateContentDraft((next) => { next.home.reviewHeading = e.target.value })} placeholder="Review heading" />
            {contentDraft.home.reviews.map((review, index) => (
              <SortableCard key={review.name + index} index={index} onMove={(from, to) => moveArrayItem("home.reviews", from, to)} onRemove={() => removeArrayItem("home.reviews", index)}>
                <input className="border rounded px-3 py-2" value={review.name} onChange={(e) => updateContentDraft((next) => { next.home.reviews[index].name = e.target.value })} placeholder="Reviewer name" />
                <input className="border rounded px-3 py-2" value={review.role} onChange={(e) => updateContentDraft((next) => { next.home.reviews[index].role = e.target.value })} placeholder="Reviewer role" />
                <input className="border rounded px-3 py-2 md:col-span-1" value={review.quote} onChange={(e) => updateContentDraft((next) => { next.home.reviews[index].quote = e.target.value })} placeholder="Quote" />
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">FAQ Section</h2>
              <button type="button" onClick={() => addArrayItem("home.faqs", { question: "", answer: "" })} className="bg-slate-900 text-white px-4 py-2 rounded">
                Add FAQ
              </button>
            </div>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.home.faqHeading} onChange={(e) => updateContentDraft((next) => { next.home.faqHeading = e.target.value })} placeholder="FAQ heading" />
            {contentDraft.home.faqs.map((faq, index) => (
              <SortableCard key={faq.question + index} index={index} onMove={(from, to) => moveArrayItem("home.faqs", from, to)} onRemove={() => removeArrayItem("home.faqs", index)}>
                <input className="w-full border rounded px-3 py-2" value={faq.question} onChange={(e) => updateContentDraft((next) => { next.home.faqs[index].question = e.target.value })} placeholder="Question" />
                <textarea className="w-full border rounded px-3 py-2 min-h-20" value={faq.answer} onChange={(e) => updateContentDraft((next) => { next.home.faqs[index].answer = e.target.value })} placeholder="Answer" />
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Extra Home Content Blocks</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => addArrayItem("home.customSections", { type: "text", title: "", description: "", mediaUrl: "", ctaLabel: "", ctaLink: "", width: 1, height: 260 })} className="border px-3 py-2 rounded">
                  Add Text
                </button>
                <button type="button" onClick={() => addArrayItem("home.customSections", { type: "image", title: "", description: "", mediaUrl: "", ctaLabel: "", ctaLink: "", width: 1, height: 260 })} className="border px-3 py-2 rounded">
                  Add Photo
                </button>
                <button type="button" onClick={() => addArrayItem("home.customSections", { type: "video", title: "", description: "", mediaUrl: "", ctaLabel: "", ctaLink: "", width: 1, height: 260 })} className="bg-slate-900 text-white px-3 py-2 rounded">
                  Add Video
                </button>
              </div>
            </div>
            {contentDraft.home.customSections.map((section, index) => (
              <SortableCard key={section.title + index} index={index} onMove={(from, to) => moveArrayItem("home.customSections", from, to)} onRemove={() => removeArrayItem("home.customSections", index)}>
                <select className="w-full border rounded px-3 py-2" value={section.type || "image"} onChange={(e) => updateContentDraft((next) => { next.home.customSections[index].type = e.target.value })}>
                  <option value="text">Text Block</option>
                  <option value="image">Image Block</option>
                  <option value="video">Video Block</option>
                </select>
                <input className="w-full border rounded px-3 py-2" value={section.title} onChange={(e) => updateContentDraft((next) => { next.home.customSections[index].title = e.target.value })} placeholder="Section title" />
                <textarea className="w-full border rounded px-3 py-2 min-h-20" value={section.description} onChange={(e) => updateContentDraft((next) => { next.home.customSections[index].description = e.target.value })} placeholder="Section description" />
                <input className="w-full border rounded px-3 py-2" value={section.mediaUrl} onChange={(e) => updateContentDraft((next) => { next.home.customSections[index].mediaUrl = e.target.value })} placeholder={section.type === "video" ? "Video URL" : "Media URL"} />
                {section.type !== "video" ? <ImagePicker onImageSelected={(image) => updateContentDraft((next) => { next.home.customSections[index].mediaUrl = image })} /> : null}
                <ResizableMediaPreview
                  type={section.type || "image"}
                  mediaUrl={section.mediaUrl}
                  height={section.height || 260}
                  onResizeEnd={(height) => updateContentDraft((next) => { next.home.customSections[index].height = height })}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className="border rounded px-3 py-2" value={section.ctaLabel} onChange={(e) => updateContentDraft((next) => { next.home.customSections[index].ctaLabel = e.target.value })} placeholder="Button label" />
                  <input className="border rounded px-3 py-2" value={section.ctaLink} onChange={(e) => updateContentDraft((next) => { next.home.customSections[index].ctaLink = e.target.value })} placeholder="Button link" />
                </div>
              </SortableCard>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Referral Program Page</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.referral.navLabel} onChange={(e) => updateContentDraft((next) => { next.programs.referral.navLabel = e.target.value })} placeholder="Nav label" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.referral.title} onChange={(e) => updateContentDraft((next) => { next.programs.referral.title = e.target.value })} placeholder="Program title" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.programs.referral.subtitle} onChange={(e) => updateContentDraft((next) => { next.programs.referral.subtitle = e.target.value })} placeholder="Program subtitle" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.referral.rewardText} onChange={(e) => updateContentDraft((next) => { next.programs.referral.rewardText = e.target.value })} placeholder="Reward text" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.referral.heroImage} onChange={(e) => updateContentDraft((next) => { next.programs.referral.heroImage = e.target.value })} placeholder="Hero image URL" />
            <ImagePicker onImageSelected={(image) => updateContentDraft((next) => { next.programs.referral.heroImage = image })} />
            {contentDraft.programs.referral.benefits.map((benefit, index) => (
              <input key={`referral-benefit-${index}`} className="w-full border rounded px-3 py-2" value={benefit} onChange={(e) => updateContentDraft((next) => { next.programs.referral.benefits[index] = e.target.value })} placeholder={`Referral benefit ${index + 1}`} />
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Affiliate Program Page</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.affiliate.navLabel} onChange={(e) => updateContentDraft((next) => { next.programs.affiliate.navLabel = e.target.value })} placeholder="Nav label" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.affiliate.title} onChange={(e) => updateContentDraft((next) => { next.programs.affiliate.title = e.target.value })} placeholder="Program title" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.programs.affiliate.subtitle} onChange={(e) => updateContentDraft((next) => { next.programs.affiliate.subtitle = e.target.value })} placeholder="Program subtitle" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.affiliate.rewardText} onChange={(e) => updateContentDraft((next) => { next.programs.affiliate.rewardText = e.target.value })} placeholder="Reward text" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.programs.affiliate.heroImage} onChange={(e) => updateContentDraft((next) => { next.programs.affiliate.heroImage = e.target.value })} placeholder="Hero image URL" />
            <ImagePicker onImageSelected={(image) => updateContentDraft((next) => { next.programs.affiliate.heroImage = image })} />
            {contentDraft.programs.affiliate.benefits.map((benefit, index) => (
              <input key={`affiliate-benefit-${index}`} className="w-full border rounded px-3 py-2" value={benefit} onChange={(e) => updateContentDraft((next) => { next.programs.affiliate.benefits[index] = e.target.value })} placeholder={`Affiliate benefit ${index + 1}`} />
            ))}
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">About Page</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.about.title} onChange={(e) => updateContentDraft((next) => { next.about.title = e.target.value })} placeholder="About title" />
            <textarea className="w-full border rounded px-3 py-2 min-h-24" value={contentDraft.about.intro} onChange={(e) => updateContentDraft((next) => { next.about.intro = e.target.value })} placeholder="About intro" />
          </section>

          <section className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">Footer</h2>
            <input className="w-full border rounded px-3 py-2" value={contentDraft.footer.companyTagline} onChange={(e) => updateContentDraft((next) => { next.footer.companyTagline = e.target.value })} placeholder="Company tagline" />
            <textarea className="w-full border rounded px-3 py-2 min-h-20" value={contentDraft.footer.notice} onChange={(e) => updateContentDraft((next) => { next.footer.notice = e.target.value })} placeholder="Footer notice" />
            <input className="w-full border rounded px-3 py-2" value={contentDraft.footer.copyright} onChange={(e) => updateContentDraft((next) => { next.footer.copyright = e.target.value })} placeholder="Copyright" />
          </section>

          <button
            onClick={handleSaveContentEditor}
            disabled={busy}
            className="bg-slate-900 text-white px-5 py-2 rounded hover:bg-black disabled:opacity-60 w-full sm:w-auto"
          >
            {busy ? "Saving..." : "Save Visual Content"}
          </button>
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-xl font-semibold">Manage Orders</h2>
            <button onClick={loadOrders} className="bg-white border px-4 py-2 rounded w-full sm:w-auto">
              Refresh Orders
            </button>
          </div>
          {ordersLoading ? <p className="text-slate-600">Loading orders...</p> : null}
          {!ordersLoading && orders.length === 0 ? <p className="text-slate-600">No orders yet.</p> : null}
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{order.user?.name} ({order.user?.email})</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                {order.items.map((item) => (
                  <p key={`${order._id}-${item.product}`}>{item.name} x {item.quantity}</p>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  className="border rounded px-3 py-2"
                  value={order.orderStatus}
                  onChange={(e) => handleUpdateOrder(order._id, { orderStatus: e.target.value })}
                  disabled={orderSavingId === String(order._id)}
                >
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
                <select
                  className="border rounded px-3 py-2"
                  value={order.paymentStatus}
                  onChange={(e) => handleUpdateOrder(order._id, { paymentStatus: e.target.value })}
                  disabled={orderSavingId === String(order._id)}
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "applications" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-xl font-semibold">Referral And Affiliate Leads</h2>
            <button onClick={loadApplications} className="bg-white border px-4 py-2 rounded w-full sm:w-auto">
              Refresh Leads
            </button>
          </div>
          {applicationsLoading ? <p className="text-slate-600">Loading applications...</p> : null}
          {!applicationsLoading && applications.length === 0 ? <p className="text-slate-600">No partner applications yet.</p> : null}
          {applications.map((application) => (
            <div key={application._id} className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <p className="font-semibold capitalize">{application.programType} application</p>
                  <p className="text-sm text-gray-500">{application.name} ({application.email})</p>
                  {application.phone ? <p className="text-sm text-gray-500">{application.phone}</p> : null}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500">{new Date(application.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{application.website || "No website provided"}</p>
                </div>
              </div>
              {application.audience ? <p className="text-sm text-slate-700"><span className="font-semibold">Audience:</span> {application.audience}</p> : null}
              {application.message ? <p className="text-sm text-slate-700"><span className="font-semibold">Message:</span> {application.message}</p> : null}
              <select
                className="border rounded px-3 py-2 w-full sm:w-auto"
                value={application.status}
                onChange={(e) => handleUpdateApplication(application._id, e.target.value)}
                disabled={applicationSavingId === String(application._id)}
              >
                <option value="new">new</option>
                <option value="reviewing">reviewing</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "referrals" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-xl font-semibold">Referral Registrations</h2>
            <button onClick={loadReferrals} className="bg-white border px-4 py-2 rounded w-full sm:w-auto">
              Refresh Referrals
            </button>
          </div>
          {referralsLoading ? <p className="text-slate-600">Loading referrals...</p> : null}
          {!referralsLoading && referrals.length === 0 ? <p className="text-slate-600">No referred registrations yet.</p> : null}
          {referrals.map((referral) => (
            <div key={referral._id} className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <p className="font-semibold">{referral.name}</p>
                  <p className="text-sm text-gray-500">{referral.email}</p>
                  <p className="text-sm text-gray-500">Registered: {new Date(referral.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold">Reward ${referral.referralRewardAmount || 20}</p>
                  <p className="text-sm text-gray-500">Status: {referral.referralRewardStatus}</p>
                </div>
              </div>
              <div className="text-sm text-slate-700">
                <p><span className="font-semibold">Used code:</span> {referral.referredByCode}</p>
                <p><span className="font-semibold">Referrer:</span> {referral.referredBy?.name} ({referral.referredBy?.email})</p>
              </div>
              <button
                type="button"
                onClick={() => handleMarkReferralPaid(referral._id)}
                disabled={referral.referralRewardStatus === "paid" || referralSavingId === String(referral._id)}
                className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                {referral.referralRewardStatus === "paid"
                  ? "Paid"
                  : referralSavingId === String(referral._id)
                    ? "Updating..."
                    : "Mark Reward Paid"}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "json" ? (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Raw Website Content JSON</h2>
          <p className="text-sm text-gray-600 mb-4">
            Advanced mode for full JSON editing.
          </p>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[420px] font-mono text-sm"
            value={jsonDraft}
            onChange={(e) => setJsonDraft(e.target.value)}
          />
          <div className="mt-4">
            <button
              onClick={saveJsonContent}
              disabled={busy}
              className="bg-slate-900 text-white px-5 py-2 rounded hover:bg-black disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save JSON Content"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProductEditor({ product, isSaving, onSave, onDelete }) {
  const productId = product._id || product.id
  const [draft, setDraft] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    description: product.description,
  })

  useEffect(() => {
    setDraft({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
    })
  }, [product])

  const handleSaveClick = async () => {
    await onSave(productId, draft)
  }

  const handleReset = () => {
    setDraft({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
    })
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 grid md:grid-cols-2 gap-3">
      <input
        className="border rounded px-3 py-2"
        value={draft.name}
        onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
      />
      <input
        className="border rounded px-3 py-2"
        value={draft.category}
        onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
      />
      <input
        className="border rounded px-3 py-2"
        type="number"
        step="0.01"
        value={draft.price}
        onChange={(e) => setDraft((prev) => ({ ...prev, price: e.target.value }))}
      />
      <input
        className="border rounded px-3 py-2"
        value={draft.image}
        onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))}
      />
      <div className="md:col-span-2">
        <ImagePicker onImageSelected={(image) => setDraft((prev) => ({ ...prev, image }))} />
        {draft.image ? <img src={draft.image} alt={draft.name} className="mt-3 h-24 w-24 object-cover rounded" /> : null}
      </div>
      <textarea
        className="border rounded px-3 py-2 md:col-span-2 min-h-20"
        value={draft.description}
        onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
      />
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={isSaving}
          className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-60 w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving}
          className="bg-white border px-4 py-2 rounded disabled:opacity-60 w-full sm:w-auto"
        >
          Reset Row
        </button>
        <button
          type="button"
          onClick={() => onDelete(productId)}
          disabled={isSaving}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-60 w-full sm:w-auto"
        >
          Delete Product
        </button>
      </div>
    </div>
  )
}

function ImagePicker({ onImageSelected }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    onImageSelected(dataUrl)
    e.target.value = ""
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="block w-full text-sm"
    />
  )
}

function SortableCard({ children, index, onMove, onRemove }) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(index))
        e.dataTransfer.effectAllowed = "move"
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        const from = Number(e.dataTransfer.getData("text/plain"))
        setDragOver(false)
        if (!Number.isNaN(from)) onMove(from, index)
      }}
      className="border rounded-lg p-4 space-y-3"
      style={{ backgroundColor: dragOver ? "#f8fafc" : "#ffffff", borderStyle: dragOver ? "dashed" : "solid" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 cursor-move">
          Drag to Reorder
        </div>
        <button type="button" onClick={onRemove} className="text-red-600 text-sm font-medium">
          Remove
        </button>
      </div>
      {children}
    </div>
  )
}

function ResizableMediaPreview({ type, mediaUrl, height, onResizeEnd }) {
  if (!mediaUrl && type !== "text") return null

  return (
    <div>
      <p className="text-sm font-medium mb-2">Resizable Preview</p>
      <div
        className="overflow-auto rounded-lg border"
        style={{ resize: "vertical", minHeight: "180px", height: `${height || 260}px` }}
        onMouseUp={(e) => {
          const nextHeight = Math.max(180, Math.round(e.currentTarget.getBoundingClientRect().height))
          onResizeEnd(nextHeight)
        }}
      >
        {type === "video" ? (
          <iframe
            src={normalizeVideoUrl(mediaUrl)}
            title="Preview"
            className="w-full h-full min-h-[180px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : type === "text" ? (
          <div className="w-full h-full min-h-[180px] bg-slate-100 text-slate-600 flex items-center justify-center p-6 text-center">
            Text block preview
          </div>
        ) : (
          <img src={mediaUrl} alt="Preview" className="w-full h-full min-h-[180px] object-cover" />
        )}
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium">{label}</span>
      <div className="flex gap-3 items-center">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-16" />
        <input
          className="border rounded px-3 py-2 flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${active ? "bg-slate-900 text-white" : "bg-white border"}`}
    >
      {children}
    </button>
  )
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getValueAtPath(object, path) {
  return path.split(".").reduce((current, key) => current[key], object)
}

function normalizeVideoUrl(url) {
  if (!url) return ""
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/")
  }
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/")
  }
  return url
}

export default Admin
