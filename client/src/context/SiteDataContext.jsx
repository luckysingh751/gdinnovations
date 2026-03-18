import { createContext, useContext, useEffect, useMemo, useState } from "react"
import defaultProducts from "../data/products"

const SiteDataContext = createContext(null)

const STORAGE_KEYS = {
  products: "gdinnovations_products_v1",
  content: "gdinnovations_content_v1",
}

const defaultContent = {
  site: {
    brandName: "GD Innovations",
    topBarText: "Licensed care experience inspired by modern telehealth stores",
    topBarRight: "Secure Checkout",
  },
  home: {
    heroTitle: "Modern Online Pharmacy For Everyday Care",
    heroSubtitle:
      "Explore expert-curated treatments for sexual health, weight loss, hairfall, and diabetes care with a clean, private and fast checkout experience.",
    heroImage:
      "https://images.pexels.com/photos/5726706/pexels-photo-5726706.jpeg",
    primaryButtonLabel: "Shop All",
    secondaryButtonLabel: "Learn More",
    treatmentHeading: "Special Treatments",
    featuredHeading: "Featured Products",
    treatments: [
      {
        slug: "sexual-health",
        title: "Sexual Health",
        description: "Discreet support and treatment options.",
        image: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg",
      },
      {
        slug: "weight-loss",
        title: "Weight Loss",
        description: "Clinically guided plans and products.",
        image: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg",
      },
      {
        slug: "hairfall",
        title: "Hairfall",
        description: "Scalp and regrowth focused care.",
        image: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg",
      },
      {
        slug: "diabetes",
        title: "Diabetes",
        description: "Daily glucose and metabolic support.",
        image: "https://images.pexels.com/photos/6941884/pexels-photo-6941884.jpeg",
      },
    ],
    steps: [
      {
        title: "Choose Treatment",
        description: "Browse categories and compare options by need.",
      },
      {
        title: "Secure Checkout",
        description: "Add items to cart and proceed with secure payment.",
      },
      {
        title: "Fast Delivery",
        description: "Track your order directly from your account dashboard.",
      },
    ],
  },
  about: {
    title: "About GD Innovations",
    intro:
      "GD Innovations is a modern pharmacy e-commerce platform concept focused on private care journeys, category-based treatment discovery, and secure checkout.",
  },
  footer: {
    companyTagline: "Digital pharmacy storefront prototype.",
    notice: "For demo use only. Follow Canadian pharmacy regulations for production.",
    copyright: "Copyright 2026 GD Innovations. All rights reserved.",
  },
}

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function SiteDataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.products)
    return stored ? safeParse(stored, defaultProducts) : defaultProducts
  })

  const [content, setContent] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.content)
    return stored ? safeParse(stored, defaultContent) : defaultContent
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(content))
  }, [content])

  const addProduct = (productInput) => {
    const nextId =
      products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1
    const newProduct = {
      id: nextId,
      name: productInput.name?.trim() || "New Product",
      price: Number(productInput.price) || 0,
      category: productInput.category?.trim() || "general",
      description: productInput.description?.trim() || "",
      image: productInput.image?.trim() || "",
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              ...updates,
              price: updates.price !== undefined ? Number(updates.price) || 0 : item.price,
            }
          : item
      )
    )
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)))
  }

  const updateContent = (updater) => {
    setContent((prev) => (typeof updater === "function" ? updater(prev) : prev))
  }

  const replaceContent = (nextContent) => {
    setContent(nextContent)
  }

  const resetAllData = () => {
    setProducts(defaultProducts)
    setContent(defaultContent)
  }

  const value = useMemo(
    () => ({
      products,
      content,
      addProduct,
      updateProduct,
      deleteProduct,
      updateContent,
      replaceContent,
      resetAllData,
      defaultContent,
    }),
    [products, content]
  )

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error("useSiteData must be used inside SiteDataProvider")
  }
  return context
}
