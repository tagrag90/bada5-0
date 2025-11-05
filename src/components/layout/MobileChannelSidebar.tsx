"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import StudioContentList from "./StudioContentList";
import { cn } from "@/lib/utils";

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

interface MobileChannelSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioName: string;
  studio?: Studio;
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  isOwner?: boolean;
}

export default function MobileChannelSidebar({
  open,
  onOpenChange,
  studioId,
  studioName,
  studio,
  selectedTab,
  onTabSelect,
  isOwner,
}: MobileChannelSidebarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overlay를 투명하게 만들어 모달 느낌 제거 */}
      <DialogContent
        className={cn(
          "fixed left-0 top-0 h-full w-[280px] max-w-[85vw] translate-x-0 translate-y-0 p-0 rounded-none gap-0",
          "data-[state=closed]:slide-out-to-left data-[state=closed]:duration-300",
          "data-[state=open]:slide-in-from-left data-[state=open]:duration-300",
          "xl:hidden [&>button]:hidden"
        )}
        style={{
          pointerEvents: 'auto',
        }}
      >
        <div className="flex h-full flex-col bg-white">
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
                onOpenChange(false); // 탭 선택 시 사이드바 닫기
              }}
              isOwner={isOwner}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

