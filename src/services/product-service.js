// This service handles fetching products from the AliConnects store

// Cache for products to avoid repeated requests
let productCache = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 15 // 15 minutes

// Function to search for products on the store
export async function searchProducts(query) {
  try {
    // Get all products first (using cache if available)
    const allProducts = await getAllProducts()

    // If no query, return all products
    if (!query) return allProducts

    // Filter products based on the query
    const lowerCaseQuery = query.toLowerCase()
    const matchedProducts = allProducts.filter((product) => {
      // Check name match
      if (product.name.toLowerCase().includes(lowerCaseQuery)) {
        return true
      }

      // Check description match
      if (product.description.toLowerCase().includes(lowerCaseQuery)) {
        return true
      }

      // Check category match
      if (
        product.categories.some(
          (category) =>
            category.toLowerCase().includes(lowerCaseQuery) || lowerCaseQuery.includes(category.toLowerCase()),
        )
      ) {
        return true
      }

      // Check for partial word matches
      const queryWords = lowerCaseQuery.split(/\s+/)
      for (const word of queryWords) {
        if (word.length < 3) continue // Skip very short words

        if (
          product.name.toLowerCase().includes(word) ||
          product.description.toLowerCase().includes(word) ||
          product.categories.some((cat) => cat.toLowerCase().includes(word))
        ) {
          return true
        }
      }

      return false
    })

    console.log(`Found ${matchedProducts.length} products matching "${query}"`)
    return matchedProducts
  } catch (error) {
    console.error("Error searching for products:", error)
    return getFallbackProducts(query)
  }
}

// Function to get all products (with caching)
export async function getAllProducts() {
  const now = Date.now()

  // Return cached products if they're still fresh
  if (productCache && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using cached products")
    return productCache
  }

  try {
    console.log("Fetching all products from store")

    // Create the API URL for fetching products
    // We'll use a proxy endpoint to avoid CORS issues
    const apiUrl = "/api/products"

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const products = await response.json()

    // Transform the response to our product format if needed
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price || "0"),
      image: product.images && product.images.length > 0 ? product.images[0].src : null,
      url: product.permalink,
      description: product.short_description || product.description || "",
      categories: product.categories ? product.categories.map((cat) => cat.name) : [],
    }))

    // Update cache
    productCache = formattedProducts
    lastFetchTime = now

    return formattedProducts
  } catch (error) {
    console.error("Error fetching all products:", error)

    // If we haven't cached any products yet, use fallback
    if (!productCache) {
      const fallbackProducts = getFallbackProducts()
      productCache = fallbackProducts
      lastFetchTime = now
      return fallbackProducts
    }

    // Otherwise, use the expired cache rather than nothing
    console.log("Using expired product cache")
    return productCache
  }
}

