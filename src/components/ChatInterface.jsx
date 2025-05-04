import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatSettings from "./ChatSettings";
import { playMessageSound, generateAIResponse } from "../utils/chat";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      content:
        "Hi there! 👋 Welcome to AliConnects Shopping Assistant. How can I help you today?",
      sender: "bot",
      ai: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("aliconnects-dark-mode");
    const savedFontSize = localStorage.getItem("aliconnects-font-size");
    const savedSoundEnabled = localStorage.getItem("aliconnects-sound-enabled");

    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedSoundEnabled !== null)
      setSoundEnabled(JSON.parse(savedSoundEnabled));
  }, []);

  useEffect(() => {
    localStorage.setItem("aliconnects-dark-mode", JSON.stringify(darkMode));
    localStorage.setItem("aliconnects-font-size", fontSize);
    localStorage.setItem(
      "aliconnects-sound-enabled",
      JSON.stringify(soundEnabled),
    );
  }, [darkMode, fontSize, soundEnabled]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      content: inputValue,
      sender: "user",
      ai: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    if (soundEnabled) {
      playMessageSound("sent", soundEnabled);
    }

    generateAIResponse(inputValue, setIsLoading, setMessages, soundEnabled);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
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

      <ChatMessages
        messages={messages}
        darkMode={darkMode}
        fontSize={fontSize}
        isLoading={isLoading}
      />

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        darkMode={darkMode}
        isLoading={isLoading}
      />
    </div>
  );
}
