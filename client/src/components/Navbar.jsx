import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useSiteData } from "../context/SiteDataContext"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { cartItems } = useContext(CartContext)
  const { content } = useSiteData()
  const { isAuthenticated, isAdmin, logout, user } = useAuth()
  const { theme } = content
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
      setMenuOpen(false)
      setSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/")
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="relative z-[80]">
      <div
        className="text-xs"
        style={{ backgroundColor: theme.headerBarBg, color: theme.headerBarText }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
          <p className="text-center sm:text-left">{content.site.topBarText}</p>
          <p className="text-center sm:text-right">{content.site.topBarRight}</p>
        </div>
      </div>

      <nav
        className="shadow-[0_12px_36px_rgba(0,0,0,0.35)] border-b border-white/5"
        style={{ backgroundColor: theme.headerBarBg }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold"
            style={{ color: theme.accentColor }}
            onClick={closeMenu}
          >
            {content.site.brandName}
          </Link>

          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex w-[min(68vw,30rem)]">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search treatments, products..."
                  className="px-4 py-3 rounded-l-2xl w-full min-w-0 text-white placeholder:text-slate-400 border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(214,226,239,0.16)",
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-r-none font-medium shrink-0"
                  style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-4 py-3 rounded-r-2xl font-medium shrink-0 border"
                  style={{
                    color: theme.headerBarText,
                    borderColor: "rgba(214,226,239,0.16)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  Close
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="h-11 w-11 rounded-full flex items-center justify-center border"
                style={{
                  color: theme.headerBarText,
                  borderColor: "rgba(214,226,239,0.22)",
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
                aria-label="Open search"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            )}

            <button
              type="button"
              className="border rounded-full px-4 py-2 text-sm flex items-center gap-3"
              style={{
                borderColor: "rgba(214,226,239,0.22)",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: theme.headerBarText,
              }}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open navigation menu"
            >
              <span className="flex flex-col gap-1">
                <span className="block w-5 h-0.5" style={{ backgroundColor: theme.headerBarText }}></span>
                <span className="block w-5 h-0.5" style={{ backgroundColor: theme.headerBarText }}></span>
                <span className="block w-5 h-0.5" style={{ backgroundColor: theme.headerBarText }}></span>
              </span>
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>

        <div className={`${menuOpen ? "block" : "hidden"}`}>
          <div className="max-w-7xl mx-auto px-4 pb-5">
            <div
              className="rounded-[28px] border shadow-[0_22px_60px_rgba(0,0,0,0.45)] p-5 sm:p-6 space-y-6"
              style={{
                borderColor: "rgba(214,226,239,0.14)",
                backgroundColor: "#0d1726",
              }}
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 text-sm">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Explore
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Link to="/" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100 hover:text-white" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Home</Link>
                    <Link to="/shop" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100 hover:text-white" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Shop</Link>
                    <Link to="/about" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100 hover:text-white" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>About</Link>
                    <Link to="/start-treatment" onClick={closeMenu} className="rounded-2xl border px-4 py-4 font-semibold hover:brightness-105 transition" style={{ backgroundColor: theme.accentSoft, color: theme.buttonText }}>Start Treatment</Link>
                    <Link to="/referral" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100 hover:text-white" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>{content.programs.referral.navLabel}</Link>
                    <Link to="/affiliate" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100 hover:text-white" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>{content.programs.affiliate.navLabel}</Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Account
                  </p>
                  <div className="grid gap-3">
                    {isAuthenticated && !isAdmin ? <Link to="/account" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Account</Link> : null}
                    {!isAuthenticated ? <Link to="/login" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Login</Link> : null}
                    {!isAuthenticated ? <Link to="/register?redirect=%2Fstart-treatment" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Register</Link> : null}
                    {isAdmin ? <Link to="/admin" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Admin</Link> : null}
                    <Link to="/cart" onClick={closeMenu} className="rounded-2xl border px-4 py-4 transition text-slate-100" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>Cart ({totalItems})</Link>
                    {isAuthenticated ? (
                      <button onClick={handleLogout} className="text-left rounded-2xl border px-4 py-4 transition text-slate-100" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.03)" }}>
                        Logout
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
                  Popular Treatments
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  {content.home.treatments.map((treatment) => (
                    <Link key={treatment.slug} to={`/category/${treatment.slug}`} onClick={closeMenu} className="rounded-full border px-4 py-2 transition text-slate-200" style={{ borderColor: "rgba(214,226,239,0.14)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      {treatment.title}
                    </Link>
                  ))}
                </div>
              </div>
              {user ? <p className="text-xs text-slate-500">Signed in as {user.name}</p> : null}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
