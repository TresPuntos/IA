import React from "react";
import { Button } from "./ui/button";
import { 
  Settings, 
  Info, 
  User, 
  Menu, 
  X,
  Home,
  MessageSquare,
  Database,
  FileText,
  Sliders,
  TestTube,
  Zap
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'site-info', label: 'Información del Sitio', icon: Home },
    { id: 'tone-style', label: 'Tono y Personalidad', icon: MessageSquare },
    { id: 'product-catalog', label: 'Catálogo de Productos', icon: Database },
    { id: 'documentation', label: 'Documentación', icon: FileText },
    { id: 'model-params', label: 'Parámetros del Modelo', icon: Sliders },
    { id: 'version-testing', label: 'Versión y Pruebas', icon: TestTube },
    { id: 'future-features', label: 'Funciones Futuras', icon: Zap },
    { id: 'actions', label: 'Acciones Principales', icon: Settings },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Chat Config</h1>
              <p className="text-sm text-muted-foreground">Control Center</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start h-12 text-left"
                onClick={() => scrollToSection(item.id)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Info className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MobileMenuButton({ onToggle }: { onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="lg:hidden fixed top-4 left-4 z-50"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}