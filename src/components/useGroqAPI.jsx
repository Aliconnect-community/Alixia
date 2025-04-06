// useGroqAPI.js
"use client";

import { useState } from "react";
import { products, systemPrompt } from "./config";

export const useGroqAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // ⚠️ SECURITY NOTE: 
  // Hardcoding API keys in frontend code is risky (exposes keys to users).
  // Only do this for testing or if the key has strict usage limits.
  const API_KEY = "your-groq-api-key-here"; // Replace with your actual key

  const generateResponse = async (userMessage) => {
    setIsLoading(true);

    try {
      // 1. First check for direct product matches (no API call)
      const productMatch = checkForProductMatch(userMessage);
      if (productMatch) return productMatch;

      // 2. Use Groq API for complex queries
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768", // Fast & free
          messages: [
            { 
              role: "system", 
              content: `${systemPrompt}\n\nCurrent date: ${new Date().toLocaleDateString()}` 
            },
            { role: "user", content: userMessage },
          ],
          temperature: 0.3, // Keep responses deterministic
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return data.choices[0]?.message?.content || "I couldn’t find an answer.";

    } catch (error) {
      console.error("Groq API error:", error);
      return "Sorry, I’m having trouble. Please ask about our products directly!";
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Direct product search (avoids API calls)
  const checkForProductMatch = (query) => {
    const lowerQuery = query.toLowerCase();
    const matchedProduct = products.find(
      (p) => lowerQuery.includes(p.name.toLowerCase()) || 
             p.description.toLowerCase().includes(lowerQuery)
    );

    if (!matchedProduct) return null;

    return `
      **${matchedProduct.name}**  
      ![Product Image](${matchedProduct.image})  
      **Price:** $${matchedProduct.price.toFixed(2)}  
      [Buy Now](${matchedProduct.url})  
      *${matchedProduct.description}*  
    `;
  };

  return { generateResponse, isLoading };
};