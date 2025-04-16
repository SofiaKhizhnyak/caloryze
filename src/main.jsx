import "./styles/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
);
