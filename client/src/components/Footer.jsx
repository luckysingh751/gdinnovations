import { useSiteData } from "../context/SiteDataContext"

function Footer() {
  const { content } = useSiteData()
  const { theme } = content

  return (
    <footer className="py-12 mt-12 border-t" style={{ backgroundColor: theme.footerBg, color: theme.footerText, borderColor: "rgba(214,226,239,0.08)" }}>
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
      <p className="text-center text-xs text-slate-500 mt-8">{content.footer.copyright}</p>
    </footer>
  )
}

export default Footer
