import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const shade = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [accentColor, setAccentColorState] = useState(() => {
    if (typeof window === "undefined") return "#5B4CF7";
    return localStorage.getItem("accentColor") || "#5B4CF7";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-purple", accentColor);
    document.documentElement.style.setProperty("--hover-purple", shade(accentColor, -12));
    localStorage.setItem("accentColor", accentColor);
  }, [accentColor]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const setTheme = (mode) => setDarkMode(mode === "dark");
  const setAccentColor = (hex) => setAccentColorState(hex);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, setTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};