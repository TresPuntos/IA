import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { ThemeProvider } from "./utils/theme-provider";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Save, Copy, RotateCcw } from "lucide-react";
import { ConfigProvider, useConfig } from "./lib/ConfigContext";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { Configuration } from "./pages/Configuration";
import { Catalog } from "./pages/Catalog";
import { Documentation } from "./pages/Documentation";
import { Parameters } from "./pages/Parameters";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const { saveConfiguration } = useConfig();

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await saveConfiguration();
      if (result.success) {
        toast.success("✅ Configuration saved successfully");
      } else {
        toast.error("Error saving: " + result.error);
      }
    } catch (error) {
      toast.error("Error saving: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    const newSiteId = prompt("Enter the ID for the new site:", "site_copy");
    if (!newSiteId) return;
    
    setLoading(true);
    try {
      // Duplicate logic would go here
      toast.success(`✅ Configuration duplicated as ${newSiteId}`);
    } catch (error) {
      toast.error("Error duplicating: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Are you sure you want to reset to default values?")) return;
    
    // Reset logic would go here
    toast.success("Values reset to defaults");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "configuration":
        return <Configuration onDuplicate={handleDuplicate} />;
      case "catalog":
        return <Catalog />;
      case "documentation":
        return <Documentation />;
      case "parameters":
        return <Parameters />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger />
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicate}
                disabled={loading}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              
              <Button
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </header>
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderPage()}
            </div>
          </div>
        </main>
      </div>
      
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </ThemeProvider>
  );
}