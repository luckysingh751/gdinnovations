import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { apiRequest, authHeaders } from "../lib/api"
import { useSiteData } from "../context/SiteDataContext"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const { token, isAuthenticated } = useAuth()
  const { content } = useSiteData()
  const { clearCart } = useContext(CartContext)
  const { theme } = content
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [order, setOrder] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState("")

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    const verifySession = async () => {
      if (!isAuthenticated || !sessionId) {
        setLoading(false)
        if (!sessionId) setError("Missing Stripe session information.")
        return
      }

      try {
        const result = await apiRequest(`/payments/verify-session?sessionId=${encodeURIComponent(sessionId)}`, {
          headers: authHeaders(token),
        })
        setOrder(result.order || null)
        setPaymentStatus(result.paymentStatus || "")
        if (result.paymentStatus === "paid") {
          clearCart()
        }
      } catch (err) {
        setError(err.message || "Unable to verify payment.")
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [searchParams, token, isAuthenticated, clearCart])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <div
        className="rounded-3xl border p-8 shadow-xl"
        style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accentColor }}>
          Payment Update
        </p>
        <h1 className="text-3xl font-bold mb-4">Checkout Complete</h1>

        {loading ? <p className="text-slate-300">Verifying your payment...</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}

        {!loading && !error ? (
          <div className="space-y-4">
            <p className="text-slate-300">
              {paymentStatus === "paid"
                ? "Your payment was confirmed and your order is now in processing."
                : "Your session completed, but payment confirmation is still pending."}
            </p>
            {order ? (
              <div className="rounded-2xl border p-4 text-sm text-slate-300" style={{ borderColor: "rgba(214,226,239,0.1)", backgroundColor: "#132238" }}>
                <p><span className="font-semibold text-slate-100">Order:</span> #{order._id.slice(-6).toUpperCase()}</p>
                <p><span className="font-semibold text-slate-100">Payment:</span> {order.paymentStatus}</p>
                <p><span className="font-semibold text-slate-100">Status:</span> {order.orderStatus}</p>
              </div>
            ) : null}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/account" className="px-5 py-3 rounded-lg font-semibold text-center" style={{ backgroundColor: theme.accentColor, color: "#fff" }}>
                View My Orders
              </Link>
              <Link to="/shop" className="px-5 py-3 rounded-lg border text-center text-slate-100" style={{ borderColor: "rgba(214,226,239,0.16)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CheckoutSuccess
