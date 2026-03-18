const SiteContent = require("../models/SiteContent")

const getContent = async (req, res) => {
  let doc = await SiteContent.findOne({ key: "main" })
  if (!doc) {
    doc = await SiteContent.create({ key: "main", content: {} })
  }
  return res.json(doc.content)
}

const updateContent = async (req, res) => {
  const { content } = req.body
  if (!content || typeof content !== "object") {
    return res.status(400).json({ message: "Valid content object is required" })
  }

  const updated = await SiteContent.findOneAndUpdate(
    { key: "main" },
    { content },
    { new: true, upsert: true }
  )

  return res.json(updated.content)
}

module.exports = { getContent, updateContent }
