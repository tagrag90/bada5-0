"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface FigmaProgressBarProps {
  value?: number; // 0-100, undefined면 무한 로딩
  className?: string;
  variant?: "top" | "inline" | "center"; // top: 상단 고정, inline: 컴포넌트 내부, center: 중앙 정렬
}

export function FigmaProgressBar({
  value,
  className,
  variant = "top",
}: FigmaProgressBarProps) {
  const isIndeterminate = value === undefined;

  // 중앙 정렬 버전 (피그마 스타일)
  if (variant === "center") {
    const progressValue = value ?? 0;
    return (
      <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
        {/* Bada 로고 */}
        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src="/logo-bada.png"
            alt="Bada Logo"
            fill
            className="object-contain rounded-lg"
          />
        </div>
        
        {/* 프로그레스 바 */}
        <div className="relative w-80 h-[4px] bg-gray-200 overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full bg-gray-800 rounded-full",
              isIndeterminate
                ? "animate-progress-indeterminate-center"
                : "transition-all duration-500 ease-out"
            )}
            style={
              !isIndeterminate
                ? { 
                    width: `${Math.max(0, Math.min(100, progressValue))}%`,
                    minWidth: progressValue > 0 ? "2px" : "0px",
                    willChange: "width" // 부드러운 애니메이션을 위한 최적화
                  }
                : { width: "40%" }
            }
          />
        </div>
      </div>
    );
  }

  // 인라인 버전 (토스트 내부용)
  if (variant === "inline") {
    const progressValue = value ?? 0;
    return (
      <div className={cn("relative w-full h-[4px] bg-gray-200 overflow-hidden rounded-full", className)}>
        <div
          className={cn(
            "h-full bg-gray-800 rounded-full",
            isIndeterminate
              ? "animate-progress-indeterminate-center"
              : "transition-all duration-500 ease-out"
          )}
          style={
            !isIndeterminate
              ? { 
                  width: `${Math.max(0, Math.min(100, progressValue))}%`,
                  minWidth: progressValue > 0 ? "2px" : "0px",
                  willChange: "width"
                }
              : { width: "40%" }
          }
        />
      </div>
    );
  }

  // 상단 고정 버전
  return (
    <div
      className={cn(
        variant === "top"
          ? "fixed top-0 left-0 right-0 z-[9999] h-[2px]"
          : "relative w-full h-[2px]",
        "bg-gray-200 overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-gray-800",
          isIndeterminate
            ? "animate-progress-indeterminate"
            : "transition-all duration-300 ease-out"
        )}
        style={
          !isIndeterminate
            ? { transform: `translateX(-${100 - (value || 0)}%)`, width: "100%" }
            : { width: "40%" }
        }
      />
    </div>
  );
}

