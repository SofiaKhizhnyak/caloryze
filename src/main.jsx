import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
);
