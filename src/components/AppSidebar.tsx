import { useState } from "react";
import { 
  LayoutDashboard, 
  Settings2, 
  ShoppingBag, 
  FileText, 
  Sliders,
  Sun,
  Moon,
  MessageSquare,
  ChevronRight,
  Bot
} from "lucide-react";
import { useTheme } from "../utils/theme-provider";
import { Switch } from "./ui/switch";
import { cn } from "./ui/utils";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "configuration",
    title: "Configuration",
    icon: Settings2,
  },
  {
    id: "catalog",
    title: "Catalog",
    icon: ShoppingBag,
  },
  {
    id: "documentation",
    title: "Documentation",
    icon: FileText,
  },
  {
    id: "parameters",
    title: "Parameters",
    icon: Sliders,
  },
  {
    id: "testing",
    title: "Testing",
    icon: MessageSquare,
  },
];

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo/Header */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">AI Chat Config</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon 
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                    )} 
                  />
                  <span className="font-medium">{item.title}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <ChevronRight 
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                  )} 
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Theme Toggle Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-sidebar-accent">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-sidebar-foreground/70" />
            <span className="text-sm text-sidebar-foreground/70">Light</span>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-sidebar-foreground/70" />
            <span className="text-sm text-sidebar-foreground/70">Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
}