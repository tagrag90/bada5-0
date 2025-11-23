"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import DocsNavSidebar from "@/components/layout/DocsNavSidebar";
import DiscordStyleSidebar from "@/components/layout/DiscordStyleSidebar";
import ServerList from "@/components/layout/ServerList";
import CreateStudioDialog from "@/app/(main)/studios/CreateStudioDialog";
import { usePathname } from "next/navigation";
import { shouldShowRightColumn } from "@/lib/sidebar-utils";

interface LeftSidebarProps {
  children?: React.ReactNode;
  whoToFollowSlot?: React.ReactNode; // 서버 컴포넌트를 props로 받음
}

export default function LeftSidebar({ children, whoToFollowSlot }: LeftSidebarProps) {
  // 고정 폭 설정
  // 서버 사이드바(80px) + 우측 칼럼(320px) = 400px
  const serverListWidth = 80;
  const rightColumnWidth = 320;
  const totalWidth = serverListWidth + rightColumnWidth; // 400px
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(totalWidth);
  const { sidebarType, discordData, sidebarsCollapsed } = useSidebar();
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');
  const [showCreateStudioDialog, setShowCreateStudioDialog] = useState(false);
  
  // 사이드바 너비 설정 (고정값)
  useEffect(() => {
    const updateWidth = () => {
      const windowWidth = window.innerWidth;
      const isMobile = windowWidth < 768; // md 브레이크포인트 미만
      
      if (isMobile) {
        // 모바일에서는 사이드바가 숨겨지므로 초기값 유지
        setSidebarWidth(totalWidth);
      } else {
        setSidebarWidth(totalWidth); // 데스크톱: 전체 너비
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [sidebarType, isSettingsPage, totalWidth]);

  // 부모 컴포넌트에 너비 전달 (고정값)
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", `${totalWidth}px`);
  }, [totalWidth]);

  // sidebarType 변경 시 패딩 조정 (설정 페이지는 항상 표시)
  useEffect(() => {
    // 모바일/데스크톱 감지
    const updateSidebarWidth = () => {
      const isMobile = window.innerWidth < 768; // md 브레이크포인트 미만
      
      if (isMobile) {
        // 모바일에서는 사이드바가 숨겨지므로 0px
        document.documentElement.style.setProperty("--has-sidebar", `0px`);
      } else {
        // 데스크톱에서는 사이드바가 표시될 때 전체 사이드바 폭 적용
        if (sidebarType !== 'none' || isSettingsPage) {
          document.documentElement.style.setProperty("--has-sidebar", `${totalWidth}px`); // 전체 사이드바 폭
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
  }, [sidebarType, totalWidth, isSettingsPage]);

  // 설정 페이지인 경우 강제로 사이드바 활성화 (데스크톱만)
  useEffect(() => {
    const updateSettingsSidebar = () => {
      const isMobileOrTablet = window.innerWidth < 1280;
      
      if (isSettingsPage && sidebarType === 'none' && !isMobileOrTablet) {
        // 설정 페이지에서는 사이드바를 강제로 표시 (데스크톱만)
        document.documentElement.style.setProperty("--has-sidebar", `${totalWidth}px`);
      }
    };

    updateSettingsSidebar();
    window.addEventListener('resize', updateSettingsSidebar);
    
    return () => {
      window.removeEventListener('resize', updateSettingsSidebar);
    };
  }, [isSettingsPage, sidebarType, totalWidth]);

  // 서버 사이드바는 항상 표시 (표시할 블록이 없어도 서버 리스트는 보여야 함)

  return (
    <>
      <div
        ref={sidebarRef}
        className="w-full h-full overflow-hidden flex flex-col"
      >
        {!sidebarsCollapsed && (
          <>
            {/* 독스 페이지 */}
            {sidebarType === 'docs' && (
              <div className="w-full h-full overflow-y-auto">
                <DocsNavSidebar />
              </div>
            )}

            {/* 서버 사이드바는 항상 표시 (독스 페이지가 아닐 때) */}
            {sidebarType !== 'docs' && (
              <div className="flex h-full w-full">
                {/* 좌측: 서버 리스트 (항상 표시) */}
                <div className="flex-shrink-0 border-r border-border overflow-y-auto" style={{ width: `${serverListWidth}px` }}>
                  <ServerList
                    selectedStudioId={discordData?.selectedStudioId || undefined}
                    onStudioSelect={discordData?.onStudioSelect || (() => {})}
                    onCreateStudio={() => setShowCreateStudioDialog(true)}
                  />
                </div>

                {/* 우측: 채널 목록 또는 설정 사이드바 (통합 로직 사용) */}
                {shouldShowRightColumn(pathname, discordData) ? (
                  <div className="flex-1 overflow-y-auto" style={{ width: `${rightColumnWidth}px` }}>
                    <DiscordStyleSidebar
                      selectedStudioId={discordData?.selectedStudioId || undefined}
                      selectedChannel={discordData?.selectedChannel || 'posts'}
                      onStudioSelect={discordData?.onStudioSelect || (() => {})}
                      onChannelSelect={discordData?.onChannelSelect || (() => {})}
                      isOwner={discordData?.isOwner || false}
                      studioName={discordData?.studioName || ""}
                      studio={discordData?.studio}
                      fileId={discordData?.fileId}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>

      {/* 스튜디오 생성 다이얼로그 */}
      <CreateStudioDialog
        open={showCreateStudioDialog}
        onOpenChange={setShowCreateStudioDialog}
      />
    </>
  );
}

