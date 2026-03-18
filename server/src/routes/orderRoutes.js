const express = require("express")
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController")
const { protect, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.post("/", protect, createOrder)
router.get("/my", protect, getMyOrders)
router.get("/", protect, requireAdmin, getAllOrders)
router.patch("/:id/status", protect, requireAdmin, updateOrderStatus)

module.exports = router
