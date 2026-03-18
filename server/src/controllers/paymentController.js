const Stripe = require("stripe")
const Product = require("../models/Product")

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe secret key is not configured" })
  }

  const { items = [] } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items are required" })
  }

  const productIds = items.map((item) => item.productId)
  const products = await Product.find({ _id: { $in: productIds }, isActive: true })
  const productsMap = new Map(products.map((p) => [String(p._id), p]))

  const lineItems = items
    .map((item) => {
      const product = productsMap.get(String(item.productId))
      if (!product) return null
      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: Math.max(1, Number(item.quantity) || 1),
      }
    })
    .filter(Boolean)

  if (lineItems.length === 0) {
    return res.status(400).json({ message: "No valid items provided" })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: { userId: String(req.user._id) },
  })

  return res.json({ id: session.id, url: session.url })
}

module.exports = { createCheckoutSession }
