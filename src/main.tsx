
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeTheme } from "./lib/theme";

// Inicializar tema antes de renderizar
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
  