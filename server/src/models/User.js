const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    referralCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    referredByCode: { type: String, default: "", uppercase: true, trim: true },
    referralRewardStatus: {
      type: String,
      enum: ["none", "pending", "paid"],
      default: "none",
    },
    referralRewardAmount: { type: Number, default: 0 },
    referralPaidAt: { type: Date, default: null },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
