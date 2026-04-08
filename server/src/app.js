const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")

const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const contentRoutes = require("./routes/contentRoutes")
const programRoutes = require("./routes/programRoutes")
const { notFound, errorHandler } = require("./middleware/errorHandler")

const app = express()
const defaultOrigins = [
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]
const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]

app.set("trust proxy", 1)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/i.test(origin)
      ) {
        return callback(null, true)
      }
      return callback(new Error("CORS origin not allowed"))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.options("*", cors())
app.use(express.json({ limit: "1mb" }))
app.use(morgan("dev"))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "gdinnovations-api" })
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/content", contentRoutes)
app.use("/api/programs", programRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
