import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { Overview } from "./pages/Overview";
import { Settings } from "./pages/Settings";
import { Documents } from "./pages/Documents";
import { Catalog } from "./pages/Catalog";
import { Tests } from "./pages/Tests";
import { Usage } from "./pages/Usage";
import { Toaster } from "./components/ui/sonner";
import { loadConfig, applyConfigToDOM } from "./lib/configStorage";

export default function App() {
  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      applyConfigToDOM(savedConfig);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="documents" element={<Documents />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="tests" element={<Tests />} />
          <Route path="usage" element={<Usage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}