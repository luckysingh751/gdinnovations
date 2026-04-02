import { useSiteData } from "../context/SiteDataContext"

function About() {
  const { content } = useSiteData()
  const { theme } = content

  return (
    <div className="py-14 text-slate-100" style={{ backgroundColor: "transparent" }}>
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">{content.about.title}</h1>
        <p className="text-slate-300 max-w-3xl">
          {content.about.intro}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="rounded-2xl shadow p-6 border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
            <h2 className="font-semibold text-lg mb-2">Privacy First</h2>
            <p className="text-sm text-slate-300">
              Discreet categories and clean account flow inspired by leading digital clinics.
            </p>
          </div>
          <div className="rounded-2xl shadow p-6 border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
            <h2 className="font-semibold text-lg mb-2">Trusted Experience</h2>
            <p className="text-sm text-slate-300">
              Product pages, treatment guidance, and clear cart flow for confident decisions.
            </p>
          </div>
          <div className="rounded-2xl shadow p-6 border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
            <h2 className="font-semibold text-lg mb-2">Scalable Platform</h2>
            <p className="text-sm text-slate-300">
              Built with React architecture ready for backend, payments, and admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
