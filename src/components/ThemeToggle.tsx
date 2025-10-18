// src/components/ThemeToggle.tsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { getCurrentTheme, setTheme, type Theme } from "../lib/theme";

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');

  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  const getIcon = () => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getNextTheme = (): Theme => {
    switch (currentTheme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
      default:
        return 'light';
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleThemeChange(getNextTheme())}
      className="h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-all duration-200"
      title={`Tema actual: ${currentTheme === 'system' ? 'Sistema' : currentTheme === 'light' ? 'Claro' : 'Oscuro'}`}
    >
      {getIcon()}
    </Button>
  );
}
