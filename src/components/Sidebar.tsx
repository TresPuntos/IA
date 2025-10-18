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
  Globe
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'site-info', label: 'Información del Sitio', icon: Home, badge: null },
    { id: 'tone-style', label: 'Tono y Personalidad', icon: MessageSquare, badge: null },
    { id: 'product-catalog', label: 'Catálogo de Productos', icon: Database, badge: '20' },
    { id: 'documentation', label: 'Documentación', icon: FileText, badge: '3' },
    { id: 'model-params', label: 'Parámetros del Modelo', icon: Sliders, badge: null },
    { id: 'version-testing', label: 'Versión y Pruebas', icon: TestTube, badge: 'v0.1' },
    { id: 'future-features', label: 'Funciones Futuras', icon: Zap, badge: 'Beta' },
    { id: 'actions', label: 'Acciones Principales', icon: Settings, badge: null },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar Premium */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 z-50 transform transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header Premium */}
          <div className="relative p-8 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">AI Chat Config</h1>
                  <p className="text-slate-400 text-sm">Control Center</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Language Selector Premium */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">Idioma</span>
                </div>
                <div className="flex bg-slate-700/50 rounded-md p-1">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md font-medium">Español</button>
                  <button className="px-3 py-1 text-xs text-slate-400 hover:text-white">English</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Premium */}
          <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <div key={item.id} className="group">
                <Button
                  variant="ghost"
                  className="w-full justify-between h-14 text-left px-4 py-3 rounded-xl hover:bg-slate-700/50 hover:text-white transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-500/10"
                  onClick={() => scrollToSection(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                      <item.icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-slate-200 font-medium">{item.label}</div>
                      {item.badge && (
                        <div className="text-xs text-slate-500">{item.badge}</div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                </Button>
              </div>
            ))}
          </nav>
          
          {/* Footer Premium */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-sm">Estado del Sistema</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Activo</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white">
                <Info className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white">
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
      className="lg:hidden fixed top-6 left-6 z-50 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 text-white hover:bg-slate-700/90 shadow-lg"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}