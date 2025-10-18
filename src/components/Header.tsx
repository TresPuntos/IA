import React from "react";
import { Button } from "./ui/button";
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Menu,
  Globe
} from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-white">Dashboard de Configuración</h1>
            <p className="text-slate-400 text-sm">Gestiona tu asistente de IA con precisión profesional</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar configuración..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm">Español</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white text-sm font-medium">Admin</div>
              <div className="text-slate-400 text-xs">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
