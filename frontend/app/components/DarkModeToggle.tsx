"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved preference
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved === "true") {
        setIsDark(true);
        applyDarkMode(true);
      } else {
        applyDarkMode(false);
      }
    } catch (e) {}
  }, []);

  function applyDarkMode(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }

  function toggle() {
    const newDark = !isDark;
    setIsDark(newDark);
    applyDarkMode(newDark);
    try {
      localStorage.setItem("darkMode", String(newDark));
    } catch (e) {}
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={isDark ? "Light Mode" : "Dark Mode"}
      className="fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg backdrop-blur transition-all hover:scale-110"
      style={{
        background: isDark ? "#a78bfa" : "#ffffff",
        color: isDark ? "#ffffff" : "#0d1117",
        border: `2px solid ${isDark ? "#d8b4fe" : "#a78bfa"}`,
      }}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
