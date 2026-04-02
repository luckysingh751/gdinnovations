const mongoose = require("mongoose")

const partnerApplicationSchema = new mongoose.Schema(
  {
    programType: {
      type: String,
      enum: ["referral", "affiliate"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    audience: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "approved", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("PartnerApplication", partnerApplicationSchema)
