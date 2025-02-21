// src/components/ChatHeader.jsx
import { Settings } from 'lucide-react';

const ChatHeader = ({ toggleSettings }) => {
  return (
    <header className="bg-[#ff3705] border-b shadow-sm p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Alixia Chat Assistant</h1>
        <button 
          onClick={toggleSettings}
          className="p-2 rounded-full hover:bg-[#ff3705]"
          aria-label="Open settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;