import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { MessagePage } from "./pages/message.tsx";
import { ProfilePage } from "./pages/profile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/message" element={<MessagePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
