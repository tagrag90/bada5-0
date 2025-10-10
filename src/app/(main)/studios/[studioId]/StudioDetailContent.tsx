"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import EditStudioDialog from "./EditStudioDialog";
import MembersDialog from "./MembersDialog";
import StudioCalendar from "./StudioCalendar";
import StudioNotes from "./StudioNotes";
import StudioPosts from "./StudioPosts";
import Image from "next/image";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useRouter } from "next/navigation";

export default function StudioDetailContent({ studioId }: { studioId: string }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { setSidebar, discordData, setDiscordSidebar } = useSidebar();

  const { data: studio, isLoading } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) throw new Error("Failed to fetch studio");
      return res.json();
    },
  });

  // 현재 로그인한 유저 가져오기
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  // 디스코드 사이드바에 스튜디오 정보 전달
  useEffect(() => {
    if (discordData && studio) {
      discordData.studioName = studio.name;
    }
  }, [discordData, studio]);

  // 디스코드 사이드바에서 선택된 채널 사용 (우선순위)
  const currentTab = discordData?.selectedChannel || activeTab;

  const isOwner = currentUser && studio && studio.ownerId === currentUser.id;

  // 스튜디오 상세 페이지에서도 디스코드 사이드바 활성화
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(studioId);
  const [selectedChannel, setSelectedChannel] = useState<string>(activeTab);

  const handleStudioSelect = (studioId: string | null) => {
    setSelectedStudioId(studioId);
    setSelectedChannel('posts');
  };

  const handleChannelSelect = (channel: string) => {
    setSelectedChannel(channel);
    setActiveTab(channel); // 기존 activeTab도 동기화
  };

  // 디스코드 사이드바 활성화
  useEffect(() => {
    if (studio) {
      // 스튜디오 데이터를 완전하게 전달
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
        selectedChannel: selectedChannel,
        onStudioSelect: handleStudioSelect,
        onChannelSelect: handleChannelSelect,
        studioName: studio.name,
        studio: fullStudioData,
        isOwner,
      });
    }
  }, [studioId, selectedChannel, studio, isOwner, setDiscordSidebar]);

  // 이벤트 리스너 설정
  useEffect(() => {
    // 다이얼로그 열기 이벤트 리스너
    const handleOpenMembers = () => setShowMembersDialog(true);
    const handleOpenSettings = () => setShowEditDialog(true);

    window.addEventListener('openMembersDialog', handleOpenMembers);
    window.addEventListener('openSettingsDialog', handleOpenSettings);

    // 클린업
    return () => {
      window.removeEventListener('openMembersDialog', handleOpenMembers);
      window.removeEventListener('openSettingsDialog', handleOpenSettings);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">스튜디오를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* 간단한 스튜디오 헤더 (Reddit 스타일) */}
      <div className="flex items-center gap-4 py-4">
        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
          <Image
            src={studio.avatarUrl || "/logo-bada.png"}
            alt={studio.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{studio.name}</h1>
          <p className="text-muted-foreground">@{studio.slug}</p>
        </div>
        {isOwner && (
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              설정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMembersDialog(true)}
            >
              멤버
            </Button>
          </div>
        )}
      </div>

      {/* 스튜디오 콘텐츠 - 디스코드 사이드바 우측 칼럼과 연동 */}
      <div className="mt-6">
        {currentTab === "posts" && <StudioPosts studioId={studioId} isOwner={isOwner} />}
        {currentTab === "calendar" && <StudioCalendar studioId={studioId} />}
        {currentTab === "notes" && <StudioNotes studioId={studioId} />}
      </div>

      {/* 다이얼로그들 */}
      {studio && (
        <>
          <EditStudioDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            studio={studio}
          />
          <MembersDialog
            open={showMembersDialog}
            onOpenChange={setShowMembersDialog}
            studioId={studioId}
          />
        </>
      )}

      {/* 중앙 하단 Floating 글쓰기 버튼 (소유자만) */}
      {isOwner && (
        <Link href={`/studios/${studioId}/write`}>
          <button className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium">
            <span className="text-xl">✏️</span>
            <span>글쓰기</span>
          </button>
        </Link>
      )}
    </div>
  );
}
