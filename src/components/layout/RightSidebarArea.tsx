"use client";

import { ReactNode, useEffect } from "react";
import { useSidebar } from "./SidebarContext";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RightSidebarAreaProps {
  children?: ReactNode;
}

/**
 * 우측 사이드바 영역 컴포넌트
 * 페이지별로 적절한 블록을 렌더링합니다.
 */
export default function RightSidebarArea({ children }: RightSidebarAreaProps) {
  const { sidebarsCollapsed, toggleSidebars } = useSidebar();
  const sidebarHeight = sidebarsCollapsed ? 60 : undefined; // 접혔을 때 높이 60px, 펼쳐졌을 때는 전체 높이

  // CSS 변수 설정 (너비는 항상 320px 유지)
  useEffect(() => {
    document.documentElement.style.setProperty("--right-sidebar-width", "320px");
  }, []);

  return (
    <aside 
      className="fixed right-4 bg-card border-2 border-black overflow-hidden hidden xl:flex xl:flex-col z-30 rounded-lg shadow-sm transition-all duration-300" 
      style={{ 
        width: '320px',
        top: '16px', // 항상 상단에 위치
        bottom: sidebarsCollapsed ? undefined : '16px',
        height: sidebarsCollapsed ? '60px' : undefined
      }}
    >
      {/* 토글 버튼 - 우측 상단 */}
      <div className="flex-shrink-0 p-2 border-b border-gray-200 flex items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebars}
          className="h-6 w-6"
          title={sidebarsCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {sidebarsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      {!sidebarsCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      )}
    </aside>
  );
}

