"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleDark = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Fallback force DOM update
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleDark}
      className="flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center text-foreground hover:text-cyan-400 focus:outline-none rounded-lg hover:bg-foreground/5 transition-colors relative overflow-hidden flex-shrink-0"
      aria-label="Toggle Theme"
    >
      <Sun className="w-5 h-5 absolute transition-all scale-100 dark:scale-0 opacity-100 dark:opacity-0" />
      <Moon className="w-5 h-5 absolute transition-all scale-0 dark:scale-100 opacity-0 dark:opacity-100" />
    </button>
  );
}
