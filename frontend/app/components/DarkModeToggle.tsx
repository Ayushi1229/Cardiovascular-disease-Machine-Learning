"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        const dark = saved === "true";
        setIsDark(dark);
        applyTheme(dark);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
        applyTheme(prefersDark);
      }
    } catch (e) {
      console.error("Theme load error:", e);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function applyTheme(dark: boolean) {
    const body = document.body;
    const html = document.documentElement;
    
    if (dark) {
      body.classList.add("dark-mode");
      html.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
      html.classList.remove("dark-mode");
    }
  }

  function toggle() {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
    try {
      localStorage.setItem("darkMode", String(newDark));
    } catch (e) {
      console.error("Theme save error:", e);
    }
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={isDark ? "Light Mode (Pastel)" : "Dark Mode (Neon)"}
      className="fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95 duration-300"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: isDark ? "#00ff88" : "#ffffff",
        color: isDark ? "#0a0e27" : "#0d1117",
        border: `2px solid ${isDark ? "#00ff88" : "#a78bfa"}`,
        boxShadow: isDark 
          ? "0 0 20px rgba(0, 255, 136, 0.4)" 
          : "0 4px 12px rgba(167, 139, 250, 0.15)",
      }}
    >
      {isDark ? (
        <Sun className="w-5 h-5" strokeWidth={2} />
      ) : (
        <Moon className="w-5 h-5" strokeWidth={2} />
      )}
    </button>
  );
}
