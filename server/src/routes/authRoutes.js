const express = require("express")
const rateLimit = require("express-rate-limit")
const { register, login, me, myReferrals, allReferrals, markReferralPaid } = require("../controllers/authController")
const { protect, requireAdmin } = require("../middleware/auth")

const router = express.Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again in 15 minutes." },
})

router.post("/register", authLimiter, register)
router.post("/login", authLimiter, login)
router.get("/me", protect, me)
router.get("/referrals/my", protect, myReferrals)
router.get("/referrals", protect, requireAdmin, allReferrals)
router.patch("/referrals/:id/pay", protect, requireAdmin, markReferralPaid)

module.exports = router
