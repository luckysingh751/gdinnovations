const PartnerApplication = require("../models/PartnerApplication")

const applyToProgram = async (req, res) => {
  const { programType } = req.params
  const { name, email, phone, website, audience, message } = req.body

  if (!["referral", "affiliate"].includes(programType)) {
    return res.status(400).json({ message: "Invalid program type" })
  }

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" })
  }

  const application = await PartnerApplication.create({
    programType,
    name,
    email,
    phone: phone || "",
    website: website || "",
    audience: audience || "",
    message: message || "",
  })

  return res.status(201).json({
    message: "Application submitted successfully",
    application,
  })
}

const getApplications = async (req, res) => {
  const applications = await PartnerApplication.find({}).sort({ createdAt: -1 })
  return res.json(applications)
}

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body
  const application = await PartnerApplication.findById(req.params.id)

  if (!application) {
    return res.status(404).json({ message: "Application not found" })
  }

  if (status) {
    application.status = status
  }

  await application.save()
  return res.json(application)
}

module.exports = {
  applyToProgram,
  getApplications,
  updateApplicationStatus,
}
