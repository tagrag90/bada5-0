"use client";

import { useState, useEffect, useRef } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import StudioNavSidebar from "@/components/layout/StudioNavSidebar";
import DocsNavSidebar from "@/components/layout/DocsNavSidebar";
import DiscordStyleSidebar from "@/components/layout/DiscordStyleSidebar";

interface LeftSidebarProps {
  children?: React.ReactNode;
}

export default function LeftSidebar({ children }: LeftSidebarProps) {
  const [width, setWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const { sidebarType, sidebarData, discordData } = useSidebar();

  // localStorage에서 저장된 너비 불러오기
  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebar-width");
    if (savedWidth) {
      setWidth(parseInt(savedWidth));
    }
  }, []);

  // 리사이징 시작
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // 리사이징 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      // 최소 200px, 최대 400px
      if (newWidth >= 200 && newWidth <= 400) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        // localStorage에 저장
        localStorage.setItem("sidebar-width", width.toString());
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, width]);

  // 부모 컴포넌트에 너비 전달
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [width]);

  // sidebarType 변경 시 패딩 조정
  useEffect(() => {
    if (sidebarType !== 'none') {
      document.documentElement.style.setProperty("--has-sidebar", `${width}px`);
    } else {
      document.documentElement.style.setProperty("--has-sidebar", `0px`);
    }
  }, [sidebarType, width]);

  // 사이드바가 필요 없으면 null
  if (sidebarType === 'none') {
    return null;
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border overflow-y-auto hidden xl:flex xl:flex-col z-30"
        style={{ width: `${width}px` }}
      >
        {/* 독스 페이지를 제외한 모든 페이지에서 디스코드 사이드바 사용 */}
        {sidebarType === 'docs' && (
          <DocsNavSidebar />
        )}

        {(sidebarType === 'studio' || sidebarType === 'discord') && discordData && (
          <DiscordStyleSidebar
            selectedStudioId={discordData.selectedStudioId || undefined}
            selectedChannel={discordData.selectedChannel}
            onStudioSelect={discordData.onStudioSelect || (() => {})}
            onChannelSelect={discordData.onChannelSelect || (() => {})}
            isOwner={discordData.isOwner || false}
            studioName={discordData.studioName || ""}
            studio={discordData.studio}
          />
        )}


        {/* 리사이즈 핸들 */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:w-1.5 transition-all ${
            isResizing ? "bg-blue-500 w-1.5" : "bg-transparent hover:bg-blue-400"
          }`}
          onMouseDown={startResizing}
        />
      </aside>
    </>
  );
}

