import { useEffect, useRef } from "react";

export default function ChatMessages({
  messages,
  darkMode,
  fontSize,
  isLoading,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fontSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
    xlarge: "text-lg",
  };

  const messageTextClass = fontSizeClasses[fontSize] || "text-sm";
  const timestampTextClass = fontSize === "xlarge" ? "text-sm" : "text-xs";

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? `${darkMode ? "bg-purple-700" : "bg-gradient-to-r from-purple-600 to-pink-500"} text-white rounded-tr-none`
                  : `${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} ${darkMode ? "text-gray-200" : "text-gray-800"} border rounded-tl-none shadow-sm`
              }`}
            >
              <div
                className={messageTextClass}
                dangerouslySetInnerHTML={{
                  __html: message.content,
                }}
              />
              <p
                className={`mt-1 ${timestampTextClass} ${message.sender === "user" ? (darkMode ? "text-200" : "text-100") : darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div
            className={`thinking-container ${!darkMode ? "bg-[#f8f8f8]" : "bg-gray-800"}`}
          >
            <div className="thinking-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
