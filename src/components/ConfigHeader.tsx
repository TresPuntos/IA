import { Settings, Info, User } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function ConfigHeader() {
  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Chat Config Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Control Center</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full apple-button">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full apple-button">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full apple-button">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
