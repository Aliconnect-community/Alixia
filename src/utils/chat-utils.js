// Utility functions for the chat interface

// Generate a unique ID for messages
export function generateUniqueId() {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Font size classes
  export const fontSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
    xlarge: "text-lg",
  }
  
  // System prompt for AI models
  export const systemPrompt = `
  You are Alixia, the shopping assistant for AliConnects. Be helpful, friendly and concise.
  Our store sells electronics including wireless earbuds, smart watches, bluetooth speakers, as well as clothing, accessories, and home goods.
  Shipping is free over $50, we have a 30-day return policy, and accept major credit cards.
  `
  
  // Extract product query from user message
  export function extractProductQuery(message) {
    const lowerCaseMessage = message.toLowerCase()
  
    // Common patterns for product queries
    const patterns = [
      /do you (have|sell) (any )?(.*?)(\?|$)/i,
      /looking for (a |an )?(.*?)(\?|$)/i,
      /searching for (a |an )?(.*?)(\?|$)/i,
      /find (a |an )?(.*?)(\?|$)/i,
      /want to buy (a |an )?(.*?)(\?|$)/i,
      /interested in (a |an )?(.*?)(\?|$)/i,
      /show me (.*?)(\?|$)/i,
    ]
  
    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match && match[2]) {
        return match[2].trim()
      }
      if (match && match[1]) {
        return match[1].trim()
      }
    }
  
    // If no pattern matches, use the whole message as a query
    // but remove common question words and phrases
    const query = lowerCaseMessage
      .replace(/do you have/g, "")
      .replace(/are there/g, "")
      .replace(/is there/g, "")
      .replace(/can i get/g, "")
      .replace(/can i buy/g, "")
      .replace(/do you sell/g, "")
      .replace(/looking for/g, "")
      .replace(/searching for/g, "")
      .replace(/i want/g, "")
      .replace(/i need/g, "")
      .replace(/please/g, "")
      .replace(/\?/g, "")
      .trim()
  
    return query
  }
  
  // Play message sound
  export function playMessageSound(type, soundEnabled) {
    if (!soundEnabled) return
    console.log(`Playing ${type} sound`)
    // Implementation would go here
  }
  
  