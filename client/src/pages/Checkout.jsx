import { useContext, useMemo, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { apiRequest, authHeaders } from "../lib/api"
import { useSiteData } from "../context/SiteDataContext"

function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { cartItems, clearCart } = useContext(CartContext)
  const { isAuthenticated, token } = useAuth()
  const { content, products } = useSiteData()
  const { theme } = content
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Canada",
    paymentMethod: "cod",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const buyNowId = searchParams.get("buyNow")
  const buyNowProduct = buyNowId
    ? products.find((item) => String(item._id || item.id) === String(buyNowId))
    : null

  const checkoutItems = buyNowProduct
    ? [{ ...buyNowProduct, quantity: 1 }]
    : cartItems

  const total = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [checkoutItems]
  )

  const orderItems = checkoutItems.map((item) => ({
    productId: item._id || item.id,
    quantity: item.quantity,
  }))

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!checkoutItems.length) return
    setLoading(true)
    setError("")

    try {
      const order = await apiRequest("/orders", {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            line1: formData.line1,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      })

      if (formData.paymentMethod === "stripe") {
        const session = await apiRequest("/payments/create-checkout-session", {
          method: "POST",
          headers: authHeaders(token),
          body: JSON.stringify({ items: orderItems, orderId: order._id }),
        })

        if (session?.url) {
          window.location.href = session.url
          return
        }
      }

      if (!buyNowProduct) {
        clearCart()
      }
      navigate("/account", { state: { orderId: order._id } })
    } catch (err) {
      setError(err.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold mb-4 text-slate-100">Checkout</h1>
        <p className="text-slate-300 mb-5">Please sign in before checkout.</p>
        <Link to="/login" className="px-5 py-2 rounded inline-block" style={{ backgroundColor: theme.accentColor, color: "#fff" }}>
          Login to Continue
        </Link>
      </div>
    )
  }

  if (!checkoutItems.length) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold mb-4 text-slate-100">Checkout</h1>
        <p className="text-slate-300 mb-5">{buyNowId ? "This product is unavailable right now." : "Your cart is empty."}</p>
        <Link to="/shop" className="px-5 py-2 rounded inline-block" style={{ backgroundColor: theme.accentColor, color: "#fff" }}>
          Go to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid lg:grid-cols-[1.3fr_0.7fr] gap-6 sm:gap-8 text-slate-100">
      <form onSubmit={handlePlaceOrder} className="rounded-xl border p-6 space-y-4" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="border rounded px-3 py-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} placeholder="Full name" value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))} required />
          <input className="border rounded px-3 py-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} required />
          <input className="border rounded px-3 py-2 md:col-span-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} placeholder="Address line" value={formData.line1} onChange={(e) => setFormData((prev) => ({ ...prev, line1: e.target.value }))} required />
          <input className="border rounded px-3 py-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} placeholder="City" value={formData.city} onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))} required />
          <input className="border rounded px-3 py-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} placeholder="Province" value={formData.province} onChange={(e) => setFormData((prev) => ({ ...prev, province: e.target.value }))} required />
          <input className="border rounded px-3 py-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} placeholder="Postal code" value={formData.postalCode} onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))} required />
          <select className="border rounded px-3 py-2 text-slate-100" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.12)" }} value={formData.paymentMethod} onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}>
            <option value="cod">Place order now (demo)</option>
            <option value="stripe">Pay online with Stripe</option>
          </select>
        </div>

        {error ? <p className="text-red-600">{error}</p> : null}

        <button disabled={loading} className="px-5 py-3 rounded disabled:opacity-60 w-full sm:w-auto" style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}>
          {loading ? "Processing..." : formData.paymentMethod === "stripe" ? "Continue to Stripe" : "Place Order"}
        </button>
      </form>

      <div className="rounded-xl border p-6 h-fit" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}>
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3 text-sm text-slate-300">
          {checkoutItems.map((item) => (
            <div key={item._id || item.id} className="flex justify-between gap-3">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-semibold" style={{ borderColor: "rgba(214,226,239,0.1)" }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default Checkout
