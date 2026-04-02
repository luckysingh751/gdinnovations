const express = require("express")
const { register, login, me, myReferrals, allReferrals, markReferralPaid } = require("../controllers/authController")
const { protect, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, me)
router.get("/referrals/my", protect, myReferrals)
router.get("/referrals", protect, requireAdmin, allReferrals)
router.patch("/referrals/:id/pay", protect, requireAdmin, markReferralPaid)

module.exports = router
