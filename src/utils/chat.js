import axios from "axios";

// Generate a unique ID for messages
export const generateUniqueId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Play message sound
export function playMessageSound(type, soundEnabled) {
  if (!soundEnabled) return;
}

export const generateAIResponse = (
  userMessage,
  setIsLoading,
  setMessages,
  soundEnabled,
) => {
  setIsLoading((prev) => !prev);
  const API_URL = import.meta.env.VITE_API_ALIXIA_BACKEND;
  axios
    .post(API_URL, { message: userMessage })
    .then((res) => {
      const aiResponse = res.data.response;
      setMessages((prev) => [
        ...prev,
        {
          content: aiResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    })
    .catch((error) => {
      console.error(`An Error Occured ${error}`);
      setMessages((prev) => [
        ...prev,
        {
          content: `I'm having trouble connecting to my knowledge base, failed to connect to service`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    })
    .finally(() => {
      setIsLoading((prev) => !prev);
      if (soundEnabled) playMessageSound("received", soundEnabled);
    });
};
