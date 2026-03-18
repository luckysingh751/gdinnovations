import { useSiteData } from "../context/SiteDataContext"

function Footer() {
  const { content } = useSiteData()

  return (
    <footer className="bg-slate-900 text-slate-200 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <p className="font-semibold text-white mb-2">{content.site.brandName}</p>
          <p>{content.footer.companyTagline}</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Categories</p>
          <p>{content.home.treatments.map((item) => item.title).join(", ")}</p>
        </div>
        <div className="md:text-right">
          <p className="font-semibold text-white mb-2">Notice</p>
          <p>{content.footer.notice}</p>
        </div>
      </div>
      <p className="text-center text-xs text-slate-400 mt-8">{content.footer.copyright}</p>
    </footer>
  )
}

export default Footer
