import { createContext, useContext, useEffect, useState } from "react"
import defaultProducts from "../data/products"
import { apiRequest, authHeaders } from "../lib/api"
import { useAuth } from "./AuthContext"

const SiteDataContext = createContext(null)

const defaultContent = {
  theme: {
    pageBackgroundStart: "#08111f",
    pageBackgroundMiddle: "#091321",
    pageBackgroundEnd: "#0b1422",
    heroGradientStart: "#09111d",
    heroGradientMiddle: "#10253b",
    heroGradientEnd: "#1a3654",
    accentColor: "#5bc0be",
    accentSoft: "#d7b26d",
    buttonText: "#08111f",
    headerBarBg: "#050b14",
    headerBarText: "#d6e2ef",
    footerBg: "#050b14",
    footerText: "#c8d5e3",
    treatmentCardBg: "#142033",
    stepCardBg: "#101b2c",
    cardBg: "#0f1a2b",
  },
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
    heroSupportImages: [
      "https://images.pexels.com/photos/8460370/pexels-photo-8460370.jpeg",
      "https://images.pexels.com/photos/7580253/pexels-photo-7580253.jpeg",
    ],
    heroHighlights: [
      "Licensed clinicians and pharmacists in one care journey",
      "Confidential treatment plans with discreet delivery",
      "Fast digital onboarding and ongoing support",
    ],
    primaryButtonLabel: "Shop All",
    secondaryButtonLabel: "Learn More",
    treatmentHeading: "Special Treatments",
    featuredHeading: "Featured Products",
    galleryHeading: "Built for private, modern care",
    gallerySubtitle: "Add more visuals, clinic stories, and treatment journeys right from the admin panel.",
    galleryImages: [
      "https://images.pexels.com/photos/8460370/pexels-photo-8460370.jpeg",
      "https://images.pexels.com/photos/7580253/pexels-photo-7580253.jpeg",
      "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg",
    ],
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
        title: "Online Assessment",
        description: "Register and complete a private online assessment in minutes.",
      },
      {
        title: "Doctor Review",
        description: "An expert clinician reviews the case and confirms the right treatment path.",
      },
      {
        title: "Quick Checkout",
        description: "Pay securely online and manage your order from your account dashboard.",
      },
      {
        title: "Delivery And Support",
        description: "Receive discreet delivery plus ongoing 24/7 support after registration.",
      },
    ],
    comparisonHeading: "Start My Treatment",
    comparisonSubtitle: "See why patients choose a modern online pharmacy experience.",
    comparisonRows: [
      { feature: "Waiting time", traditional: "Long queues and pharmacy visits", online: "No waiting room, begin from home" },
      { feature: "Doctor access", traditional: "Limited appointment windows", online: "Quick virtual assessment and faster review" },
      { feature: "Delivery", traditional: "Pick up in person", online: "Fast and discreet delivery" },
      { feature: "Privacy", traditional: "Public counters and in-store discussion", online: "Confidential care journey and checkout" },
    ],
    expertHeading: "See what our expert doctors say about Mens Health",
    expertSubtitle: "Use this section for doctor-approved guidance, educational notes, or specialist insights.",
    expertPoints: [
      "Early treatment leads to better confidence and better health outcomes.",
      "Private digital care helps more men ask for help sooner.",
      "Personalized treatment matters more than one-size-fits-all advice.",
      "Ongoing support improves consistency, follow-up, and long-term results.",
    ],
    faqHeading: "Frequently Asked Questions",
    faqs: [
      {
        question: "How do I start treatment online?",
        answer: "Create an account, complete the assessment, and choose your treatment plan from the dashboard.",
      },
      {
        question: "Is my consultation private?",
        answer: "Yes. Orders, messaging, and delivery are designed to stay confidential and discreet.",
      },
      {
        question: "How fast is delivery?",
        answer: "Delivery timing depends on region, but the goal is a quick and trackable experience after approval.",
      },
      {
        question: "Can I get ongoing support?",
        answer: "Yes. Registered patients can receive continued support, follow-up guidance, and order tracking.",
      },
    ],
    reviewHeading: "What patients are saying",
    reviews: [
      {
        name: "Arjun S.",
        role: "Mens Health Patient",
        quote: "The process was smooth, private, and much easier than booking everything offline.",
      },
      {
        name: "Daniel R.",
        role: "Weight Loss Patient",
        quote: "I liked being able to compare treatments at home and check out quickly.",
      },
      {
        name: "Jaspreet K.",
        role: "Hairfall Patient",
        quote: "Fast support and discreet delivery made the experience feel modern and trustworthy.",
      },
    ],
    mediaHeading: "Watch how digital care works",
    mediaText: "Add a video link from YouTube, Vimeo, or Loom to explain your care process, patient onboarding, or treatment education.",
    mediaEmbedUrl: "",
    mediaPosterImage: "https://images.pexels.com/photos/5214946/pexels-photo-5214946.jpeg",
    customSections: [
      {
        type: "image",
        title: "Extra Content Block One",
        description: "Use this block for future campaigns, landing-page copy, or a new service launch.",
        mediaUrl: "https://images.pexels.com/photos/6129686/pexels-photo-6129686.jpeg",
        ctaLabel: "Learn More",
        ctaLink: "/about",
        width: 1,
        height: 260,
      },
      {
        type: "image",
        title: "Extra Content Block Two",
        description: "Use this second block for additional headings, education content, or a promotional banner.",
        mediaUrl: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg",
        ctaLabel: "Explore Programs",
        ctaLink: "/affiliate",
        width: 1,
        height: 260,
      },
    ],
  },
  programs: {
    referral: {
      navLabel: "Referral",
      title: "Referral Program",
      subtitle: "Invite friends and earn $20 for every successful referral.",
      rewardText: "$20 earned per referral",
      formHeading: "Start Referral",
      formDescription: "Submit your details to get your referral setup and share-ready information.",
      heroImage: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg",
      benefits: [
        "Share a personal referral link with friends or patients.",
        "Earn $20 after every verified referral order.",
        "Track referrals and payouts from your account dashboard.",
      ],
      ctaLabel: "Start Referring",
    },
    affiliate: {
      navLabel: "Affiliate",
      title: "Affiliate Partner Program",
      subtitle: "Partner with GD Innovations and promote trusted online care journeys.",
      rewardText: "Custom affiliate rewards and campaign bonuses",
      formHeading: "Apply For Affiliate Access",
      formDescription: "Share your audience details and we will review your application.",
      heroImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
      benefits: [
        "Use banners, links, and landing pages to drive traffic.",
        "Get campaign-ready content and conversion-focused pages.",
        "Expand with custom payouts, reporting, and exclusive promotions.",
      ],
      ctaLabel: "Become A Partner",
    },
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

function mergeContentWithDefaults(content = {}) {
  return {
    ...defaultContent,
    ...content,
    theme: { ...defaultContent.theme, ...(content.theme || {}) },
    site: { ...defaultContent.site, ...(content.site || {}) },
    home: {
      ...defaultContent.home,
      ...(content.home || {}),
      heroSupportImages: content.home?.heroSupportImages || defaultContent.home.heroSupportImages,
      heroHighlights: content.home?.heroHighlights || defaultContent.home.heroHighlights,
      galleryImages: content.home?.galleryImages || defaultContent.home.galleryImages,
      treatments: content.home?.treatments || defaultContent.home.treatments,
      steps: content.home?.steps || defaultContent.home.steps,
      comparisonRows: content.home?.comparisonRows || defaultContent.home.comparisonRows,
      expertPoints: content.home?.expertPoints || defaultContent.home.expertPoints,
      faqs: content.home?.faqs || defaultContent.home.faqs,
      reviews: content.home?.reviews || defaultContent.home.reviews,
      customSections: content.home?.customSections || defaultContent.home.customSections,
    },
    programs: {
      referral: { ...defaultContent.programs.referral, ...(content.programs?.referral || {}) },
      affiliate: { ...defaultContent.programs.affiliate, ...(content.programs?.affiliate || {}) },
    },
    about: { ...defaultContent.about, ...(content.about || {}) },
    footer: { ...defaultContent.footer, ...(content.footer || {}) },
  }
}

export function SiteDataProvider({ children }) {
  const { token } = useAuth()
  const [products, setProducts] = useState(defaultProducts)
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  const mergeSavedProduct = (savedProduct) => {
    const savedId = String(savedProduct?._id || savedProduct?.id || "")
    if (!savedId) return

    setProducts((currentProducts) => {
      const withoutSaved = currentProducts.filter((item) => String(item._id || item.id) !== savedId)
      return [savedProduct, ...withoutSaved]
    })
  }

  const refreshProducts = async () => {
    const productsData = await apiRequest("/products")
    setProducts(Array.isArray(productsData) && productsData.length > 0 ? productsData : defaultProducts)
  }

  useEffect(() => {
    const loadSiteData = async () => {
      setLoading(true)
      try {
        const [productsData, contentData] = await Promise.all([
          apiRequest("/products"),
          apiRequest("/content").catch(() => ({})),
        ])
        setProducts(Array.isArray(productsData) && productsData.length > 0 ? productsData : defaultProducts)
        setContent(mergeContentWithDefaults(contentData))
      } catch {
        setProducts(defaultProducts)
        setContent(defaultContent)
      } finally {
        setLoading(false)
      }
    }

    loadSiteData()
  }, [])

  const addProduct = async (productInput) => {
    const created = await apiRequest("/products", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(productInput),
    })
    mergeSavedProduct(created)
    return created
  }

  const updateProduct = async (id, updates) => {
    const updated = await apiRequest(`/products/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(updates),
    })
    mergeSavedProduct(updated)
    return updated
  }

  const deleteProduct = async (id) => {
    await apiRequest(`/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
    setProducts((currentProducts) =>
      currentProducts.filter((item) => String(item._id || item.id) !== String(id))
    )
  }

  const replaceContent = async (nextContent) => {
    const saved = await apiRequest("/content", {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ content: nextContent }),
    })
    setContent(mergeContentWithDefaults(saved))
  }

  return (
    <SiteDataContext.Provider
      value={{
        products,
        content,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        replaceContent,
        defaultContent,
        refreshProducts,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error("useSiteData must be used inside SiteDataProvider")
  }
  return context
}
