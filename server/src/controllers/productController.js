const Product = require("../models/Product")

const getProducts = async (req, res) => {
  const { search = "", category = "" } = req.query
  const filter = { isActive: true }

  if (category) {
    filter.category = category
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ]
  }

  const products = await Product.find(filter).sort({ createdAt: -1 })
  return res.json(products)
}

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product || !product.isActive) {
    return res.status(404).json({ message: "Product not found" })
  }
  return res.json(product)
}

const createProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body
  if (!name || price === undefined || !category) {
    return res.status(400).json({ message: "Name, price and category are required" })
  }

  const product = await Product.create({
    name,
    description: description || "",
    price: Number(price),
    category,
    image: image || "",
    stock: stock !== undefined ? Number(stock) : 100,
  })

  return res.status(201).json(product)
}

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }

  const updatable = ["name", "description", "price", "category", "image", "stock", "isActive"]
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field]
    }
  })

  await product.save()
  return res.json(product)
}

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }
  product.isActive = false
  await product.save()
  return res.json({ message: "Product removed" })
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
