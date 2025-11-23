"use client";

import React, { Suspense, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useOptionalUser } from "@/app/(main)/SessionProvider";
import { Loader2 } from "lucide-react";

const StudioWorkspace = dynamic(() => import("../../StudioWorkspace"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  ),
});

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

  // 디스코드 사이드바 활성화 (파일 헤더가 사이드바 내부에 표시됨)
  useEffect(() => {
    if (studio) {
      setDiscordSidebar({
        selectedStudioId: studioId,
        selectedChannel: 'workspace',
        onStudioSelect: handleStudioSelect,
        onChannelSelect: handleChannelSelect,
        studioName: studio.name,
        studio: studio,
        isOwner: isOwner,
        fileId: fileId, // 파일 ID 전달
      });
    }
  }, [studio, studioId, isOwner, setDiscordSidebar, handleStudioSelect, handleChannelSelect, fileId]);

  return (
    <div className="w-full h-screen fixed inset-0">
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

