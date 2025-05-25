import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import ChatInterface from "./components/ChatInterface";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ChatInterface />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
