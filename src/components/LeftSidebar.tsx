"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import DocsNavSidebar from "@/components/layout/DocsNavSidebar";
import DiscordStyleSidebar from "@/components/layout/DiscordStyleSidebar";
import { usePathname } from "next/navigation";

interface LeftSidebarProps {
  children?: React.ReactNode;
  whoToFollowSlot?: React.ReactNode; // 서버 컴포넌트를 props로 받음
}

export default function LeftSidebar({ children, whoToFollowSlot }: LeftSidebarProps) {
  // 고정 폭 설정
  // 좌측 칼럼 80px + 우측 칼럼 400px = 전체 사이드바 480px
  const width = 480; // 우측 칼럼 400px 포함
  const sidebarRef = useRef<HTMLElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(width);
  const { sidebarType, discordData } = useSidebar();
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');
  
  // 워크스페이스 페이지 감지
  const isWorkspacePage = discordData?.selectedChannel === 'workspace';
  
  // 테블릿 사이즈 감지하여 사이드바 너비 조정
  useEffect(() => {
    const updateWidth = () => {
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth < 768; // md 브레이크포인트 미만
      const isTablet = windowWidth >= 768 && windowWidth < 1280; // md ~ xl 사이
      
      if (isMobile) {
        // 모바일에서는 사이드바가 숨겨지므로 초기값 유지
        setSidebarWidth(width);
      } else if (isTablet && (sidebarType === 'studio' || sidebarType === 'discord' || isSettingsPage)) {
        setSidebarWidth(80); // 테블릿: 서버 리스트 너비만
      } else if (isWorkspacePage && (sidebarType === 'studio' || sidebarType === 'discord' || isSettingsPage)) {
        setSidebarWidth(80); // 워크스페이스: 서버 리스트 너비만
      } else {
        setSidebarWidth(width); // 데스크톱 (워크스페이스 제외): 전체 너비
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [sidebarType, isSettingsPage, width, isWorkspacePage]);

  // 부모 컴포넌트에 너비 전달 (고정값)
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [width]);

  // sidebarType 변경 시 패딩 조정 (설정 페이지는 항상 표시)
  useEffect(() => {
    // 모바일/테블릿/데스크톱 감지
    const updateSidebarWidth = () => {
      const isMobile = window.innerWidth < 768; // md 브레이크포인트 미만
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280; // md ~ xl 사이
      const isDesktop = window.innerWidth >= 1280; // xl 브레이크포인트 이상
      
      if (isMobile) {
        // 모바일에서는 사이드바가 숨겨지므로 0px
        document.documentElement.style.setProperty("--has-sidebar", `0px`);
      } else if (isTablet) {
        // 테블릿에서는 서버 사이드바만 표시 (서버 리스트 너비만)
        if (sidebarType === 'studio' || sidebarType === 'discord' || isSettingsPage) {
          document.documentElement.style.setProperty("--has-sidebar", `80px`); // 서버 리스트 너비만
        } else {
          document.documentElement.style.setProperty("--has-sidebar", `0px`);
        }
      } else {
        // 데스크톱에서는 워크스페이스일 때만 80px, 그 외에는 전체 사이드바 폭 적용
        if (sidebarType !== 'none' || isSettingsPage) {
          if (isWorkspacePage) {
            document.documentElement.style.setProperty("--has-sidebar", `80px`); // 워크스페이스: 서버 리스트 너비만
          } else {
            document.documentElement.style.setProperty("--has-sidebar", `${width}px`); // 그 외: 전체 사이드바 폭
          }
        } else {
          document.documentElement.style.setProperty("--has-sidebar", `0px`);
        }
      }
    };

    // 초기 설정
    updateSidebarWidth();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', updateSidebarWidth);
    
    return () => {
      window.removeEventListener('resize', updateSidebarWidth);
    };
  }, [sidebarType, width, isSettingsPage, isWorkspacePage]);

  // 설정 페이지인 경우 강제로 사이드바 활성화 (데스크톱만)
  useEffect(() => {
    const updateSettingsSidebar = () => {
      const isMobileOrTablet = window.innerWidth < 1280;
      
      if (isSettingsPage && sidebarType === 'none' && !isMobileOrTablet) {
        // 설정 페이지에서는 사이드바를 강제로 표시 (데스크톱만)
        document.documentElement.style.setProperty("--has-sidebar", `${width}px`);
      }
    };

    updateSettingsSidebar();
    window.addEventListener('resize', updateSettingsSidebar);
    
    return () => {
      window.removeEventListener('resize', updateSettingsSidebar);
    };
  }, [isSettingsPage, sidebarType, width]);

  // 사이드바가 필요 없으면 null (단, 설정 페이지는 항상 표시)
  if (sidebarType === 'none' && !isSettingsPage) {
    return null;
  }

  // 설정 페이지는 항상 표시
  const shouldShowSidebar = sidebarType !== 'none' || isSettingsPage;

  if (!shouldShowSidebar) {
    return null;
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border overflow-y-auto hidden md:flex md:flex-col z-30"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* 독스 페이지 */}
        {sidebarType === 'docs' && (
          <DocsNavSidebar />
        )}

        {/* 스튜디오/디스코드 사이드바 (설정 페이지도 포함) - discordData가 없어도 기본 사이드바 표시 */}
        {(sidebarType === 'studio' || sidebarType === 'discord' || isSettingsPage) && (
          <DiscordStyleSidebar
            selectedStudioId={discordData?.selectedStudioId || undefined}
            selectedChannel={discordData?.selectedChannel || 'posts'}
            onStudioSelect={discordData?.onStudioSelect || (() => {})}
            onChannelSelect={discordData?.onChannelSelect || (() => {})}
            isOwner={discordData?.isOwner || false}
            studioName={discordData?.studioName || ""}
            studio={discordData?.studio}
            whoToFollowSlot={
              !discordData?.selectedStudioId && !isSettingsPage
                ? whoToFollowSlot
                : undefined
            }
          />
        )}


        {/* 리사이즈 기능 제거됨 - 고정 폭 유지 */}
      </aside>
    </>
  );
}

