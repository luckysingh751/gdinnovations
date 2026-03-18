const express = require("express")
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController")
const { protect, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", protect, requireAdmin, createProduct)
router.put("/:id", protect, requireAdmin, updateProduct)
router.delete("/:id", protect, requireAdmin, deleteProduct)

module.exports = router
