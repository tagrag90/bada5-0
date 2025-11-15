"use client";

import React, { Suspense, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import StudioWorkspace from "../../StudioWorkspace";
import WorkspaceFileHeader from "./WorkspaceFileHeader";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useOptionalUser } from "@/app/(main)/SessionProvider";

function WorkspaceFileContent() {
  const params = useParams();
  const router = useRouter();
  const { setDiscordSidebar } = useSidebar();
  const currentUser = useOptionalUser();
  const studioId = params.studioId as string;
  const fileId = params.fileId as string;

  // 스튜디오 정보 조회
  const { data: studio } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) throw new Error("Failed to fetch studio");
      return res.json();
    },
  });

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

  // 소유자 확인
  const isOwner = membershipStatus?.isOwner === true || (currentUser && studio && studio.ownerId === currentUser.id);

  // 디스코드 사이드바 활성화
  const handleStudioSelect = useCallback((newStudioId: string | null) => {
    if (newStudioId) {
      router.push(`/studios/${newStudioId}/workspace`);
    } else {
      router.push("/studios");
    }
  }, [router]);

  const handleChannelSelect = useCallback((channel: string) => {
    if (channel === "workspace") {
      router.push(`/studios/${studioId}/workspace`);
    } else {
      router.push(`/studios/${studioId}?tab=${channel}`);
    }
  }, [studioId, router]);

  // 디스코드 사이드바 설정
  useEffect(() => {
    if (studio) {
      const fullStudioData = {
        id: studio.id,
        name: studio.name,
        slug: studio.slug,
        description: studio.description,
        avatarUrl: studio.avatarUrl,
        bannerUrl: studio.bannerUrl,
        socialLinks: studio.socialLinks,
        _count: studio._count,
        subscribersCount: studio.subscribersCount,
      };

      setDiscordSidebar({
        selectedStudioId: studioId,
        selectedChannel: "workspace",
        onStudioSelect: handleStudioSelect,
        onChannelSelect: handleChannelSelect,
        studioName: studio.name,
        studio: fullStudioData,
        isOwner,
      });
    }
  }, [studioId, studio, isOwner, setDiscordSidebar, handleStudioSelect, handleChannelSelect]);

  return (
    <div className="w-full h-full relative">
      {/* 파일 헤더 */}
      <WorkspaceFileHeader studioId={studioId} fileId={fileId} />
      
      {/* 화이트보드 */}
      <div className="w-full h-full">
        <StudioWorkspace studioId={studioId} fileId={fileId} />
      </div>
    </div>
  );
}

export default function WorkspaceFilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩 중...</div>}>
      <WorkspaceFileContent />
    </Suspense>
  );
}

