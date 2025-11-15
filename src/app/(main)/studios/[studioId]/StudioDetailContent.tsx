"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import EditStudioDialog from "./EditStudioDialog";
import MembersDialog from "./MembersDialog";
import StudioCalendar from "./StudioCalendar";
import StudioNotes from "./StudioNotes";
import StudioPosts from "./StudioPosts";
import StudioWorkspace from "./StudioWorkspace";
import Image from "next/image";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import MobileStudioBottomSheet from "@/components/layout/MobileStudioBottomSheet";
import TabletChannelSidebar from "@/components/layout/TabletChannelSidebar";

function WorkspaceRedirect({ studioId }: { studioId: string }) {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  React.useEffect(() => {
    if (!hasRedirected) {
      setHasRedirected(true);
      router.push(`/studios/${studioId}/workspace`);
    }
  }, [router, studioId, hasRedirected]);
  
  return null;
}

export default function StudioDetailContent({ studioId }: { studioId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const tabFromUrl = searchParams.get("tab") || "workspace";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [isTabletSidebarOpen, setIsTabletSidebarOpen] = useState(false);
  const [tabletButtonLeft, setTabletButtonLeft] = useState('1rem'); // 기본값: left-4
  const { setSidebar, discordData, setDiscordSidebar } = useSidebar();
  
  // 테블릿 사이즈에서 서버 사이드바 너비(80px) 고려하여 버튼 위치 조정
  useEffect(() => {
    const updateButtonPosition = () => {
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
      if (isTablet) {
        // 서버 사이드바(80px) + 여유 공간(16px) = 96px
        setTabletButtonLeft('96px');
      } else {
        setTabletButtonLeft('1rem'); // 기본값
      }
    };
    
    updateButtonPosition();
    window.addEventListener('resize', updateButtonPosition);
    return () => window.removeEventListener('resize', updateButtonPosition);
  }, []);

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

  // 소유자 확인 (membershipStatus 또는 직접 비교)
  const isOwner = membershipStatus?.isOwner === true || (currentUser && studio && studio.ownerId === currentUser.id);

  // 관리자 권한 확인 (소유자이거나 ADMIN 멤버)
  const isAdmin = isOwner || membershipStatus?.memberRole === "ADMIN";

  // 스튜디오 상세 페이지에서도 디스코드 사이드바 활성화
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(studioId);
  const [selectedChannel, setSelectedChannel] = useState<string>(activeTab);

  const handleStudioSelect = (studioId: string | null) => {
    setSelectedStudioId(studioId);
    setSelectedChannel('workspace');
  };

  const handleChannelSelect = (channel: string) => {
    setSelectedChannel(channel);
    setActiveTab(channel); // 기존 activeTab도 동기화
    // workspace 탭 클릭 시 대시보드로 리다이렉트
    if (channel === "workspace") {
      router.push(`/studios/${studioId}/workspace`);
    } else {
      router.push(`/studios/${studioId}?tab=${channel}`);
    }
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
    <div className="w-full min-w-0">
      {/* 테블릿: 좌측 상단 사이드바 버튼 (768px~1279px) */}
      <div 
        className="fixed top-4 z-40 hidden sm:flex xl:hidden"
        style={{ left: tabletButtonLeft }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsTabletSidebarOpen(true)}
          className="h-10 w-10 rounded-full bg-white shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* 스튜디오 콘텐츠 - 디스코드 사이드바 우측 칼럼과 연동 */}
      <div className={currentTab === "workspace" ? "w-full h-full" : ""}>
        {currentTab === "posts" && <StudioPosts studioId={studioId} isOwner={isOwner} />}
        {currentTab === "calendar" && <StudioCalendar studioId={studioId} />}
        {currentTab === "notes" && <StudioNotes studioId={studioId} />}
        {currentTab === "workspace" && <WorkspaceRedirect studioId={studioId} />}
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

          {/* 테블릿 채널 사이드바 (좌측 슬라이드, 768px~1279px) */}
          <TabletChannelSidebar
            open={isTabletSidebarOpen}
            onOpenChange={setIsTabletSidebarOpen}
            studioId={studioId}
            studioName={studio.name}
            studio={studio}
            selectedTab={currentTab}
            onTabSelect={handleChannelSelect}
            isOwner={isOwner}
          />

          {/* 모바일 하단 바텀시트 (모바일만, 768px 미만) - 항상 표시 */}
          <MobileStudioBottomSheet
            studioId={studioId}
            studioName={studio.name}
            studio={studio}
            selectedTab={currentTab}
            onTabSelect={handleChannelSelect}
            isOwner={isOwner}
          />
        </>
      )}

      {/* 스튜디오 글쓰기 기능 제거됨 */}
      {/* {isAdmin && (
        <Link href={`/studios/${studioId}/write`}>
          <button className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium">
            <span className="text-xl">✏️</span>
            <span>글쓰기</span>
          </button>
        </Link>
      )} */}
    </div>
  );
}
