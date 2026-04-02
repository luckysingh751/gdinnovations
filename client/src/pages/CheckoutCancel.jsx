import { Link, useSearchParams } from "react-router-dom"
import { useSiteData } from "../context/SiteDataContext"

function CheckoutCancel() {
  const [searchParams] = useSearchParams()
  const { content } = useSiteData()
  const { theme } = content
  const orderId = searchParams.get("order_id")

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-slate-100">
      <div
        className="rounded-3xl border p-8 shadow-xl"
        style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.1)" }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: theme.accentSoft }}>
          Payment Not Completed
        </p>
        <h1 className="text-3xl font-bold mb-4">Checkout Was Cancelled</h1>
        <p className="text-slate-300 mb-6">
          Your order was created, but payment was not completed. You can return to your cart and try again.
        </p>
        {orderId ? (
          <p className="text-sm text-slate-400 mb-6">
            Pending order reference: #{orderId.slice(-6).toUpperCase()}
          </p>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/cart" className="px-5 py-3 rounded-lg font-semibold text-center" style={{ backgroundColor: theme.accentColor, color: "#fff" }}>
            Return To Cart
          </Link>
          <Link to="/account" className="px-5 py-3 rounded-lg border text-center text-slate-100" style={{ borderColor: "rgba(214,226,239,0.16)", backgroundColor: "rgba(255,255,255,0.03)" }}>
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCancel
