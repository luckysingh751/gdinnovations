import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function Home() {
  const { products, content, loading } = useSiteData()
  const featuredProducts = products.slice(0, 3)
  const { theme } = content
  const videoEmbedUrl = normalizeVideoUrl(content.home.mediaEmbedUrl)

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-slate-300">Loading homepage...</div>
  }

  return (
    <div
      className="text-slate-100"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${theme.pageBackgroundStart}, ${theme.pageBackgroundMiddle}, ${theme.pageBackgroundEnd})`,
      }}
    >
      <section
        className="text-white py-16"
        style={{
          backgroundImage: `linear-gradient(to right, ${theme.heroGradientStart}, ${theme.heroGradientMiddle}, ${theme.heroGradientEnd})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              {content.home.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 mb-8">
              {content.home.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop"
                className="px-6 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}
              >
                {content.home.primaryButtonLabel}
              </Link>
              <Link
                to="/about"
                className="bg-white/10 border border-white/20 px-6 py-3 rounded-lg hover:bg-white/20"
              >
                {content.home.secondaryButtonLabel}
              </Link>
            </div>
            <div className="grid gap-3 mt-8">
              {content.home.heroHighlights?.map((item, index) => (
                <div key={item + index} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {(content.home.heroSupportImages || []).map((image, index) => (
                <img
                  key={image + index}
                  src={image}
                  alt={`Care highlight ${index + 1}`}
                  className="w-full h-28 rounded-2xl object-cover border border-white/10"
                />
              ))}
            </div>
          </div>
          <img
            src={content.home.heroImage}
            alt="Pharmacy consultation"
            className="w-full rounded-2xl shadow-xl object-cover h-[240px] sm:h-[320px]"
          />
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl shadow-xl overflow-hidden border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-0">
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r" style={{ borderColor: "rgba(214,226,239,0.08)" }}>
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
                {content.home.comparisonHeading}
              </p>
              <h2 className="text-3xl font-bold mt-3">Why patients switch to online care</h2>
              <p className="text-slate-300 mt-3">{content.home.comparisonSubtitle}</p>
              <Link
                to="/shop"
                className="inline-block mt-6 px-5 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
              >
                Start my treatment
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead style={{ backgroundColor: "#132238" }}>
                  <tr>
                    <th className="text-left px-4 py-4">Feature</th>
                    <th className="text-left px-4 py-4">Normal Pharmacy</th>
                    <th className="text-left px-4 py-4">Online Pharmacy</th>
                  </tr>
                </thead>
                <tbody>
                  {content.home.comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-t" style={{ borderColor: "rgba(214,226,239,0.08)" }}>
                      <td className="px-4 py-4 font-semibold">{row.feature}</td>
                      <td className="px-4 py-4 text-slate-300">{row.traditional}</td>
                      <td className="px-4 py-4 text-slate-100">{row.online}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{content.home.galleryHeading}</h2>
            <p className="text-slate-300 mt-2 max-w-3xl">{content.home.gallerySubtitle}</p>
          </div>
          <Link to="/referral" className="text-sm font-semibold" style={{ color: theme.accentColor }}>
            Become our partner
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5 rounded-[28px] border p-5 sm:p-6" style={{ backgroundColor: "#0b1626", borderColor: "rgba(214,226,239,0.08)" }}>
          {content.home.galleryImages.map((image, index) => (
            <div key={image + index} className="overflow-hidden rounded-2xl shadow-lg border" style={{ borderColor: "rgba(214,226,239,0.08)" }}>
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="h-56 w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-[28px] border p-5 sm:p-6" style={{ backgroundColor: "#0a1423", borderColor: "rgba(214,226,239,0.08)" }}>
        <h2 className="text-2xl font-bold mb-6">{content.home.treatmentHeading}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.home.treatments.map((treatment) => (
            <Link
              key={treatment.slug}
              to={`/category/${treatment.slug}`}
              className="group rounded-xl shadow overflow-hidden hover:shadow-xl transition border"
              style={{ backgroundColor: theme.treatmentCardBg }}
            >
              <div className="overflow-hidden">
                <img src={treatment.image} alt={treatment.title} className="h-36 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 group-hover:translate-x-1 transition">{treatment.title}</h3>
                <p className="text-sm text-slate-300">{treatment.description}</p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="rounded-[28px] border p-5 sm:p-6" style={{ backgroundColor: "#0b1626", borderColor: "rgba(214,226,239,0.08)" }}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold">How this online pharmacy works</h2>
          <p className="text-slate-300 mt-2">From online assessment to delivery and 24/7 support, patients stay guided at every step.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {content.home.steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl shadow p-6 border" style={{ backgroundColor: theme.stepCardBg, borderColor: "rgba(214,226,239,0.08)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: theme.accentColor }}>STEP {index + 1}</p>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
              Expert insight
            </p>
            <h2 className="text-3xl font-bold mt-3">{content.home.expertHeading}</h2>
            <p className="text-slate-300 mt-3">{content.home.expertSubtitle}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {content.home.expertPoints.map((point, index) => (
                <div key={index} className="rounded-2xl p-4 border" style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}>
                  <p className="font-semibold mb-2" style={{ color: theme.accentColor }}>Doctor Note {index + 1}</p>
                  <p className="text-sm text-slate-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl shadow-xl overflow-hidden">
            <img
              src={content.home.galleryImages[0] || content.home.heroImage}
              alt="Expert doctor section"
              className="w-full h-[360px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
            {videoEmbedUrl ? (
              <div className="aspect-video">
                <iframe
                  src={videoEmbedUrl}
                  title={content.home.mediaHeading}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={content.home.mediaPosterImage}
                alt={content.home.mediaHeading}
                className="w-full h-[320px] object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
              Media
            </p>
            <h2 className="text-3xl font-bold mt-3">{content.home.mediaHeading}</h2>
            <p className="text-slate-300 mt-3">{content.home.mediaText}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/affiliate"
                className="px-5 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}
              >
                Become an affiliate
              </Link>
              <Link to="/referral" className="px-5 py-3 rounded-lg border text-slate-100" style={{ borderColor: "rgba(214,226,239,0.16)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                Join referral program
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">{content.home.reviewHeading}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.home.reviews.map((review, index) => (
            <div
              key={review.name + index}
              className="rounded-3xl shadow-lg p-6 border transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#17253b"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.cardBg
              }}
            >
              <p className="text-lg leading-8 text-slate-200">"{review.quote}"</p>
              <div className="mt-6">
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-slate-400">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
          {content.home.featuredHeading}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {content.home.customSections.map((section, index) => (
            <div
              key={section.title + index}
              className="grid sm:grid-cols-[0.9fr_1.1fr] rounded-3xl shadow-lg overflow-hidden border transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#17253b"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.cardBg
              }}
            >
              {section.type === "video" ? (
                <div className="w-full h-full bg-black" style={{ minHeight: `${section.height || 220}px` }}>
                  <iframe
                    src={normalizeVideoUrl(section.mediaUrl)}
                    title={section.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : section.type === "text" ? (
                <div className="w-full h-full flex items-center justify-center p-8 text-center text-slate-300 bg-[#132238]" style={{ minHeight: `${section.height || 220}px` }}>
                  {section.description}
                </div>
              ) : (
                <img src={section.mediaUrl} alt={section.title} className="w-full h-full object-cover" style={{ minHeight: `${section.height || 220}px` }} />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold">{section.title}</h3>
                <p className="text-slate-300 mt-3">{section.description}</p>
                <Link
                  to={section.ctaLink}
                  className="inline-block mt-5 px-5 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
                >
                  {section.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl shadow-xl p-6 sm:p-8 border" style={{ backgroundColor: theme.cardBg, borderColor: "rgba(214,226,239,0.08)" }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
                FAQ
              </p>
              <h2 className="text-3xl font-bold mt-2">{content.home.faqHeading}</h2>
            </div>
            <Link to="/about" className="font-semibold" style={{ color: theme.accentColor }}>
              Need more answers?
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {content.home.faqs.map((faq, index) => (
              <details
                key={faq.question + index}
                className="rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: "#132238", borderColor: "rgba(214,226,239,0.08)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1a2c45"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#132238"
                }}
              >
                <summary className="font-semibold cursor-pointer">{faq.question}</summary>
                <p className="text-slate-300 mt-3 text-sm leading-6">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function normalizeVideoUrl(url) {
  if (!url) return ""
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/")
  }
  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/")
  }
  return url
}

export default Home
