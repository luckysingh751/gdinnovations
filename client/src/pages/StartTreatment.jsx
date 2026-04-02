import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSiteData } from "../context/SiteDataContext"
import { useAuth } from "../context/AuthContext"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"

const journeySteps = [
  "Register",
  "Assessment",
  "Doctor Review",
  "Select Treatment",
  "Delivery",
]

function StartTreatment() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { products, content } = useSiteData()
  const { addToCart } = useContext(CartContext)
  const [step, setStep] = useState(isAuthenticated ? 1 : 0)
  const [assessment, setAssessment] = useState({
    category: "sexual-health",
    priority: "fast-results",
    support: true,
    notes: "",
  })

  const recommendedProducts = useMemo(
    () => products.filter((product) => product.category === assessment.category).slice(0, 3),
    [products, assessment.category]
  )

  const handleBuyNow = (productId) => {
    navigate(`/checkout?buyNow=${encodeURIComponent(productId)}`)
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-100">
        <div className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: content.theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: content.theme.accentColor }}>
            Start Treatment
          </p>
          <h1 className="text-4xl font-bold mt-3">Begin your care journey online</h1>
          <p className="text-slate-300 mt-4 max-w-2xl">
            Registration is the first step. Once you create your account, the guided assessment,
            doctor review, treatment selection, and delivery journey will continue automatically.
          </p>
          <div className="grid sm:grid-cols-5 gap-3 mt-8">
            {journeySteps.map((item, index) => (
              <div key={item} className="rounded-2xl border p-4" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                <p className="text-xs font-semibold text-slate-400">STEP {index + 1}</p>
                <p className="font-semibold mt-2">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/register?redirect=%2Fstart-treatment"
              className="px-6 py-3 rounded-xl font-semibold text-center"
              style={{ backgroundColor: content.theme.accentColor, color: "#ffffff" }}
            >
              Register to Start Treatment
            </Link>
            <Link to="/login?redirect=%2Fstart-treatment" className="px-6 py-3 rounded-xl border text-center">
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-slate-100">
      <div className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: content.theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: content.theme.accentColor }}>
          Guided Treatment Journey
        </p>
        <h1 className="text-4xl font-bold mt-3">Start your online treatment</h1>
        <p className="text-slate-300 mt-4">
          Finish the assessment, review the doctor guidance, select products, and move to delivery.
        </p>

        <div className="grid sm:grid-cols-5 gap-3 mt-8">
          {journeySteps.map((item, index) => (
            <div
              key={item}
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: index <= step ? "rgba(215,178,109,0.16)" : "#132238",
                borderColor: index <= step ? "rgba(215,178,109,0.45)" : "rgba(214,226,239,0.08)",
              }}
            >
              <p className="text-xs font-semibold text-slate-400">STEP {index + 1}</p>
              <p className="font-semibold mt-2">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {step === 1 ? (
        <section className="rounded-3xl shadow-xl p-6 sm:p-8 space-y-4 border" style={{ backgroundColor: content.theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <h2 className="text-2xl font-bold">Online Assessment</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              className="border rounded-xl px-4 py-3 text-white"
              style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
              value={assessment.category}
              onChange={(e) => setAssessment((prev) => ({ ...prev, category: e.target.value }))}
            >
              {content.home.treatments.map((treatment) => (
                <option key={treatment.slug} value={treatment.slug}>
                  {treatment.title}
                </option>
              ))}
            </select>
            <select
              className="border rounded-xl px-4 py-3 text-white"
              style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
              value={assessment.priority}
              onChange={(e) => setAssessment((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option value="fast-results">I want fast results</option>
              <option value="balanced-care">I want a balanced plan</option>
              <option value="doctor-guidance">I want more doctor guidance</option>
            </select>
            <textarea
              className="border rounded-xl px-4 py-3 md:col-span-2 min-h-28 text-white placeholder:text-slate-500"
              style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
              placeholder="Add notes for the clinician review"
              value={assessment.notes}
              onChange={(e) => setAssessment((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <button
            onClick={() => setStep(2)}
            className="px-6 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: content.theme.accentColor, color: "#ffffff" }}
          >
            Submit Assessment
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rounded-3xl shadow-xl p-6 sm:p-8 space-y-4 border" style={{ backgroundColor: content.theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <h2 className="text-2xl font-bold">Doctor Review</h2>
          <p className="text-slate-300">
            Based on your assessment, our care flow would route this request for clinician review.
            For the demo, we are moving you to recommended products in your selected category.
          </p>
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
            <p className="font-semibold">Selected treatment focus</p>
            <p className="text-slate-300 mt-2">{assessment.category.replace("-", " ")}</p>
          </div>
          <button
            onClick={() => setStep(3)}
            className="px-6 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: content.theme.accentColor, color: "#ffffff" }}
          >
            View Recommended Treatments
          </button>
        </section>
      ) : null}

      {step >= 3 ? (
        <section className="rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 border" style={{ backgroundColor: content.theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Select Treatment</h2>
              <p className="text-slate-300 mt-2">Choose one or more products and move directly to checkout.</p>
            </div>
            <Link to={`/category/${assessment.category}`} className="font-semibold" style={{ color: content.theme.accentColor }}>
              View full category
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <div key={product._id || product.id} className="rounded-2xl border p-4" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                <img src={product.image} alt={product.name} className="w-full h-40 rounded-xl object-cover" />
                <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
                <p className="text-sm text-slate-300 mt-2">{product.description}</p>
                <p className="font-bold mt-3">${product.price}</p>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product)
                      setStep(4)
                    }}
                    className="w-full px-4 py-2 rounded-xl font-semibold"
                    style={{ backgroundColor: content.theme.accentSoft, color: content.theme.buttonText }}
                  >
                    Add To Treatment Plan
                  </button>
                  <button
                    onClick={() => handleBuyNow(product._id || product.id)}
                    className="w-full px-4 py-2 rounded-xl font-semibold"
                    style={{ backgroundColor: content.theme.accentColor, color: "#ffffff" }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {step >= 4 ? (
        <section className="rounded-3xl shadow-xl p-6 sm:p-8 space-y-4 border" style={{ backgroundColor: content.theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <h2 className="text-2xl font-bold">Delivery And 24/7 Support</h2>
          <p className="text-slate-300">
            Your selected products are now ready in the cart. Continue to checkout to complete delivery details and keep ongoing patient support available from your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: content.theme.accentColor, color: "#ffffff" }}
            >
              Continue To Delivery
            </button>
            <Link to="/cart" className="px-6 py-3 rounded-xl border text-center">
              Review Cart
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default StartTreatment
