// src/services/SpeechRecognition.js
export default class SpeechRecognitionService {
  constructor(onResult, onEnd) {
    this.recognition = null;
    this.isSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    this.onResult = onResult;
    this.onEnd = onEnd;
    this.isListening = false;

    if (this.isSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        this.onResult(transcript);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onEnd();
      };
    }
  }

  start() {
    if (!this.isSupported) {
      console.warn("Speech recognition is not supported in this browser.");
      return false;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      return false;
    }
  }

  stop() {
    if (this.isSupported && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return true;
    }
    return false;
  }

  toggle() {
    return this.isListening ? this.stop() : this.start();
  }

  isRecognitionSupported() {
    return this.isSupported;
  }
}
