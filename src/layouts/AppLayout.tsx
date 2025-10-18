import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  Home, 
  Settings, 
  FileText, 
  Database, 
  TestTube, 
  BarChart3,
  Menu,
  X
} from "lucide-react";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { to: "/", label: "Overview", icon: Home },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/documents", label: "Documents", icon: FileText },
    { to: "/catalog", label: "Catalog", icon: Database },
    { to: "/tests", label: "Tests", icon: TestTube },
    { to: "/usage", label: "Usage", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
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
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
              Navigation
            </div>
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800
                  ${isActive ? 'bg-blue-600 text-white shadow-lg' : ''}
                `}
                onClick={() => {
                  // Cerrar sidebar en móvil después de seleccionar
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  menuItems.find(m => m.to === item.to) && window.location.pathname === item.to
                    ? 'bg-blue-500' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-800/50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System Status
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">AI Chat Config</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
