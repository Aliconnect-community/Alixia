"use client"

import { useEffect, useRef } from "react"

export default function ChatMessages({ messages, darkMode, fontSize }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Font size classes based on the fontSize setting
  const fontSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
    xlarge: "text-lg",
  }

  const messageTextClass = fontSizeClasses[fontSize] || "text-sm"
  const timestampTextClass = fontSize === "xlarge" ? "text-sm" : "text-xs"

  return (
    <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? `${darkMode ? "bg-purple-700" : "bg-gradient-to-r from-purple-600 to-pink-500"} text-white rounded-tr-none`
                  : `${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${darkMode ? "text-gray-200" : "text-gray-800"} border rounded-tl-none shadow-sm`
              }`}
            >
              {message.image && (
                <div className="mb-2">
                  <img
                    src={message.image || "/placeholder.svg"}
                    alt="Product or uploaded content"
                    className="max-w-full rounded-lg"
                  />
                </div>
              )}
              <div className={messageTextClass} dangerouslySetInnerHTML={{ __html: message.content }} />
              <p
                className={`mt-1 ${timestampTextClass} ${message.sender === "user" ? (darkMode ? "text-200" : "text-100") : darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

