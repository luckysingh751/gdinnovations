const Stripe = require("stripe")
const Product = require("../models/Product")
const Order = require("../models/Order")

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe secret key is not configured" })
  }

  const { items = [], orderId = "" } = req.body
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

  let order = null
  if (orderId) {
    order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout/cancel${order ? `?order_id=${order._id}` : ""}`,
    metadata: {
      userId: String(req.user._id),
      orderId: order ? String(order._id) : "",
    },
  })

  if (order) {
    order.stripeSessionId = session.id
    await order.save()
  }

  return res.json({ id: session.id, url: session.url })
}

const verifyCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe secret key is not configured" })
  }

  const { sessionId } = req.query
  if (!sessionId) {
    return res.status(400).json({ message: "sessionId is required" })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (!session) {
    return res.status(404).json({ message: "Checkout session not found" })
  }

  const orderId = session.metadata?.orderId
  let order = null

  if (orderId) {
    order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (order) {
      order.stripeSessionId = session.id
      if (session.payment_status === "paid") {
        order.paymentStatus = "paid"
        if (order.orderStatus === "pending") {
          order.orderStatus = "processing"
        }
      }
      await order.save()
    }
  }

  return res.json({
    sessionId: session.id,
    paymentStatus: session.payment_status,
    order,
  })
}

module.exports = { createCheckoutSession, verifyCheckoutSession }
