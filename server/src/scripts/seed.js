const dotenv = require("dotenv")
dotenv.config()

const bcrypt = require("bcryptjs")
const connectDB = require("../config/db")
const User = require("../models/User")
const Product = require("../models/Product")

const products = [
  {
    name: "Performance Tablets",
    price: 29.99,
    category: "sexual-health",
    description: "Confidential support treatment for adult men.",
    image: "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
  },
  {
    name: "Men's Vitality Capsules",
    price: 39.99,
    category: "sexual-health",
    description: "Daily wellness capsules to support vitality.",
    image: "https://images.pexels.com/photos/3683080/pexels-photo-3683080.jpeg",
  },
  {
    name: "Fat Burner Supplement",
    price: 34.99,
    category: "weight-loss",
    description: "Weight-management supplement for active adults.",
    image: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
  },
]

const runSeed = async () => {
  try {
    await connectDB()

    const adminEmail = "admin@gdinnovations.com"
    const adminPassword = "Admin@12345"

    let admin = await User.findOne({ email: adminEmail })
    if (!admin) {
      const hashed = await bcrypt.hash(adminPassword, 10)
      admin = await User.create({
        name: "GD Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      })
      console.log("Admin user created:", adminEmail)
    } else {
      console.log("Admin already exists:", adminEmail)
    }

    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany(products)
      console.log("Sample products inserted")
    } else {
      console.log("Products already exist, skipped seeding")
    }

    console.log("Seed complete")
    process.exit(0)
  } catch (error) {
    console.error("Seed failed:", error.message)
    process.exit(1)
  }
}

runSeed()
