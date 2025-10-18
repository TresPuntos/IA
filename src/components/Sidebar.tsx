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
  Zap,
  ChevronRight,
  Globe,
  Bell,
  Search,
  LogOut
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ isOpen, onToggle, currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { 
      id: 'site-info', 
      label: 'Información del Sitio', 
      icon: Home, 
      badge: null
    },
    { 
      id: 'tone-style', 
      label: 'Tono y Personalidad', 
      icon: MessageSquare, 
      badge: null
    },
    { 
      id: 'product-catalog', 
      label: 'Catálogo de Productos', 
      icon: Database, 
      badge: '20'
    },
    { 
      id: 'documentation', 
      label: 'Documentación', 
      icon: FileText, 
      badge: '3'
    },
    { 
      id: 'model-params', 
      label: 'Parámetros del Modelo', 
      icon: Sliders, 
      badge: null
    },
    { 
      id: 'version-testing', 
      label: 'Versión y Pruebas', 
      icon: TestTube, 
      badge: 'v0.1'
    },
    { 
      id: 'future-features', 
      label: 'Funciones Futuras', 
      icon: Zap, 
      badge: 'Beta'
    },
    { 
      id: 'actions', 
      label: 'Acciones Principales', 
      icon: Settings, 
      badge: null
    },
  ];

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar Profesional */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header Profesional */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">AI Chat Config</h1>
                  <p className="text-slate-400 text-sm">Control Center</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Language Selector Profesional */}
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300 text-sm font-medium">Idioma</span>
                </div>
                <div className="flex bg-slate-700 rounded-md p-1">
                  <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md font-medium">Español</button>
                  <button className="px-2 py-1 text-xs text-slate-400 hover:text-white">English</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Profesional */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
              Navegación
            </div>
            {menuItems.map((item) => (
              <div key={item.id} className="group">
                <Button
                  variant="ghost"
                  className={`w-full justify-between h-12 text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => handlePageChange(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-500' 
                        : 'bg-slate-700 group-hover:bg-slate-600'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      {item.badge && (
                        <div className="text-xs text-slate-400">{item.badge}</div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                </Button>
              </div>
            ))}
          </nav>
          
          {/* Footer Profesional */}
          <div className="p-4 border-t border-slate-800 bg-slate-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Estado del Sistema
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Activo</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                <LogOut className="h-4 w-4" />
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
      className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 shadow-lg"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}