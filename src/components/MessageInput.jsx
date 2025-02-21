// src/components/MessageInput.jsx
import { Send } from 'lucide-react';
import VoiceInput from './VoiceInput';

const MessageInput = ({ 
  inputText, 
  setInputText, 
  handleSendMessage,
  isRecording,
  toggleRecording,
  voiceSupported
}) => {
  return (
    <div className="bg-white border-t p-4">
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <VoiceInput 
          isRecording={isRecording} 
          toggleRecording={toggleRecording}
          isSupported={voiceSupported}
        />
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white text-[#000000] border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-[#ff3300] text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-40 disabled:hover:bg-blue-500"
          disabled={inputText.trim() === ''}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;