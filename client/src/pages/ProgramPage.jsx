import { Link, useLocation } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSiteData } from "../context/SiteDataContext"
import { useAuth } from "../context/AuthContext"
import { apiRequest, authHeaders } from "../lib/api"

function ProgramPage() {
  const location = useLocation()
  const { content } = useSiteData()
  const { user, token, isAuthenticated } = useAuth()
  const { theme } = content
  const programType = location.pathname.includes("affiliate") ? "affiliate" : "referral"
  const program = content.programs?.[programType]
  const formRef = useRef(null)
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    website: "",
    audience: "",
    message: "",
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [referralData, setReferralData] = useState({ referralCode: "", referralLink: "", referrals: [] })
  const [referralLoading, setReferralLoading] = useState(false)

  const introText = useMemo(
    () =>
      programType === "referral"
        ? "Share your network, help people start treatment, and earn $20 per successful referral."
        : "Apply as a content, clinic, or audience partner and build affiliate campaigns with GD Innovations.",
    [programType]
  )

  useEffect(() => {
    const loadReferralData = async () => {
      if (programType !== "referral" || !isAuthenticated) return
      setReferralLoading(true)
      try {
        const data = await apiRequest("/auth/referrals/my", {
          headers: authHeaders(token),
        })
        setReferralData(data)
      } catch (err) {
        setError(err.message || "Unable to load referral data")
      } finally {
        setReferralLoading(false)
      }
    }

    loadReferralData()
  }, [programType, isAuthenticated, token])

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
        <Link to="/" className="font-semibold" style={{ color: theme.accentColor }}>
          Return home
        </Link>
      </div>
    )
  }

  if (programType === "referral") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-slate-100">
        <section className="grid lg:grid-cols-[1fr_1fr] gap-8 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
              Referral Program
            </p>
            <h1 className="text-4xl font-bold mt-3">{program.title}</h1>
            <p className="text-slate-300 mt-4 text-lg">{program.subtitle}</p>
            <div className="mt-6 rounded-2xl p-5 shadow border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
              <p className="text-sm text-slate-400">Reward</p>
              <p className="text-2xl font-bold mt-1">{program.rewardText}</p>
            </div>
            <p className="text-slate-300 mt-4">{introText}</p>
            {!isAuthenticated ? (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to="/register?redirect=%2Freferral" className="px-6 py-3 rounded-lg font-semibold text-center" style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}>
                  Start Referral
                </Link>
                <Link to="/login?redirect=%2Freferral" className="px-6 py-3 rounded-lg border text-center text-slate-100" style={{ borderColor: "rgba(214,226,239,0.16)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                  I already have an account
                </Link>
              </div>
            ) : null}
          </div>
          <img src={program.heroImage} alt={program.title} className="w-full h-[360px] rounded-3xl object-cover shadow-xl" />
        </section>

        {isAuthenticated ? (
          <section className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold">Your Referral Code</h2>
                <p className="text-slate-300 mt-2">Share this code or link with new users. When they register using it, the admin can track and pay your reward.</p>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(referralData.referralLink || referralData.referralCode)}
                className="px-5 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}
              >
                Copy Link
              </button>
            </div>

            {referralLoading ? <p className="text-slate-300 mt-6">Loading your referral code...</p> : null}
            {!referralLoading ? (
              <div className="grid lg:grid-cols-2 gap-6 mt-6">
                <div className="rounded-2xl border p-5" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                  <p className="text-sm text-slate-400">Referral code</p>
                  <p className="text-3xl font-bold mt-2 tracking-[0.2em]">{referralData.referralCode || user?.referralCode}</p>
                  <p className="text-sm text-slate-400 mt-4 break-all">{referralData.referralLink}</p>
                </div>
                <div className="rounded-2xl border p-5" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                  <p className="text-sm text-slate-400">Referral signups</p>
                  <p className="text-3xl font-bold mt-2">{referralData.referrals.length}</p>
                  <p className="text-sm text-slate-400 mt-4">Each successful referred registration can earn you $20 after admin payout.</p>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
          <h2 className="text-2xl font-bold mb-6">How referral rewards work</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              "Create your account and get your personal referral code automatically.",
              "Share your code or referral link with anyone you want to refer.",
              "When they register using your code, admin can track and pay your $20 reward.",
            ].map((benefit, index) => (
              <div key={benefit + index} className="rounded-2xl border p-5" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.accentColor }}>
                  Step {index + 1}
                </p>
                <p className="text-slate-200">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {isAuthenticated ? (
          <section className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
            <h2 className="text-2xl font-bold mb-6">Your referred registrations</h2>
            {referralData.referrals.length === 0 ? (
              <p className="text-slate-300">No one has registered with your code yet.</p>
            ) : (
              <div className="space-y-4">
                {referralData.referrals.map((referral) => (
                  <div key={referral._id} className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:justify-between gap-3" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                    <div>
                      <p className="font-semibold">{referral.name}</p>
                      <p className="text-sm text-slate-400">{referral.email}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-slate-300">Reward: ${referral.referralRewardAmount || 20}</p>
                      <p className="text-sm text-slate-400">Status: {referral.referralRewardStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-slate-100">
      <section className="grid lg:grid-cols-[1fr_1fr] gap-8 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
            Partner Program
          </p>
          <h1 className="text-4xl font-bold mt-3">{program.title}</h1>
          <p className="text-slate-300 mt-4 text-lg">{program.subtitle}</p>
          <div className="mt-6 rounded-2xl p-5 shadow border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
            <p className="text-sm text-slate-400">Reward</p>
            <p className="text-2xl font-bold mt-1">{program.rewardText}</p>
          </div>
          <p className="text-slate-300 mt-4">{introText}</p>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="mt-6 px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
          >
            {program.ctaLabel}
          </button>
        </div>
        <img src={program.heroImage} alt={program.title} className="w-full h-[360px] rounded-3xl object-cover shadow-xl" />
      </section>

      <section className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
        <h2 className="text-2xl font-bold mb-6">Why join this program</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {program.benefits.map((benefit, index) => (
            <div key={benefit + index} className="rounded-2xl border p-5" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.accentColor }}>
                Benefit {index + 1}
              </p>
              <p className="text-slate-200">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={formRef} className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: "#0f1a2b", borderColor: "rgba(214,226,239,0.08)" }}>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold">{program.formHeading}</h2>
          <p className="text-slate-300 mt-2">{program.formDescription}</p>
        </div>

        <form
          className="mt-8 grid md:grid-cols-2 gap-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setLoading(true)
            setError("")
            setSuccess("")
            try {
              await apiRequest(`/programs/${programType}/apply`, {
                method: "POST",
                body: JSON.stringify(formData),
              })
              setSuccess(`${program.title} application submitted successfully.`)
              setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phone: "",
                website: "",
                audience: "",
                message: "",
              })
            } catch (err) {
              setError(err.message || "Application failed")
            } finally {
              setLoading(false)
            }
          }}
        >
          <input
            className="border rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
            style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="border rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
            style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="border rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
            style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <input
            className="border rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
            style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
            placeholder={programType === "affiliate" ? "Website or channel" : "Referral website or social link"}
            value={formData.website}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          />
          <input
            className="border rounded-xl px-4 py-3 md:col-span-2 text-white placeholder:text-slate-500"
            style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
            placeholder="Audience, network, or referral source"
            value={formData.audience}
            onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
          />
          <textarea
            className="border rounded-xl px-4 py-3 md:col-span-2 min-h-28 text-white placeholder:text-slate-500"
            style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
            placeholder="Tell us how you want to partner"
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          />
          {error ? <p className="md:col-span-2 text-red-600">{error}</p> : null}
          {success ? <p className="md:col-span-2 text-emerald-700">{success}</p> : null}
          <button
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold w-full md:w-fit disabled:opacity-60"
            style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
          >
            {loading ? "Submitting..." : program.ctaLabel}
          </button>
        </form>
      </section>
    </div>
  )
}

export default ProgramPage
