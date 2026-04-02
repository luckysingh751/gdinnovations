const dotenv = require("dotenv")
dotenv.config()

const connectDB = require("../config/db")
const Product = require("../models/Product")

const catalog = [
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
    name: "Intimacy Support Gummies",
    price: 22.99,
    category: "sexual-health",
    description: "A discreet wellness option for routine support.",
    image: "https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg",
  },
  {
    name: "Fat Burner Supplement",
    price: 34.99,
    category: "weight-loss",
    description: "Weight-management supplement for active adults.",
    image: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
  },
  {
    name: "Metabolism Support Powder",
    price: 27.49,
    category: "weight-loss",
    description: "Powdered formula for daily routine support.",
    image: "https://images.pexels.com/photos/6693659/pexels-photo-6693659.jpeg",
  },
  {
    name: "Meal Balance Capsules",
    price: 31.99,
    category: "weight-loss",
    description: "Helps structure a balanced supplement plan.",
    image: "https://images.pexels.com/photos/7615467/pexels-photo-7615467.jpeg",
  },
  {
    name: "Hair Growth Serum",
    price: 44.99,
    category: "hairfall",
    description: "Topical serum to support stronger and fuller hair.",
    image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg",
  },
  {
    name: "Scalp Recovery Shampoo",
    price: 18.99,
    category: "hairfall",
    description: "Gentle cleansing formula for scalp care.",
    image: "https://images.pexels.com/photos/6621338/pexels-photo-6621338.jpeg",
  },
  {
    name: "Hair Nutrition Softgels",
    price: 26.99,
    category: "hairfall",
    description: "Nutrient blend designed for healthy hair support.",
    image: "https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg",
  },
  {
    name: "Diabetes Care Tablets",
    price: 49.99,
    category: "diabetes",
    description: "Routine metabolic support under medical guidance.",
    image: "https://images.pexels.com/photos/6941884/pexels-photo-6941884.jpeg",
  },
  {
    name: "Glucose Check Starter Kit",
    price: 59.99,
    category: "diabetes",
    description: "A home-friendly starter option for routine tracking.",
    image: "https://images.pexels.com/photos/6823616/pexels-photo-6823616.jpeg",
  },
  {
    name: "Sugar Balance Capsules",
    price: 24.99,
    category: "diabetes",
    description: "Daily capsules for lifestyle support routines.",
    image: "https://images.pexels.com/photos/6942070/pexels-photo-6942070.jpeg",
  },
  {
    name: "Immune Support Gummies",
    price: 16.99,
    category: "wellness",
    description: "Daily immune-support gummies with vitamin blend.",
    image: "https://images.pexels.com/photos/5938401/pexels-photo-5938401.jpeg",
  },
  {
    name: "Joint Comfort Capsules",
    price: 28.99,
    category: "wellness",
    description: "Capsules designed to support daily mobility routines.",
    image: "https://images.pexels.com/photos/7615574/pexels-photo-7615574.jpeg",
  },
  {
    name: "Sleep Reset Tablets",
    price: 21.99,
    category: "wellness",
    description: "Night routine tablets for rest and recovery support.",
    image: "https://images.pexels.com/photos/3873196/pexels-photo-3873196.jpeg",
  },
]

async function run() {
  try {
    await connectDB()

    for (const item of catalog) {
      const existing = await Product.findOne({ name: item.name })
      if (!existing) {
        await Product.create(item)
      } else if (!existing.isActive) {
        existing.isActive = true
        existing.price = item.price
        existing.category = item.category
        existing.description = item.description
        existing.image = item.image
        await existing.save()
      }
    }

    const total = await Product.countDocuments({ isActive: true })
    console.log(`Active products available: ${total}`)
    process.exit(0)
  } catch (error) {
    console.error("Product seed failed:", error.message)
    process.exit(1)
  }
}

run()
