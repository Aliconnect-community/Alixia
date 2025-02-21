// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import SettingsPanel from './components/SettingsPanel';
import SpeechRecognitionService from './services/SpeechRecognition';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light',
    voiceEnabled: true,
    fontSize: 'medium'
  });
  const [voiceSupported, setVoiceSupported] = useState(false);
  
  const speechRecognitionRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    speechRecognitionRef.current = new SpeechRecognitionService(
      // onResult callback
      (transcript) => {
        setInputText(transcript);
      },
      // onEnd callback
      () => {
        setIsRecording(false);
      }
    );
    
    setVoiceSupported(speechRecognitionRef.current.isRecognitionSupported());
    
    // Clean up
    return () => {
      if (speechRecognitionRef.current && isRecording) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);
  
  // Apply theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);
  
  const updateSettings = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText('');
    
    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "This is a sample response from the bot. You'll integrate with your actual backend API.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };
  
  const toggleRecording = () => {
    if (!settings.voiceEnabled) return;
    
    if (speechRecognitionRef.current) {
      const isNowRecording = speechRecognitionRef.current.toggle();
      setIsRecording(isNowRecording);
    }
  };

  // Apply font size to the whole app
  const fontSizeClass = 
    settings.fontSize === 'small' ? 'text-sm' : 
    settings.fontSize === 'large' ? 'text-lg' : 
    'text-base';

  return (
    <div className="flex flex-col h-screen mx-auto bg-gray-100 dark:bg-white-900 overflow-hidden">
      <ChatHeader toggleSettings={() => setShowSettings(!showSettings)} />
      <MessageList messages={messages} />
      <MessageInput 
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        voiceSupported={voiceSupported && settings.voiceEnabled}
      />
      <SettingsPanel 
        showSettings={showSettings} 
        setShowSettings={setShowSettings}
        settings={settings}
        updateSettings={updateSettings}
      />
    </div>
  );
}

export default App;