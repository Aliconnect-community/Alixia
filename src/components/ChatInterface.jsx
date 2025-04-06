"use client"
import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
import ChatSettings from "./ChatSettings"

// Sample product data
const products = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 49.99,
    image: "https://store.aliconnects.com/wp-content/uploads/2023/10/Wireless-Earbuds-Bluetooth-Headphones-with-Charging-Case-IPX7-Waterproof-Stereo-Earphones-in-Ear-Built-in-Mic-Headset-Premium-Sound-with-Deep-Bass-for-Sport-Black-0-0.jpg",
    url: "https://store.aliconnects.com/product/wireless-earbuds-bluetooth-headphones-with-charging-case-ipx7-waterproof-stereo-earphones-in-ear-built-in-mic-headset-premium-sound-with-deep-bass-for-sport-black/",
    description: "Wireless Bluetooth earbuds with charging case, IPX7 waterproof, and built-in mic.",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 89.99,
    image: "https://store.aliconnects.com/wp-content/uploads/2023/10/Smart-Watch-for-Men-Women-Fitness-Tracker-with-Heart-Rate-Blood-Pressure-Blood-Oxygen-Sleep-Monitor-IP68-Waterproof-Activity-Tracker-with-Pedometer-Calorie-Counter-Smartwatch-for-Android-iOS-0-0.jpg",
    url: "https://store.aliconnects.com/product/smart-watch-for-men-women-fitness-tracker-with-heart-rate-blood-pressure-blood-oxygen-sleep-monitor-ip68-waterproof-activity-tracker-with-pedometer-calorie-counter-smartwatch-for-android-ios/",
    description: "Smart watch with fitness tracking, heart rate monitoring, and IP68 waterproof rating.",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 39.99,
    image: "https://store.aliconnects.com/wp-content/uploads/2023/10/Bluetooth-Speaker-Portable-Wireless-Bluetooth-Speakers-with-24W-Loud-Stereo-Sound-IPX7-Waterproof-24H-Playtime-TWS-Pairing-Bluetooth-5-0-Outdoor-Speaker-with-Mic-for-Home-Party-Beach-Travel-0-0.jpg",
    url: "https://store.aliconnects.com/product/bluetooth-speaker-portable-wireless-bluetooth-speakers-with-24w-loud-stereo-sound-ipx7-waterproof-24h-playtime-tws-pairing-bluetooth-5-0-outdoor-speaker-with-mic-for-home-party-beach-travel/",
    description: "Portable Bluetooth speaker with 24W stereo sound, IPX7 waterproof, and 24-hour battery life.",
  }
]

// Store information
const storeInfo = {
  name: "AliConnects",
  website: "https://store.aliconnects.com/",
  shipping: "Free shipping on orders over $50. Standard delivery takes 3-5 business days.",
  returns: "30-day return policy. You can return any unused item within 30 days for a full refund.",
  payment: "We accept all major credit cards, PayPal, and Apple Pay.",
  contact: "For customer support, please email support@aliconnects.com or call (555) 123-4567.",
}

// Font size classes
const fontSizeClasses = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
  xlarge: "text-lg",
}

