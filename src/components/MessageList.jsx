// src/components/MessageList.jsx
import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[gray-900]">
            <p className="text-lg">Welcome to the Chat Assistant</p>
            <p className="text-sm mt-2">Start a conversation or ask a question</p>
          </div>
        </div>
      ) : (
        messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;