import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useSiteData } from "../context/SiteDataContext"

function Home() {
  const { products, content } = useSiteData()
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="bg-gradient-to-b from-slate-100 via-sky-50 to-teal-50">
      <section className="bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              {content.home.heroTitle}
            </h1>
            <p className="text-lg text-slate-200 mb-8">
              {content.home.heroSubtitle}
            </p>
            <div className="flex gap-3">
              <Link
                to="/shop"
                className="bg-emerald-300 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-200"
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
          </div>
          <img
            src={content.home.heroImage}
            alt="Pharmacy consultation"
            className="w-full rounded-2xl shadow-xl object-cover h-[320px]"
          />
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{content.home.treatmentHeading}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.home.treatments.map((treatment) => (
            <Link
              key={treatment.slug}
              to={`/category/${treatment.slug}`}
              className="bg-sky-50 rounded-xl shadow overflow-hidden hover:shadow-lg transition border border-sky-100"
            >
              <img src={treatment.image} alt={treatment.title} className="h-36 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">{treatment.title}</h3>
                <p className="text-sm text-gray-600">{treatment.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="grid md:grid-cols-3 gap-5">
          {content.home.steps.map((step, index) => (
            <div key={step.title} className="bg-teal-50 rounded-xl shadow p-6 border border-teal-100">
              <p className="text-xs text-teal-700 font-semibold mb-2">STEP {index + 1}</p>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          {content.home.featuredHeading}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