// System prompt for Groq
const systemPrompt = `
You are Alixia, the shopping assistant for AliConnects. Follow these rules STRICTLY:
1. ONLY recommend products from this list: ${JSON.stringify(products, null, 2)}
2. Always include:
   - Product image: ![alt](image_url)
   - Link: [Buy here](product_url)
   - Price: $XX.XX
3. For store policies, use this info: ${JSON.stringify(storeInfo, null, 2)}
4. Never make up products or information.
5. Be friendly and helpful.
`

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
  ])
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  // State for settings
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState("medium")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Groq API key
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

  const generateUniqueId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
      playMessageSound("sent")
    }

    generateAIResponse(inputValue)
  }

  const generateAIResponse = async (userMessage) => {
    const thinkingId = generateUniqueId();
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        content: "Thinking...",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  
    try {
      // First try direct product match
      const productMatch = checkForProductMatch(userMessage);
      if (productMatch) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((msg) => msg.id !== thinkingId),
            {
              id: generateUniqueId(),
              content: productMatch,
              sender: "bot",
              timestamp: new Date(),
            },
          ]);
          if (soundEnabled) playMessageSound("received");
        }, 500);
        return;
      }
  
      // Prepare the request payload
      const payload = {
        model: "mixtral-8x7b-32768",
        messages: [
          { 
            role: "system", 
            content: systemPrompt.substring(0, 3000) // Ensure it doesn't exceed token limits
          },
          { 
            role: "user", 
            content: userMessage.substring(0, 1000) // Limit user message length
          },
        ],
        temperature: 0.3,
        max_tokens: 500, // Limit response length
      };
  
      console.log("Sending payload to Groq:", payload);
  
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Groq API error details:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Groq API response:", data);
  
      const aiResponse = data.choices?.[0]?.message?.content || 
        "I couldn't generate a response. Please try again.";
  
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== thinkingId),
        {
          id: generateUniqueId(),
          content: aiResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
  
      if (soundEnabled) playMessageSound("received");
  
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== thinkingId),
        {
          id: generateUniqueId(),
          content: "I'm having trouble connecting. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      generateLocalResponse(userMessage);
    }
  };

  const checkForProductMatch = (query) => {
    const lowerQuery = query.toLowerCase()
    const matchedProduct = products.find((p) => 
      lowerQuery.includes(p.name.toLowerCase()) || 
      p.description.toLowerCase().includes(lowerQuery)
    )

    if (!matchedProduct) return null

    return `
      I found this ${matchedProduct.name} for you:<br><br>
      <strong>${matchedProduct.name}</strong><br>
      ${matchedProduct.description}<br>
      Price: $${matchedProduct.price.toFixed(2)}<br><br>
      <a href="${matchedProduct.url}" target="_blank" class="text-blue-500 underline">View on our website</a>
    `
  }

  const generateLocalResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("shipping") || lowerCaseMessage.includes("delivery")) {
      return storeInfo.shipping
    } else if (lowerCaseMessage.includes("return") || lowerCaseMessage.includes("refund")) {
      return storeInfo.returns
    } else if (lowerCaseMessage.includes("payment") || lowerCaseMessage.includes("pay")) {
      return storeInfo.payment
    } else if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("support")) {
      return storeInfo.contact
    } else if (lowerCaseMessage.includes("website") || lowerCaseMessage.includes("store")) {
      return `You can visit our online store at <a href="${storeInfo.website}" target="_blank" class="text-blue-500 underline">${storeInfo.website}</a>`
    } else if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I assist you with your shopping today?"
    }

    return "I'm here to help with your shopping experience at AliConnects. What would you like to know?"
}

  const showProductResponse = (productType, thinkingId) => {
    let product
    if (productType === "earbuds") {
      product = products.find((p) => p.name.toLowerCase().includes("earbuds"))
    } else if (productType === "watch") {
      product = products.find((p) => p.name.toLowerCase().includes("watch"))
    } else if (productType === "speaker") {
      product = products.find((p) => p.name.toLowerCase().includes("speaker"))
    }

    if (product) {
      setTimeout(() => {
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== thinkingId)
          return [
            ...filtered,
            {
              id: generateUniqueId(),
              content: `I found this ${product.name} that might interest you:<br><br>
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
        if (soundEnabled) playMessageSound("received")
      }, 1000)
    }
  }

  const showAllProducts = (thinkingId) => {
    setTimeout(() => {
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== thinkingId)
        return [
          ...filtered,
          {
            id: generateUniqueId(),
            content: `Here are our products:<br><br>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                ${products.map((product) => `
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
                `).join("")}
              </div>`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]
      })
      if (soundEnabled) playMessageSound("received")
    }, 1000)
  }

  const playMessageSound = (type) => {
    if (!soundEnabled) return
    console.log(`Playing ${type} sound`)
    // Implementation would go here
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
      />
    </div>
  )
}