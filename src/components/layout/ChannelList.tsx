"use client";

import { FileText, Calendar, StickyNote, Edit3, Users, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StudioContentListProps {
  studioId: string;
  studioName: string;
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  isOwner?: boolean;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function StudioContentList({
  studioId,
  studioName,
  selectedTab = "posts",
  onTabSelect,
  isOwner = false,
}: StudioContentListProps) {

  return (
    <div className="flex h-full w-full flex-col bg-white text-black">
      <div className="space-y-4 p-4 pb-20">
        {/* 스튜디오 제목 */}
        <div className="px-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            STUDIO
          </h3>
          <p className="text-base font-bold truncate">{studioName}</p>
        </div>

        <Separator />

        {/* 네비게이션 메뉴 */}
        <nav className="space-y-1">
          <NavItem
            icon={FileText}
            label="포스트"
            active={selectedTab === "posts"}
            onClick={() => onTabSelect("posts")}
          />
          <NavItem
            icon={Calendar}
            label="캘린더"
            active={selectedTab === "calendar"}
            onClick={() => onTabSelect("calendar")}
          />
          <NavItem
            icon={StickyNote}
            label="메모"
            active={selectedTab === "notes"}
            onClick={() => onTabSelect("notes")}
          />
        </nav>

        {/* 소유자 전용 메뉴 */}
        {isOwner && (
          <>
            <Separator />
            <div className="space-y-1">
              {/* 스튜디오 글쓰기 기능 제거됨 */}
              {/* <Link href={`/studios/${studioId}/write`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  새 글 쓰기
                </Button>
              </Link> */}
              <NavItem
                icon={Users}
                label="멤버 관리"
                onClick={() => {
                  const event = new CustomEvent('openMembersDialog');
                  window.dispatchEvent(event);
                }}
              />
              <NavItem
                icon={Settings}
                label="설정"
                onClick={() => {
                  const event = new CustomEvent('openSettingsDialog');
                  window.dispatchEvent(event);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
