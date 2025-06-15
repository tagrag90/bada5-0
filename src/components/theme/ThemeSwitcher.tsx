"use client";

import { useTheme } from "@/hooks/use-theme";

// TODO: 사용자로부터 지정받을 색상 목록
const themes = [
  { name: "서해바다", color: "#E2E8FF" },
  { name: "동해바다", color: "#3C6B99" },
  { name: "라이트", color: "#F5F8FA" },
  { name: "Divetobada", color: "#444444" },
];

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <div className="rounded-2xl bg-card p-4">
      <h2 className="text-lg font-bold">테마 변경</h2>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setTheme(theme.color)}
            className="flex items-center gap-3 rounded-md border p-2 hover:bg-accent"
          >
            <div
              className="h-6 w-6 rounded-full border"
              style={{ backgroundColor: theme.color }}
            />
            <span>{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 