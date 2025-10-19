import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "./ui/sidebar";
import { 
  LayoutDashboard, 
  Settings2, 
  ShoppingBag, 
  FileText, 
  Sliders,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../utils/theme-provider";
import { Switch } from "./ui/switch";

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
];

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6">
            <h2 className="tracking-tight">AI Chat Config</h2>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.id)}
                    isActive={currentPage === item.id}
                    className="h-11"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span className="text-muted-foreground">Light</span>
          </div>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="text-muted-foreground">Dark</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
