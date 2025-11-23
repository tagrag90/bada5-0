"use client";

import React from "react";
import { Move, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeToggleButtonProps {
  mode: "drag" | "select";
  onModeChange: (mode: "drag" | "select") => void;
}

export default function ModeToggleButton({ mode, onModeChange }: ModeToggleButtonProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={() => onModeChange("drag")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
            mode === "drag"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          )}
          title="드래그 모드 (캔버스 이동)"
        >
          <Move className="w-4 h-4" />
          <span className="text-sm font-medium">드래그</span>
        </button>
        <button
          onClick={() => onModeChange("select")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
            mode === "select"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          )}
          title="선택 모드 (박스 선택)"
        >
          <MousePointer2 className="w-4 h-4" />
          <span className="text-sm font-medium">선택</span>
        </button>
      </div>
    </div>
  );
}

