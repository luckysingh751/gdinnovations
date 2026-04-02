import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { apiRequest, authHeaders } from "../lib/api"
import { useSiteData } from "../context/SiteDataContext"

function Account() {
  const { user, isAuthenticated, token } = useAuth()
  const { content } = useSiteData()
  const { theme } = content
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }
      try {
        const data = await apiRequest("/orders/my", {
          headers: authHeaders(token),
        })
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [isAuthenticated, token])

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold mb-4 text-slate-100">Your Account</h1>
        <p className="text-slate-300 mb-5">Please sign in to view your orders.</p>
        <Link to="/login" className="px-5 py-2 rounded inline-block" style={{ backgroundColor: theme.accentColor, color: "#fff" }}>
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">My Account</h1>
        <p className="text-slate-400 mt-1">Signed in as {user?.name}</p>
      </div>

      {loading ? <p className="text-slate-300">Loading orders...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}
      {!loading && !error && orders.length === 0 ? (
        <div className="rounded-xl border p-6" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}>
          <p className="text-slate-300 mb-4">You have no orders yet.</p>
          <Link to="/shop" className="px-5 py-2 rounded inline-block" style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}>
            Start Shopping
          </Link>
        </div>
      ) : null}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-slate-400">Payment: {order.paymentStatus}</p>
                <p className="text-sm text-slate-400">Status: {order.orderStatus}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              {order.items.map((item) => (
                <p key={`${order._id}-${item.product}`}>{item.name} x {item.quantity}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Account
