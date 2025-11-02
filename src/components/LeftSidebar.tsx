"use client";

import { useEffect, useRef } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import DocsNavSidebar from "@/components/layout/DocsNavSidebar";
import DiscordStyleSidebar from "@/components/layout/DiscordStyleSidebar";
import { usePathname } from "next/navigation";

interface LeftSidebarProps {
  children?: React.ReactNode;
}

export default function LeftSidebar({ children }: LeftSidebarProps) {
  // 고정 폭 설정 (우측 칼럼을 1.5배 키우기 위해 전체 사이드바 폭 증가)
  // 좌측 칼럼 80px + 우측 칼럼 기본 약 176px -> 우측 칼럼을 1.5배하면 약 264px
  // 전체 사이드바: 80px + 264px = 344px
  const width = 400; // 최대 폭으로 고정 (우측 칼럼이 넓게 보이도록)
  const sidebarRef = useRef<HTMLElement>(null);
  const { sidebarType, discordData } = useSidebar();
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');

  // 부모 컴포넌트에 너비 전달 (고정값)
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [width]);

  // sidebarType 변경 시 패딩 조정 (설정 페이지는 항상 표시)
  useEffect(() => {
    // 설정 페이지이거나 사이드바가 활성화된 경우
    if (sidebarType !== 'none' || isSettingsPage) {
      document.documentElement.style.setProperty("--has-sidebar", `${width}px`);
    } else {
      document.documentElement.style.setProperty("--has-sidebar", `0px`);
    }
  }, [sidebarType, width, isSettingsPage]);

  // 설정 페이지인 경우 강제로 사이드바 활성화
  useEffect(() => {
    if (isSettingsPage && sidebarType === 'none') {
      // 설정 페이지에서는 사이드바를 강제로 표시
      document.documentElement.style.setProperty("--has-sidebar", `${width}px`);
    }
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
        className="fixed left-0 top-0 h-screen bg-card border-r border-border overflow-y-auto hidden xl:flex xl:flex-col z-30"
        style={{ width: `${width}px` }}
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
          />
        )}


        {/* 리사이즈 기능 제거됨 - 고정 폭 유지 */}
      </aside>
    </>
  );
}

