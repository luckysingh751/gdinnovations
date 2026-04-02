const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

const generateReferralCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const length = Math.floor(Math.random() * 3) + 7
  let code = ""
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

const ensureReferralCode = async (user) => {
  if (user.referralCode) return user.referralCode

  let code = generateReferralCode()
  while (await User.findOne({ referralCode: code })) {
    code = generateReferralCode()
  }

  user.referralCode = code
  await user.save()
  return code
}

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  referralCode: user.referralCode || "",
  referredByCode: user.referredByCode || "",
})

const register = async (req, res) => {
  const { name, email, password, referralCode = "" } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" })
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" })
  }

  let referrer = null
  const normalizedReferralCode = referralCode.trim().toUpperCase()
  if (normalizedReferralCode) {
    referrer = await User.findOne({ referralCode: normalizedReferralCode })
    if (!referrer) {
      return res.status(400).json({ message: "Referral code is invalid" })
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    referredBy: referrer?._id || null,
    referredByCode: referrer?.referralCode || "",
    referralRewardStatus: referrer ? "pending" : "none",
    referralRewardAmount: referrer ? 20 : 0,
  })
  await ensureReferralCode(user)

  const token = signToken(user._id)
  return res.status(201).json({
    token,
    user: serializeUser(user),
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" })
  }
  await ensureReferralCode(user)

  const token = signToken(user._id)
  return res.json({
    token,
    user: serializeUser(user),
  })
}

const me = async (req, res) => {
  await ensureReferralCode(req.user)
  return res.json({ user: serializeUser(req.user) })
}

const myReferrals = async (req, res) => {
  await ensureReferralCode(req.user)
  const referrals = await User.find({ referredBy: req.user._id })
    .select("name email createdAt referralRewardStatus referralRewardAmount referralPaidAt")
    .sort({ createdAt: -1 })

  return res.json({
    referralCode: req.user.referralCode,
    referralLink: `${process.env.CLIENT_URL}/register?ref=${req.user.referralCode}`,
    referrals,
  })
}

const allReferrals = async (req, res) => {
  const referrals = await User.find({ referredBy: { $ne: null } })
    .populate("referredBy", "name email referralCode")
    .select("name email createdAt referredByCode referralRewardStatus referralRewardAmount referralPaidAt referredBy")
    .sort({ createdAt: -1 })

  return res.json(referrals)
}

const markReferralPaid = async (req, res) => {
  const referralUser = await User.findById(req.params.id)
  if (!referralUser || !referralUser.referredBy) {
    return res.status(404).json({ message: "Referral record not found" })
  }

  referralUser.referralRewardStatus = "paid"
  referralUser.referralPaidAt = new Date()
  await referralUser.save()

  const updated = await User.findById(referralUser._id)
    .populate("referredBy", "name email referralCode")
    .select("name email createdAt referredByCode referralRewardStatus referralRewardAmount referralPaidAt referredBy")

  return res.json(updated)
}

module.exports = { register, login, me, myReferrals, allReferrals, markReferralPaid }
