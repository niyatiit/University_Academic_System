import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { YearProvider } from "./context/YearContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <YearProvider>
        <App />
      </YearProvider>
    </AuthProvider>
  </StrictMode>,
);
