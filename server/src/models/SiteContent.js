const mongoose = require("mongoose")

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    content: { type: Object, default: {} },
  },
  { timestamps: true }
)

module.exports = mongoose.model("SiteContent", siteContentSchema)
