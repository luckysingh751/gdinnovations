const express = require("express")
const {
  applyToProgram,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/programController")
const { protect, requireAdmin } = require("../middleware/auth")

const router = express.Router()

router.post("/:programType/apply", applyToProgram)
router.get("/applications/all", protect, requireAdmin, getApplications)
router.patch("/applications/:id", protect, requireAdmin, updateApplicationStatus)

module.exports = router
