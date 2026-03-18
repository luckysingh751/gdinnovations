import { useSiteData } from "../context/SiteDataContext"

function About() {
  const { content } = useSiteData()

  return (
    <div className="py-14 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">{content.about.title}</h1>
        <p className="text-gray-600 max-w-3xl">
          {content.about.intro}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-lg mb-2">Privacy First</h2>
            <p className="text-sm text-gray-600">
              Discreet categories and clean account flow inspired by leading digital clinics.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-lg mb-2">Trusted Experience</h2>
            <p className="text-sm text-gray-600">
              Product pages, treatment guidance, and clear cart flow for confident decisions.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-lg mb-2">Scalable Platform</h2>
            <p className="text-sm text-gray-600">
              Built with React architecture ready for backend, payments, and admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
