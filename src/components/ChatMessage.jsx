// src/components/ChatMessage.jsx
const ChatMessage = ({ message }) => {
  const { text, sender, timestamp } = message;
  const isUser = sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
          isUser 
            ? 'bg-[#ff3705] text-white rounded-br-none' 
            : 'bg-[#FFE4DD] text-gray-800 shadow rounded-bl-none'
        }`}
      >
        <p>{text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;