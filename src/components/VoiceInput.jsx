// src/components/VoiceInput.jsx
import { Mic, MicOff } from 'lucide-react';

const VoiceInput = ({ isRecording, toggleRecording, isSupported = true }) => {
  if (!isSupported) {
    return null;
  }
  
  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`p-2 rounded-full ${
        isRecording 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};

export default VoiceInput;