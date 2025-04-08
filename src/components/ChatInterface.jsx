"use client"
import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import ChatSettings from "./ChatSettings"
import { ShoppingBag } from "lucide-react"
import storeInfo from "../data/store-info"
import { searchProducts, getFeaturedProducts } from "../services/product-service"
import { generateUniqueId, systemPrompt, extractProductQuery, playMessageSound } from "../utils/chat-utils"

export default function ChatInterface() {
  // State for chat functionality
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      content: "Hi there! 👋 Welcome to AliConnects Shopping Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: "msg-2",
      content: "You can ask me about our products, shipping policies, or anything else about our store!",
      sender: "bot",
      timestamp: new Date(Date.now() + 100),
    },
    /*{
      id: "msg-3",
      content:
        "⚙️ <strong>Setup Note:</strong> For automatic product retrieval, please add your WooCommerce API keys in the server environment variables (WC_CONSUMER_KEY and WC_CONSUMER_SECRET).",
      sender: "bot",
      timestamp: new Date(Date.now() + 200),
    },*/
  ])
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // State for settings
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isApiWorking, setIsApiWorking] = useState(true)

  // Groq API key - replace with your actual key if needed
  const GROQ_API_KEY = "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"

  // Load settings from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("aliconnects-dark-mode")
    const savedFontSize = localStorage.getItem("aliconnects-font-size")
    const savedSoundEnabled = localStorage.getItem("aliconnects-sound-enabled")

    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode))
    if (savedFontSize) setFontSize(savedFontSize)
    if (savedSoundEnabled !== null) setSoundEnabled(JSON.parse(savedSoundEnabled))
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("aliconnects-dark-mode", JSON.stringify(darkMode))
    localStorage.setItem("aliconnects-font-size", fontSize)
    localStorage.setItem("aliconnects-sound-enabled", JSON.stringify(soundEnabled))
  }, [darkMode, fontSize, soundEnabled])

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev)
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    const newMessage = {
      id: generateUniqueId(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    if (soundEnabled) {
      playMessageSound("sent", soundEnabled)
    }

    generateAIResponse(inputValue)
  }

  // Update the handleProductSearch function to be more robust
  const handleProductSearch = async (query, thinkingId) => {
    try {
      console.log(`Searching for products with query: ${query}`)
      const products = await searchProducts(query)

      if (products.length === 0) {
        // Try a more general search if specific search fails
        const generalQuery = query.split(/\s+/).filter((word) => word.length > 3)[0]
        if (generalQuery && generalQuery !== query) {
          console.log(`Trying more general search with: ${generalQuery}`)
          const generalProducts = await searchProducts(generalQuery)

          if (generalProducts.length > 0) {
            showMatchedProducts(generalProducts, thinkingId, query)
            return
          }
        }

        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== thinkingId),
          {
            id: generateUniqueId(),
            content: `I couldn't find any products matching "${query}". Would you like to see our featured products instead?`,
            sender: "bot",
            timestamp: new Date(),
          },
        ])

        // Show featured products after a short delay
        setTimeout(async () => {
          const featuredProducts = await getFeaturedProducts()
          showMatchedProducts(featuredProducts, null, "featured products")
        }, 2000)

        if (soundEnabled) playMessageSound("received", soundEnabled)
        return
      }

      showMatchedProducts(products, thinkingId, query)
    } catch (error) {
      console.error("Error searching for products:", error)
      respondWithLocalFallback(`products like ${query}`, thinkingId)
    }
  }

  // Update the generateAIResponse function to better detect product queries
  const generateAIResponse = async (userMessage) => {
    const thinkingId = generateUniqueId()
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        content: "Thinking...",
        sender: "bot",
        timestamp: new Date(),
      },
    ])

    setIsLoading(true)

    try {
      const lowerCaseMessage = userMessage.toLowerCase()

      // Check for store information queries
      if (
        lowerCaseMessage.includes("shipping") ||
        lowerCaseMessage.includes("delivery") ||
        lowerCaseMessage.includes("how long")
      ) {
        respondWithStoreInfo("shipping", thinkingId)
        setIsLoading(false)
        return
      } else if (
        lowerCaseMessage.includes("return") ||
        lowerCaseMessage.includes("refund") ||
        lowerCaseMessage.includes("money back")
      ) {
        respondWithStoreInfo("returns", thinkingId)
        setIsLoading(false)
        return
      } else if (
        lowerCaseMessage.includes("payment") ||
        lowerCaseMessage.includes("pay") ||
        lowerCaseMessage.includes("credit card")
      ) {
        respondWithStoreInfo("payment", thinkingId)
        setIsLoading(false)
        return
      } else if (
        lowerCaseMessage.includes("contact") ||
        lowerCaseMessage.includes("support") ||
        lowerCaseMessage.includes("help") ||
        lowerCaseMessage.includes("email") ||
        lowerCaseMessage.includes("phone")
      ) {
        respondWithStoreInfo("contact", thinkingId)
        setIsLoading(false)
        return
      } else if (
        lowerCaseMessage.includes("website") ||
        lowerCaseMessage.includes("store") ||
        lowerCaseMessage.includes("shop")
      ) {
        respondWithStoreInfo("website", thinkingId)
        setIsLoading(false)
        return
      } else if (
        lowerCaseMessage.includes("hello") ||
        lowerCaseMessage.includes("hi") ||
        lowerCaseMessage.includes("hey")
      ) {
        respondWithGreeting(thinkingId)
        setIsLoading(false)
        return
      } else if (
        lowerCaseMessage.includes("products") ||
        lowerCaseMessage.includes("what do you sell") ||
        lowerCaseMessage.includes("what can i buy")
      ) {
        await showAllProducts(thinkingId)
        setIsLoading(false)
        return
      }

      // Check for specific product types
      const productTypes = [
        { keywords: ["earbuds", "headphones", "earphones"], category: "earbuds" },
        { keywords: ["watch", "smartwatch", "smart watch"], category: "watch" },
        { keywords: ["speaker", "bluetooth speaker", "portable speaker"], category: "speaker" },
        { keywords: ["t-shirt", "tshirt", "shirt", "tee"], category: "t-shirt" },
        { keywords: ["dress", "gown"], category: "dress" },
        { keywords: ["backpack", "bag", "laptop bag"], category: "bag" },
        { keywords: ["charger", "charging"], category: "charger" },
        { keywords: ["knife", "kitchen", "cutlery"], category: "kitchen" },
        { keywords: ["jeans", "pants", "trousers"], category: "pants" },
        { keywords: ["shoes", "sneakers", "footwear"], category: "shoes" },
        { keywords: ["bottle", "water bottle"], category: "bottle" },
        { keywords: ["yoga", "exercise", "fitness"], category: "fitness" },
        { keywords: ["lamp", "light", "lighting"], category: "lamp" },
        { keywords: ["power bank", "battery"], category: "power bank" },
        { keywords: ["keyboard", "typing"], category: "keyboard" },
        { keywords: ["mouse", "computer mouse"], category: "mouse" },
        { keywords: ["cap", "hat", "headwear"], category: "hat" },
      ]

      for (const type of productTypes) {
        if (type.keywords.some((keyword) => lowerCaseMessage.includes(keyword))) {
          await handleProductSearch(type.category, thinkingId)
          setIsLoading(false)
          return
        }
      }

      // Check for product queries
      const productQuery = extractProductQuery(userMessage)
      if (productQuery) {
        await handleProductSearch(productQuery, thinkingId)
        setIsLoading(false)
        return
      }

      // If API is not working, use local responses
      if (!isApiWorking) {
        respondWithLocalFallback(userMessage, thinkingId)
        setIsLoading(false)
        return
      }

      // For more complex queries, use the Groq API
      // Prepare the request payload
      const payload = {
        model: "llama3-8b-8192", // Using a smaller model that's more reliable
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }

      console.log("Sending request to Groq API")

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Groq API error:", response.status, errorText)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Groq API response received")

      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from API")
      }

      const aiResponse = data.choices[0].message.content

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== thinkingId),
        {
          id: generateUniqueId(),
          content: aiResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ])

      if (soundEnabled) playMessageSound("received", soundEnabled)
      setIsApiWorking(true)
    } catch (error) {
      console.error("Error with Groq API:", error)
      setIsApiWorking(false)

      // Remove thinking message
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId))

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          content:
            "I'm having trouble connecting to my knowledge base. Let me answer based on what I know about our store.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])

      // Provide a local response
      setTimeout(() => {
        respondWithLocalFallback(userMessage)
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  // Update the showMatchedProducts function to include the search query
  const showMatchedProducts = (matchedProducts, thinkingId, searchQuery = "") => {
    setTimeout(() => {
      if (matchedProducts.length === 1) {
        // Show single product
        const product = matchedProducts[0]
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== thinkingId)
          return [
            ...filtered,
            {
              id: generateUniqueId(),
              content: `Yes, we have this ${product.name} available:<br><br>
                <strong>${product.name}</strong><br>
                ${product.description}<br>
                Price: $${product.price.toFixed(2)}<br><br>
                <a href="${product.url}" target="_blank" class="text-blue-500 underline">View on our website</a>`,
              image: product.image,
              sender: "bot",
              timestamp: new Date(),
            },
          ]
        })
      } else if (matchedProducts.length <= 3) {
        // Show up to 3 products
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== thinkingId)
          return [
            ...filtered,
            {
              id: generateUniqueId(),
              content: `I found these ${searchQuery ? `products related to "${searchQuery}"` : "products"} that might interest you:<br><br>
              <div class="grid grid-cols-1 sm:grid-cols-${matchedProducts.length} gap-4 mt-2">
                ${matchedProducts
                  .map(
                    (product) => `
                  <div class="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md">
                    <div class="h-32 overflow-hidden">
                      <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-2">
                      <h3 class="font-medium text-sm">${product.name}</h3>
                      <p class="text-xs">$${product.price.toFixed(2)}</p>
                      <a href="${product.url}" target="_blank" class="text-xs text-blue-500 underline">View details</a>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]
        })
      } else {
        // Show first 3 products and mention there are more
        const displayProducts = matchedProducts.slice(0, 3)
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== thinkingId)
          return [
            ...filtered,
            {
              id: generateUniqueId(),
              content: `I found ${matchedProducts.length} ${searchQuery ? `products related to "${searchQuery}"` : "products"}. Here are some options:<br><br>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                ${displayProducts
                  .map(
                    (product) => `
                  <div class="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md">
                    <div class="h-32 overflow-hidden">
                      <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-2">
                      <h3 class="font-medium text-sm">${product.name}</h3>
                      <p class="text-xs">$${product.price.toFixed(2)}</p>
                      <a href="${product.url}" target="_blank" class="text-xs text-blue-500 underline">View details</a>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div><br>
              <a href="https://store.aliconnects.com/" target="_blank" class="text-blue-500 underline">View all products on our website</a>`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]
        })
      }

      if (soundEnabled) playMessageSound("received", soundEnabled)
    }, 800)
  }

  const respondWithStoreInfo = (infoType, thinkingId) => {
    setTimeout(() => {
      let content = ""

      switch (infoType) {
        case "shipping":
          content = storeInfo.shipping
          break
        case "returns":
          content = storeInfo.returns
          break
        case "payment":
          content = storeInfo.payment
          break
        case "contact":
          content = storeInfo.contact
          break
        case "website":
          content = `You can visit our online store at <a href="${storeInfo.website}" target="_blank" class="text-blue-500 underline">${storeInfo.website}</a>`
          break
        default:
          content = "I'm here to help with your shopping experience at AliConnects. What would you like to know?"
      }

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== thinkingId),
        {
          id: generateUniqueId(),
          content: content,
          sender: "bot",
          timestamp: new Date(),
        },
      ])

      if (soundEnabled) playMessageSound("received", soundEnabled)
    }, 800)
  }

  const respondWithGreeting = (thinkingId) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== thinkingId),
        {
          id: generateUniqueId(),
          content:
            "Hello! How can I assist you with your shopping today? Feel free to ask about our products, shipping, or any other questions you might have!",
          sender: "bot",
          timestamp: new Date(),
        },
      ])

      if (soundEnabled) playMessageSound("received", soundEnabled)
    }, 500)
  }

  const respondWithLocalFallback = (userMessage, thinkingId = null) => {
    const lowerCaseMessage = userMessage.toLowerCase()
    let responseContent =
      "I'm here to help with your shopping experience at AliConnects. What would you like to know about our products or services?"

    // Try to generate a relevant response based on keywords
    if (lowerCaseMessage.includes("price") || lowerCaseMessage.includes("cost")) {
      responseContent =
        "Our products are competitively priced. You can check specific product prices on our website. Is there a specific product you're interested in?"
    } else if (lowerCaseMessage.includes("best") || lowerCaseMessage.includes("recommend")) {
      responseContent =
        "Our most popular products are our wireless earbuds and smart watches. Both have excellent customer reviews and offer great value for the price."
    } else if (
      lowerCaseMessage.includes("discount") ||
      lowerCaseMessage.includes("sale") ||
      lowerCaseMessage.includes("coupon")
    ) {
      responseContent =
        "We regularly offer discounts to our customers. Sign up for our newsletter on our website to receive updates about our latest promotions and sales."
    } else if (lowerCaseMessage.includes("warranty")) {
      responseContent =
        "All our products come with a standard 1-year manufacturer warranty. For specific warranty details on a particular product, please check the product page on our website."
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((msg) => (thinkingId ? msg.id !== thinkingId : true)),
        {
          id: generateUniqueId(),
          content: responseContent,
          sender: "bot",
          timestamp: new Date(),
        },
      ])

      if (soundEnabled) playMessageSound("received", soundEnabled)
    }, 800)
  }

  const showAllProducts = async (thinkingId) => {
    try {
      const featuredProducts = await getFeaturedProducts()
      const productsToShow = featuredProducts.slice(0, 6)

      setTimeout(() => {
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== thinkingId)
          return [
            ...filtered,
            {
              id: generateUniqueId(),
              content: `Here are some of our popular products:<br><br>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  ${productsToShow
                    .map(
                      (product) => `
                    <div class="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md">
                      <div class="h-32 overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                      </div>
                      <div class="p-2">
                        <h3 class="font-medium text-sm">${product.name}</h3>
                        <p class="text-xs">$${product.price.toFixed(2)}</p>
                        <a href="${product.url}" target="_blank" class="text-xs text-blue-500 underline">View details</a>
                      </div>
                    </div>
                  `,
                    )
                    .join("")}
                </div><br>
                <a href="https://store.aliconnects.com/" target="_blank" class="text-blue-500 underline">View all products on our website</a>`,
              sender: "bot",
              timestamp: new Date(),
            },
          ]
        })
        if (soundEnabled) playMessageSound("received", soundEnabled)
      }, 800)
    } catch (error) {
      console.error("Error fetching featured products:", error)
      respondWithLocalFallback("show me products", thinkingId)
    }
  }

  const handleImageUpload = (imageDataUrl) => {
    const newMessage = {
      id: generateUniqueId(),
      content: "I've uploaded this image:",
      image: imageDataUrl,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          content: "Thanks for sharing this image. Let me know if you'd like help finding similar products!",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }, 1000)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 ${darkMode ? "bg-purple-700" : "bg-gradient-to-r from-purple-600 to-pink-500"} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
        aria-label="Open chat"
      >
        <ShoppingBag className="mr-2" size={20} />
        <span className="font-medium">Chat with Alixia</span>
      </button>
    )
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <ChatHeader
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openSettings={toggleSettings}
        isSettingsOpen={isSettingsOpen}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {isSettingsOpen && (
        <ChatSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          darkMode={darkMode}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      )}

      <ChatMessages messages={messages} darkMode={darkMode} fontSize={fontSize} />

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        darkMode={darkMode}
        handleImageUpload={handleImageUpload}
        isLoading={isLoading}
      />
    </div>
  )
}

