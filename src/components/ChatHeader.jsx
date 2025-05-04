import { Moon, Sun, Settings, Type, Menu, X } from "lucide-react";
import { useState } from "react";
import aliconnect_logo from "../assets/images/Aliconnect_logo.svg";

export default function ChatHeader({
  darkMode,
  toggleDarkMode,
  openSettings,
  isSettingsOpen,
  fontSize,
  setFontSize,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={`p-4 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Logo and Mobile Menu Button */}
        <div className="w-full sm:w-auto flex justify-between items-center mb-4 sm:mb-0">
          <h1
            className={`text-2xl font-bold ${
              darkMode
                ? "text-white"
                : "bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
            }`}
          >
            <img src={aliconnect_logo} alt="" className="h-10 w-15 mr-2" />
          </h1>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Font Size Controls */}
          <div className="flex items-center mr-2">
            <Type size={16} className="mr-1" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className={`text-sm rounded-md ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              } border px-2 py-1`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xlarge">X-Large</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-md ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } transition-colors flex items-center`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={18} className="mr-1" />
            ) : (
              <Moon size={18} className="mr-1" />
            )}
            <span className="text-sm">{darkMode ? "Light" : "Dark"}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={openSettings}
            className={`p-2 rounded-md ${
              isSettingsOpen
                ? darkMode
                  ? "bg-purple-700 text-white"
                  : "bg-purple-600 text-white"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
            } transition-colors flex items-center`}
            aria-label="Settings"
          >
            <Settings size={18} className="mr-1" />
            <span className="text-sm">Settings</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden w-full mt-4 space-y-3">
            {/* Font Size Controls */}
            <div className="flex items-center w-full p-2">
              <Type size={16} className="mr-2" />
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className={`w-full text-sm rounded-md ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                } border px-2 py-2`}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">X-Large</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={toggleDarkMode}
                className={`flex-1 p-2 rounded-md ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors flex items-center justify-center`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun size={18} className="mr-1" />
                ) : (
                  <Moon size={18} className="mr-1" />
                )}
                <span className="text-sm">{darkMode ? "Light" : "Dark"}</span>
              </button>

              <button
                onClick={openSettings}
                className={`flex-1 p-2 rounded-md ${
                  isSettingsOpen
                    ? darkMode
                      ? "bg-purple-700 text-white"
                      : "bg-purple-600 text-white"
                    : darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                } transition-colors flex items-center justify-center`}
                aria-label="Settings"
              >
                <Settings size={18} className="mr-1" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
