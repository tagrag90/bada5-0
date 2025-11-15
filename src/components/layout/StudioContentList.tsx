"use client";

import { FileText, Calendar, StickyNote, Edit3, Users, Settings, ChevronDown, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StudioInfoCard from "./StudioInfoCard";
import { useQuery } from "@tanstack/react-query";
import { useOptionalUser } from "@/app/(main)/SessionProvider";

interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  ownerId?: string;
  _count: {
    members: number;
    events: number;
  };
  subscribersCount: number;
}

interface StudioContentListProps {
  studioId: string;
  studioName: string;
  studio?: Studio;
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
  studio,
  selectedTab = "posts",
  onTabSelect,
  isOwner = false,
}: StudioContentListProps) {
  const currentUser = useOptionalUser();

  // 멤버십 상태 확인
  const { data: membershipStatus } = useQuery({
    queryKey: ["studio-membership", studioId],
    queryFn: async () => {
      if (!studioId || !currentUser) return null;
      const res = await fetch(`/api/studios/${studioId}/subscription-status`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!studioId && !!currentUser,
  });

  // 소유자 확인 (prop 또는 membershipStatus 확인)
  const actualIsOwner: boolean = isOwner || membershipStatus?.isOwner === true || (currentUser && studio && studio.ownerId === currentUser.id) || false;
  
  // 관리자 권한 확인 (소유자이거나 ADMIN 멤버)
  const isAdmin = actualIsOwner || membershipStatus?.memberRole === "ADMIN";

  return (
    <div className="flex h-full w-full flex-col bg-white text-black">
      {/* 스튜디오 정보 카드 컴포넌트 - 워크스페이스에서는 숨김 (호버 컴포넌트로 대체) */}
      {selectedTab !== "workspace" && (
        <StudioInfoCard studio={studio} studioName={studioName} isOwner={actualIsOwner} isAdmin={isAdmin} />
      )}

      <div className="space-y-4 p-4 pb-20">

        {/* 네비게이션 메뉴 */}
        <nav className="space-y-1">
          <NavItem
            icon={Network}
            label="워크스페이스"
            active={selectedTab === "workspace"}
            onClick={() => onTabSelect("workspace")}
          />
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

        {/* 관리자 전용 메뉴 */}
        {isAdmin && (
          <>
            <Separator />
            <div className="space-y-1">
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
                  window.location.href = `/studios/${studioId}/settings`;
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
