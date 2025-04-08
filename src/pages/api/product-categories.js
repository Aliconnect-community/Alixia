// This is a server-side API route that securely fetches product categories from WooCommerce
import axios from "axios"

// WooCommerce API credentials
const WOOCOMMERCE_URL = "https://store.aliconnects.com/wp-json/wc/v3"
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "your_consumer_key"
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "your_consumer_secret"

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  try {
    // Build the API URL
    const apiUrl = `${WOOCOMMERCE_URL}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`

    // Make the request to WooCommerce API
    const response = await axios.get(apiUrl)

    // Return the categories
    res.status(200).json(response.data)
  } catch (error) {
    console.error("Error fetching product categories from WooCommerce:", error.message)

    // If we can't connect to WooCommerce, use fallback data
    const fallbackCategories = getFallbackCategories()
    res.status(200).json(fallbackCategories)
  }
}

// Fallback categories
function getFallbackCategories() {
  return [
    { id: 1, name: "Electronics", slug: "electronics", count: 8 },
    { id: 2, name: "Audio", slug: "audio", count: 3 },
    { id: 3, name: "Clothing", slug: "clothing", count: 4 },
    { id: 4, name: "Accessories", slug: "accessories", count: 5 },
    { id: 5, name: "Home", slug: "home", count: 3 },
    { id: 6, name: "Kitchen", slug: "kitchen", count: 2 },
    { id: 7, name: "Fitness", slug: "fitness", count: 1 },
  ]
}

