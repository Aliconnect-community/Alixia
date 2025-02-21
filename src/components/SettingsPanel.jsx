import { X } from 'lucide-react';

const SettingsPanel = ({ showSettings, setShowSettings, settings, updateSettings }) => {
  return (
    <>
      {/* Backdrop with blur effect */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-5"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Settings Panel */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-5 mt-10 ${
        showSettings ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button 
              onClick={() => setShowSettings(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="theme-select">
                Theme
              </label>
              <select 
                id="theme-select"
                className="w-full border rounded p-2"
                value={settings.theme}
                onChange={(e) => updateSettings('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice Recognition
              </label>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600" 
                  id="voice-enabled"
                  checked={settings.voiceEnabled}
                  onChange={(e) => updateSettings('voiceEnabled', e.target.checked)}
                />
                <label htmlFor="voice-enabled" className="ml-2 text-sm text-gray-700">
                  Enable Voice Input
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="font-size">
                Font Size
              </label>
              <select 
                id="font-size"
                className="w-full border rounded p-2"
                value={settings.fontSize}
                onChange={(e) => updateSettings('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;