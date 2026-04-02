const dotenv = require("dotenv")
dotenv.config()

require("express-async-errors")
const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "CLIENT_URL"]

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_xxxxxxxxxxxxxxxxxxxxx") {
  console.warn("Warning: STRIPE_SECRET_KEY is missing or using the placeholder value. Stripe checkout will not complete until you replace it.")
}

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()
