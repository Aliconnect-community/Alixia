import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader } from "lucide-react";

export default function ChatInput({
  inputValue,
  setInputValue,
  handleSendMessage,
  darkMode,
  handleImageUpload,
  isLoading,
}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + " " + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [setInputValue]);

  // Voice recognition setup
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Your browser does not support speech recognition. Try Chrome or Edge.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
        // If already started, stop and restart
        recognitionRef.current.abort();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const inputEle = useRef(null);

  useEffect(() => {
    inputEle.current.focus();
  }, []);

  return (
    <div
      className={`p-4 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={`flex items-center ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50 transition-all`}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products, shipping, or store policies..."
            className={`flex-1 ${darkMode ? "bg-transparent text-white placeholder-gray-400" : "bg-transparent text-gray-700"} outline-none text-base`}
            disabled={isLoading}
            ref={inputEle}
          />

          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-md flex items-center ${isListening ? "bg-red-500 text-white" : darkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-500 hover:bg-gray-200"} transition-colors`}
              aria-label={
                isListening ? "Stop recording" : "Start voice recording"
              }
              disabled={isLoading}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="ml-1 text-sm hidden sm:inline">
                {isListening ? "Stop" : "Voice"}
              </span>
            </button>

            <button
              onClick={handleSendMessage}
              disabled={(inputValue.trim() === "" && !isListening) || isLoading}
              className={`p-2 rounded-md flex items-center ${
                (inputValue.trim() === "" && !isListening) || isLoading
                  ? darkMode
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-400 cursor-not-allowed"
                  : darkMode
                    ? "bg-purple-700 text-white hover:bg-purple-800"
                    : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-md"
              } transition-all`}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              <span className="ml-1 text-sm hidden sm:inline">
                {isLoading ? "Loading" : "Send"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
