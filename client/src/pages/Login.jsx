import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const accentColor = "#5bc0be"
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const redirectPath = new URLSearchParams(location.search).get("redirect")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = await login(formData.email, formData.password)
      navigate(user.role === "admin" ? "/admin" : redirectPath || "/")
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-transparent">
      <div className="p-10 rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] w-full max-w-md border text-slate-100" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.12)" }}>
        <h1 className="text-3xl font-bold text-center mb-3">Login</h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Admin demo: admin@gdinnovations.com / Admin@12345
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full border p-3 rounded-xl text-white placeholder:text-slate-500"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(214,226,239,0.14)" }}
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full border p-3 rounded-xl text-white placeholder:text-slate-500"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(214,226,239,0.14)" }}
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>

          {error ? (
            <p className="text-sm rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl transition disabled:opacity-60 font-semibold"
            style={{ backgroundColor: accentColor, color: "#08111f" }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-400 text-center mt-5">
          Need an account? <Link to={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`} style={{ color: accentColor }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
