import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useSiteData } from "../context/SiteDataContext"

function Navbar() {
  const { cartItems } = useContext(CartContext)
  const { content } = useSiteData()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-slate-900 text-slate-100 text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex justify-between">
          <p>{content.site.topBarText}</p>
          <p>{content.site.topBarRight}</p>
        </div>
      </div>

      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap gap-3 justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-cyan-700">
            {content.site.brandName}
          </Link>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto order-3 md:order-none">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatments, products..."
              className="border px-3 py-2 rounded-l w-full md:w-80"
            />
            <button
              type="submit"
              className="bg-amber-400 text-black px-4 py-2 rounded-r font-medium"
            >
              Search
            </button>
          </form>

          <div className="space-x-4 md:space-x-6 text-sm md:text-base">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/cart">Cart ({totalItems})</Link>
          </div>
        </div>
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex flex-wrap gap-4 text-sm text-slate-600">
            {content.home.treatments.map((treatment) => (
              <Link key={treatment.slug} to={`/category/${treatment.slug}`}>
                {treatment.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
