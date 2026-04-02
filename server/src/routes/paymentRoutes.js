const express = require("express")
const { createCheckoutSession, verifyCheckoutSession } = require("../controllers/paymentController")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/create-checkout-session", protect, createCheckoutSession)
router.get("/verify-session", protect, verifyCheckoutSession)

module.exports = router
