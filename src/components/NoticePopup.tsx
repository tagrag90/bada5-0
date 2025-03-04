"use client";

import Image from "next/image";
import Logo from "@/assets/logo.png";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface NoticePopupProps {
  title: string;
  version?: string;
  status?: string;
}

export function NoticePopup({ title, version, status }: NoticePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 후 1초 후에 팝업 표시
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-4 sm:bottom-8 sm:left-4 md:bottom-4 md:left-4 z-50 max-w-[300px] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
      <div className="relative group">
        {/* 배경 발광 효과 - 블러 효과 강화 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#ffb700] via-[#ff3c3c] to-[#b446dc] rounded-2xl blur-[12px] opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-tilt -z-10"></div>
        
        {/* 실제 컴포넌트 - 테두리 제거 */}
        <div 
          className="relative space-y-3 rounded-2xl bg-black p-4 shadow-md transition-all duration-500 group-hover:scale-[1.03]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="logo"
                width={20}
                height={20}
              />
              <span className="text-sm font-bold text-white">Notice</span>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="rounded-full p-1 transition-all duration-200 hover:bg-gray-800"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <h2 className="text-sm font-medium text-white">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
} 