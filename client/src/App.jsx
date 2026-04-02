import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Category from "./pages/Category"
import Admin from "./pages/Admin"
import Account from "./pages/Account"
import Checkout from "./pages/Checkout"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import CheckoutCancel from "./pages/CheckoutCancel"
import ProgramPage from "./pages/ProgramPage"
import StartTreatment from "./pages/StartTreatment"
import { useSiteData } from "./context/SiteDataContext"

function App() {
  const { content } = useSiteData()
  const { theme } = content

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(180deg, ${theme.pageBackgroundStart} 0%, ${theme.pageBackgroundMiddle} 52%, ${theme.pageBackgroundEnd} 100%)`,
      }}
    >
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/start-treatment" element={<StartTreatment />} />
          <Route path="/referral" element={<ProgramPage />} />
          <Route path="/affiliate" element={<ProgramPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
