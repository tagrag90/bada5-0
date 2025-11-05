"use client";

import Image from "next/image";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-6">
      {/* 개 점프 이미지 */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src="/loading-dog.png" // 이미지 파일 경로 (public 폴더에 저장 필요)
          alt="Loading"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Loading... 텍스트 with 스켈레톤 웨이브 */}
      <div className="relative inline-block">
        <span className="text-lg font-medium text-gray-400 relative z-10">
          Loading...
        </span>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60 rounded blur-sm"
          style={{
            width: "150%",
            height: "100%",
            left: "-25%",
            animation: "skeleton-wave 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

