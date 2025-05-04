import { X, Volume2, VolumeX } from "lucide-react";

export default function ChatSettings({
  isOpen,
  onClose,
  darkMode,
  soundEnabled,
  setSoundEnabled,
}) {
  if (!isOpen) return "";

  return (
    <div
      className={`p-4 mb-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-800 border border-gray-200"} max-w-3xl mx-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Chat Settings</h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          aria-label="Close settings"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sound Settings */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {soundEnabled ? (
              <Volume2 size={16} className="mr-2" />
            ) : (
              <VolumeX size={16} className="mr-2" />
            )}
            <span className="text-sm font-medium">Sound Notifications</span>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1 rounded-md ${
              darkMode
                ? soundEnabled
                  ? "bg-purple-700 text-white"
                  : "bg-gray-700 text-gray-300"
                : soundEnabled
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
            }`}
          >
            {soundEnabled ? "On" : "Off"}
          </button>
        </div>
        <p
          className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          Enable or disable sound notifications when receiving new messages.
        </p>
      </div>
    </div>
  );
}
