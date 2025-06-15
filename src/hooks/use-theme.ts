"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, _setTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme-color");
    if (storedTheme) {
      document.documentElement.style.setProperty("--background", storedTheme);
      _setTheme(storedTheme);
    }
  }, []);

  const setTheme = (color: string) => {
    document.documentElement.style.setProperty("--background", color);
    localStorage.setItem("theme-color", color);
    _setTheme(color);
  };

  return { theme, setTheme };
} 