"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "tjkt-theme",
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem(storageKey) as Theme) ?? defaultTheme;
    setThemeState(stored);
  }, [storageKey, defaultTheme]);

  useEffect(() => {
    if (!mounted) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const resolved = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
    setResolvedTheme(resolved);

    const root = document.documentElement;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    } else {
      root.setAttribute(attribute, resolved);
    }

    const onChange = () => {
      if (theme === "system") {
        const newResolved = mq.matches ? "dark" : "light";
        setResolvedTheme(newResolved);
        if (attribute === "class") {
          root.classList.remove("light", "dark");
          root.classList.add(newResolved);
        } else {
          root.setAttribute(attribute, newResolved);
        }
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, mounted, attribute]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  // Avoid hydration mismatch — render children invisibly until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
