"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useSidebar } from "./SidebarContext";
import { usePathname } from "next/navigation";
import UserProfileButton from "@/components/UserProfileButton";

interface LeftSidebarAreaProps {
  children?: ReactNode;
}

/**
 * 좌측 사이드바 영역 컴포넌트
 * 페이지별로 적절한 블록을 렌더링합니다.
 */
export default function LeftSidebarArea({ children }: LeftSidebarAreaProps) {
  const { sidebarsCollapsed, sidebarType, discordData } = useSidebar();
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');

  // 표시할 블록이 있는지 확인
  const hasContentBlock = useMemo(() => {
    // 설정 페이지는 항상 표시
    if (isSettingsPage) return true;
    
    // 독스 페이지는 항상 표시
    if (sidebarType === 'docs') return true;
    
    // 스튜디오/디스코드 사이드바인 경우
    if (sidebarType === 'studio' || sidebarType === 'discord') {
      // 화이트보드 파일 페이지인 경우에만 우측 칼럼 표시
      const isWorkspaceFilePage = pathname?.match(/\/studios\/[^/]+\/workspace\/[^/]+$/);
      if (isWorkspaceFilePage && discordData?.selectedStudioId && discordData?.fileId) {
        return true;
      }
      // 스튜디오 메인 페이지에서는 우측 칼럼 표시하지 않음
      return false;
    }
    
    // 그 외의 경우는 표시할 블록이 없음
    return false;
  }, [sidebarType, discordData?.selectedStudioId, discordData?.fileId, isSettingsPage, pathname]);

  // 사이드바 너비 결정
  // 접혔을 때는 유저 박스를 포함할 수 있도록 충분한 폭 필요 (약 280px)
  // 펼쳐졌을 때: 표시할 블록이 없으면 서버 사이드바만(80px), 있으면 전체(400px)
  const sidebarWidth = sidebarsCollapsed ? 280 : (hasContentBlock ? 400 : 80);

  // CSS 변수 설정
  useEffect(() => {
    document.documentElement.style.setProperty("--left-sidebar-width", `${sidebarWidth}px`);
  }, [sidebarWidth, sidebarsCollapsed]);

  return (
    <aside 
      className="fixed left-4 bg-card border-2 border-black overflow-hidden hidden md:flex md:flex-col z-30 shadow-sm transition-all duration-300" 
      style={{ 
        width: `${sidebarWidth}px`,
        top: '16px', // 항상 상단에 위치
        bottom: sidebarsCollapsed ? undefined : '16px',
        height: sidebarsCollapsed ? '60px' : undefined,
        borderRadius: '22px'
      }}
    >
      {sidebarsCollapsed ? (
        /* 사이드바 접혔을 때 유저 프로필 버튼 표시 */
        <div className="flex-1 overflow-hidden flex items-center justify-center p-2">
          <UserProfileButton />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      )}
    </aside>
  );
}