// Function to get featured products
export async function getFeaturedProducts() {
  try {
    // Try to fetch featured products specifically
    const apiUrl = "/api/products?featured=true"

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch featured products: ${response.status}`)
    }

    const products = await response.json()

    // Transform the response to our product format
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price || "0"),
      image: product.images && product.images.length > 0 ? product.images[0].src : null,
      url: product.permalink,
      description: product.short_description || product.description || "",
      categories: product.categories ? product.categories.map((cat) => cat.name) : [],
    }))

    return formattedProducts
  } catch (error) {
    console.error("Error fetching featured products:", error)

    // Fallback: get all products and take the first few
    try {
      const allProducts = await getAllProducts()
      return allProducts.slice(0, 6)
    } catch (innerError) {
      console.error("Error with fallback for featured products:", innerError)
      return getFallbackProducts().slice(0, 6)
    }
  }
}

// Function to get product categories
export async function getProductCategories() {
  try {
    const apiUrl = "/api/product-categories"

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const categories = await response.json()

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.count,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)

    // Fallback: extract categories from all products
    try {
      const allProducts = await getAllProducts()

      // Extract unique categories from all products
      const categories = new Set()
      allProducts.forEach((product) => {
        product.categories.forEach((category) => {
          categories.add(category)
        })
      })

      return Array.from(categories).map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        count: allProducts.filter((p) => p.categories.includes(name)).length,
      }))
    } catch (innerError) {
      console.error("Error with fallback for categories:", innerError)
      return []
    }
  }
}

// Fallback products when API fails
function getFallbackProducts(query = "") {
  const allProducts = getStoreProducts()

  if (!query) {
    return allProducts
  }

  // Filter products based on the query
  const lowerCaseQuery = query.toLowerCase()
  return allProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.categories.some(
        (category) =>
          category.toLowerCase().includes(lowerCaseQuery) || lowerCaseQuery.includes(category.toLowerCase()),
      )
    )
  })
}

// Comprehensive store products based on the actual store
function getStoreProducts() {
  return [
    {
      id: 1,
      name: "HP EliteBook 840 G1",
      price: 139.000,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/09/laptop.jpeg",
      url: "https://store.aliconnects.com/product/hp-elitebook-840-g1/",
      description: "HP EliteBook 840 G1, the epitome of professional elegance and performance. Crafted with precision and designed for the modern business world, this powerhouse of a laptop is a perfect blend of style and substance.",
      categories: ["Electronics", "Audio", "laptops", "Hp", "Wireless"],
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 89.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Smart-Watch-for-Men-Women-Fitness-Tracker-with-Heart-Rate-Blood-Pressure-Blood-Oxygen-Sleep-Monitor-IP68-Waterproof-Activity-Tracker-with-Pedometer-Calorie-Counter-Smartwatch-for-Android-iOS-0-0.jpg",
      url: "https://store.aliconnects.com/product/smart-watch-for-men-women-fitness-tracker-with-heart-rate-blood-pressure-blood-oxygen-sleep-monitor-ip68-waterproof-activity-tracker-with-pedometer-calorie-counter-smartwatch-for-android-ios/",
      description: "Smart watch with fitness tracking, heart rate monitoring, and IP68 waterproof rating.",
      categories: ["Electronics", "Wearables", "Watches", "Fitness", "Smart Watch"],
    },
    {
      id: 3,
      name: "Portable Bluetooth Speaker",
      price: 39.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Bluetooth-Speaker-Portable-Wireless-Bluetooth-Speakers-with-24W-Loud-Stereo-Sound-IPX7-Waterproof-24H-Playtime-TWS-Pairing-Bluetooth-5-0-Outdoor-Speaker-with-Mic-for-Home-Party-Beach-Travel-0-0.jpg",
      url: "https://store.aliconnects.com/product/bluetooth-speaker-portable-wireless-bluetooth-speakers-with-24w-loud-stereo-sound-ipx7-waterproof-24h-playtime-tws-pairing-bluetooth-5-0-outdoor-speaker-with-mic-for-home-party-beach-travel/",
      description: "Portable Bluetooth speaker with 24W stereo sound, IPX7 waterproof, and 24-hour battery life.",
      categories: ["Electronics", "Audio", "Speakers", "Bluetooth", "Portable"],
    },
    {
      id: 4,
      name: "Men's Graphic T-Shirt",
      price: 24.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Mens-Graphic-T-Shirts-Short-Sleeve-Crew-Neck-Tees-Casual-Cotton-Tops-0.jpg",
      url: "https://store.aliconnects.com/product/mens-graphic-t-shirts-short-sleeve-crew-neck-tees-casual-cotton-tops/",
      description: "Comfortable cotton t-shirt with graphic design, perfect for casual wear.",
      categories: ["Clothing", "T-shirts", "Men's Clothing", "Casual Wear", "Tops"],
    },
    {
      id: 5,
      name: "Women's Summer Dress",
      price: 35.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Womens-Summer-Casual-T-Shirt-Dresses-Short-Sleeve-Swing-Dress-with-Pockets-0.jpg",
      url: "https://store.aliconnects.com/product/womens-summer-casual-t-shirt-dresses-short-sleeve-swing-dress-with-pockets/",
      description: "Casual summer dress with pockets, comfortable and stylish for warm weather.",
      categories: ["Clothing", "Dresses", "Women's Clothing", "Summer Wear"],
    },
    {
      id: 6,
      name: "Laptop Backpack",
      price: 42.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Laptop-Backpack-Travel-Computer-Bag-for-Women-Men-Water-Resistant-College-School-Bookbag-with-USB-Charging-Port-0.jpg",
      url: "https://store.aliconnects.com/product/laptop-backpack-travel-computer-bag-for-women-men-water-resistant-college-school-bookbag-with-usb-charging-port/",
      description: "Water-resistant laptop backpack with USB charging port, perfect for travel and school.",
      categories: ["Accessories", "Bags", "Backpacks", "Travel", "Laptop Accessories"],
    },
    {
      id: 7,
      name: "Wireless Phone Charger",
      price: 29.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Wireless-Charger-Qi-Certified-10W-Fast-Charging-Pad-Compatible-with-iPhone-Samsung-Galaxy-and-More-0.jpg",
      url: "https://store.aliconnects.com/product/wireless-charger-qi-certified-10w-fast-charging-pad-compatible-with-iphone-samsung-galaxy-and-more/",
      description: "Qi-certified 10W fast wireless charging pad compatible with iPhone, Samsung, and other devices.",
      categories: ["Electronics", "Phone Accessories", "Chargers", "Wireless"],
    },
    {
      id: 8,
      name: "Kitchen Knife Set",
      price: 59.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Kitchen-Knife-Set-15-Piece-Set-with-Block-Wooden-Professional-Chef-Knife-Block-Set-0.jpg",
      url: "https://store.aliconnects.com/product/kitchen-knife-set-15-piece-set-with-block-wooden-professional-chef-knife-block-set/",
      description: "15-piece professional kitchen knife set with wooden block, high-quality stainless steel blades.",
      categories: ["Home", "Kitchen", "Cutlery", "Knife Set", "Cooking"],
    },
    {
      id: 9,
      name: "Men's Casual Button-Down Shirt",
      price: 32.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Mens-Casual-Button-Down-Shirts-Long-Sleeve-Regular-Fit-Cotton-Dress-Shirt-0.jpg",
      url: "https://store.aliconnects.com/product/mens-casual-button-down-shirts-long-sleeve-regular-fit-cotton-dress-shirt/",
      description:
        "Long sleeve button-down shirt made from comfortable cotton, perfect for casual or semi-formal occasions.",
      categories: ["Clothing", "Men's Clothing", "Shirts", "Casual Wear", "Button-Down"],
    },
    {
      id: 10,
      name: "Women's Running Shoes",
      price: 64.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Womens-Running-Shoes-Lightweight-Athletic-Tennis-Sneakers-Breathable-Walking-Shoes-0.jpg",
      url: "https://store.aliconnects.com/product/womens-running-shoes-lightweight-athletic-tennis-sneakers-breathable-walking-shoes/",
      description: "Lightweight, breathable running shoes with cushioned insoles for comfort during exercise.",
      categories: ["Footwear", "Women's Shoes", "Athletic", "Running", "Sneakers"],
    },
    {
      id: 11,
      name: "Stainless Steel Water Bottle",
      price: 19.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Stainless-Steel-Water-Bottle-Vacuum-Insulated-Double-Wall-Leak-Proof-Sports-Water-Bottle-0.jpg",
      url: "https://store.aliconnects.com/product/stainless-steel-water-bottle-vacuum-insulated-double-wall-leak-proof-sports-water-bottle/",
      description:
        "Vacuum insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
      categories: ["Accessories", "Drinkware", "Sports", "Water Bottles", "Stainless Steel"],
    },
    {
      id: 12,
      name: "Yoga Mat",
      price: 27.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Yoga-Mat-Non-Slip-Exercise-Mat-with-Carrying-Strap-for-Workout-Fitness-Pilates-0.jpg",
      url: "https://store.aliconnects.com/product/yoga-mat-non-slip-exercise-mat-with-carrying-strap-for-workout-fitness-pilates/",
      description: "Non-slip yoga mat with carrying strap, perfect for yoga, pilates, and other floor exercises.",
      categories: ["Fitness", "Yoga", "Exercise Equipment", "Mats"],
    },
    {
      id: 13,
      name: "LED Desk Lamp",
      price: 25.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/LED-Desk-Lamp-with-USB-Charging-Port-Adjustable-Brightness-Levels-Touch-Control-0.jpg",
      url: "https://store.aliconnects.com/product/led-desk-lamp-with-usb-charging-port-adjustable-brightness-levels-touch-control/",
      description: "Adjustable LED desk lamp with USB charging port and multiple brightness levels.",
      categories: ["Home", "Lighting", "Desk Lamps", "LED", "Office"],
    },
    {
      id: 14,
      name: "Portable Power Bank",
      price: 34.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Portable-Charger-Power-Bank-20000mAh-High-Capacity-External-Battery-Pack-with-Dual-USB-Ports-0.jpg",
      url: "https://store.aliconnects.com/product/portable-charger-power-bank-20000mah-high-capacity-external-battery-pack-with-dual-usb-ports/",
      description: "20000mAh high-capacity power bank with dual USB ports for charging multiple devices on the go.",
      categories: ["Electronics", "Chargers", "Power Banks", "Portable", "USB"],
    },
    {
      id: 15,
      name: "Bluetooth Wireless Keyboard",
      price: 45.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Bluetooth-Keyboard-Wireless-Rechargeable-Keyboard-for-iPad-iPhone-Mac-Windows-Android-0.jpg",
      url: "https://store.aliconnects.com/product/bluetooth-keyboard-wireless-rechargeable-keyboard-for-ipad-iphone-mac-windows-android/",
      description:
        "Rechargeable Bluetooth keyboard compatible with multiple devices including iPad, iPhone, and Android.",
      categories: ["Electronics", "Computer Accessories", "Keyboards", "Bluetooth", "Wireless"],
    },
    {
      id: 16,
      name: "Men's Slim Fit Jeans",
      price: 39.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Mens-Slim-Fit-Jeans-Stretch-Denim-Pants-Casual-Trousers-0.jpg",
      url: "https://store.aliconnects.com/product/mens-slim-fit-jeans-stretch-denim-pants-casual-trousers/",
      description: "Comfortable stretch denim jeans with a modern slim fit design.",
      categories: ["Clothing", "Men's Clothing", "Jeans", "Pants", "Denim"],
    },
    {
      id: 17,
      name: "Women's Crossbody Bag",
      price: 29.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Womens-Crossbody-Bag-Small-Shoulder-Purse-with-Tassel-0.jpg",
      url: "https://store.aliconnects.com/product/womens-crossbody-bag-small-shoulder-purse-with-tassel/",
      description: "Stylish small crossbody bag with tassel detail, perfect for everyday use.",
      categories: ["Accessories", "Bags", "Women's Accessories", "Crossbody", "Purses"],
    },
    {
      id: 18,
      name: "Digital Kitchen Scale",
      price: 15.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Digital-Kitchen-Scale-Food-Scale-with-LCD-Display-for-Cooking-Baking-0.jpg",
      url: "https://store.aliconnects.com/product/digital-kitchen-scale-food-scale-with-lcd-display-for-cooking-baking/",
      description: "Precise digital kitchen scale with LCD display for cooking and baking.",
      categories: ["Home", "Kitchen", "Scales", "Cooking", "Baking"],
    },
    {
      id: 19,
      name: "Unisex Baseball Cap",
      price: 18.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Baseball-Cap-Classic-Adjustable-Plain-Hat-for-Men-Women-0.jpg",
      url: "https://store.aliconnects.com/product/baseball-cap-classic-adjustable-plain-hat-for-men-women/",
      description: "Classic adjustable baseball cap suitable for both men and women.",
      categories: ["Accessories", "Hats", "Baseball Caps", "Unisex", "Headwear"],
    },
    {
      id: 20,
      name: "Wireless Computer Mouse",
      price: 22.99,
      image:
        "https://store.aliconnects.com/wp-content/uploads/2023/10/Wireless-Mouse-Ergonomic-2-4G-Portable-Mobile-Computer-Mouse-with-USB-Receiver-0.jpg",
      url: "https://store.aliconnects.com/product/wireless-mouse-ergonomic-2-4g-portable-mobile-computer-mouse-with-usb-receiver/",
      description: "Ergonomic wireless mouse with 2.4G connectivity and USB receiver.",
      categories: ["Electronics", "Computer Accessories", "Mouse", "Wireless", "USB"],
    },
  ]
}

