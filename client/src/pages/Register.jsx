import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()
  const accentColor = "#5bc0be"
  const referralFromQuery = new URLSearchParams(location.search).get("ref") || ""
  const [formData, setFormData] = useState({ name: "", email: "", password: "", referralCode: referralFromQuery })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await register(formData.name, formData.email, formData.password, formData.referralCode)
      navigate(redirectPath)
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="p-10 rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] w-full max-w-md border text-slate-100" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.12)" }}>
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-3 rounded-xl text-white placeholder:text-slate-500" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(214,226,239,0.14)" }} placeholder="Full name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
          <input className="w-full border p-3 rounded-xl text-white placeholder:text-slate-500" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(214,226,239,0.14)" }} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} />
          <input className="w-full border p-3 rounded-xl text-white placeholder:text-slate-500" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(214,226,239,0.14)" }} type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} />
          <input className="w-full border p-3 rounded-xl text-white placeholder:text-slate-500" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(214,226,239,0.14)" }} placeholder="Referral code (optional)" value={formData.referralCode} onChange={(e) => setFormData((prev) => ({ ...prev, referralCode: e.target.value.toUpperCase() }))} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={loading} className="w-full py-3 rounded-xl disabled:opacity-60 font-semibold" style={{ backgroundColor: accentColor, color: "#08111f" }}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-5">
          Already have an account? <Link to="/login" style={{ color: accentColor }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
