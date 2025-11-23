"use client";

import StudioProfileCard from "@/components/StudioProfileCard";
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

export default function StudioContentList({
  studioId,
  studioName,
  studio,
  selectedTab = "posts",
  onTabSelect,
  isOwner = false,
}: StudioContentListProps) {
  const currentUser = useOptionalUser();

  // studio prop이 없으면 직접 가져오기
  const { data: fetchedStudio } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      if (!studioId) return null;
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!studioId && !studio,
  });

  // studio prop 또는 fetchedStudio 사용
  const displayStudio = studio || fetchedStudio;
  const displayStudioName = studioName || displayStudio?.name || "";

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
  const actualIsOwner: boolean = isOwner || membershipStatus?.isOwner === true || (currentUser && displayStudio && displayStudio.ownerId === currentUser.id) || false;
  
  // 관리자 권한 확인 (소유자이거나 ADMIN 멤버)
  const isAdmin = actualIsOwner || membershipStatus?.memberRole === "ADMIN";

  return (
    <div className="flex h-full w-full flex-col bg-white text-black overflow-y-auto">
      {/* 스튜디오 프로필 카드 컴포넌트 */}
      {displayStudio && (
        <div className="flex-shrink-0">
          <StudioProfileCard
            studio={displayStudio}
            studioName={displayStudioName}
            studioId={studioId}
            isOwner={actualIsOwner}
            isAdmin={isAdmin}
            selectedTab={selectedTab}
            onTabSelect={onTabSelect}
          />
        </div>
      )}
    </div>
  );
}
