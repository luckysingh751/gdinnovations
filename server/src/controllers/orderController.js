const Order = require("../models/Order")
const Product = require("../models/Product")

const createOrder = async (req, res) => {
  const { items = [], shippingAddress = {} } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" })
  }

  const productIds = items.map((item) => item.productId)
  const products = await Product.find({ _id: { $in: productIds }, isActive: true })
  const productsMap = new Map(products.map((p) => [String(p._id), p]))

  const normalizedItems = []
  let totalAmount = 0

  for (const item of items) {
    const product = productsMap.get(String(item.productId))
    if (!product) {
      return res.status(400).json({ message: `Invalid product: ${item.productId}` })
    }

    const quantity = Number(item.quantity) || 1
    const lineTotal = product.price * quantity
    totalAmount += lineTotal

    normalizedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
  }

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    totalAmount,
    shippingAddress,
  })

  return res.status(201).json(order)
}

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  return res.json(orders)
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 })
  return res.json(orders)
}

const updateOrderStatus = async (req, res) => {
  const { orderStatus, paymentStatus } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ message: "Order not found" })
  }

  if (orderStatus) order.orderStatus = orderStatus
  if (paymentStatus) order.paymentStatus = paymentStatus
  await order.save()

  return res.json(order)
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus }
