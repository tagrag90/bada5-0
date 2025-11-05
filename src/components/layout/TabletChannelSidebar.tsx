"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import StudioContentList from "./StudioContentList";
import { useEffect } from "react";

interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  _count: {
    members: number;
    events: number;
  };
  subscribersCount: number;
}

interface TabletChannelSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioName: string;
  studio?: Studio;
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  isOwner?: boolean;
}

export default function TabletChannelSidebar({
  open,
  onOpenChange,
  studioId,
  studioName,
  studio,
  selectedTab,
  onTabSelect,
  isOwner,
}: TabletChannelSidebarProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  return (
    <>
      {/* 오버레이 배경 (투명) - 클릭 시 닫기 */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open ? "bg-transparent opacity-0" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      />

      {/* 사이드바 */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-[280px] max-w-[85vw] bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">채널</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 채널 목록 */}
          <div className="flex-1 overflow-y-auto">
            <StudioContentList
              studioId={studioId}
              studioName={studioName}
              studio={studio}
              selectedTab={selectedTab}
              onTabSelect={(tab) => {
                onTabSelect(tab);
                onOpenChange(false);
              }}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>
    </>
  );
}

