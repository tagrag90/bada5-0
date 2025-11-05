"use client";

import { FigmaProgressBar } from "@/components/ui/figma-progress-bar";
import { cn } from "@/lib/utils";

interface NodeCreationToastProps {
  isVisible: boolean;
  progress?: number;
}

export default function NodeCreationToast({
  isVisible,
  progress = 0,
}: NodeCreationToastProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 top-4 left-1/2 -translate-x-1/2 z-[9999]",
        "bg-white border border-gray-200 rounded-lg shadow-xl px-6 py-4",
        "transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2"
      )}
      style={{
        minWidth: "320px",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold text-gray-900">노드 생성 중...</div>
        <FigmaProgressBar variant="inline" value={progress} />
      </div>
    </div>
  );
}

