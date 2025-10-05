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
import StudioBadge from "@/components/StudioBadge";
import SocialLinks from "@/components/SocialLinks";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { useSidebar } from "@/components/layout/SidebarContext";
import StudioNavSidebar from "@/components/layout/StudioNavSidebar";

export default function StudioDetailContent({ studioId }: { studioId: string }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { setSidebar } = useSidebar();
  
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

  const isOwner = currentUser && studio && studio.ownerId === currentUser.id;

  // 사이드바 설정 및 이벤트 리스너
  useEffect(() => {
    if (studio) {
      setSidebar('studio', {
        studioId,
        studioName: studio.name,
        isOwner,
        activeTab,
        onTabChange: setActiveTab,
      });
    }

    // 다이얼로그 열기 이벤트 리스너
    const handleOpenMembers = () => setShowMembersDialog(true);
    const handleOpenSettings = () => setShowEditDialog(true);

    window.addEventListener('openMembersDialog', handleOpenMembers);
    window.addEventListener('openSettingsDialog', handleOpenSettings);

    // 클린업
    return () => {
      setSidebar('none');
      window.removeEventListener('openMembersDialog', handleOpenMembers);
      window.removeEventListener('openSettingsDialog', handleOpenSettings);
    };
  }, [studio, studioId, isOwner, activeTab, setSidebar]);

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
      {/* 프로필 카드 (배너 포함) */}
      <Card className="overflow-hidden" style={{ borderRadius: "1.5rem" }}>
        {/* 배너 이미지 */}
        {studio.bannerUrl && (
          <div className="relative w-full aspect-[21/9]">
            <Image
              src={studio.bannerUrl}
              alt="Studio banner"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* 프로필 정보 */}
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{studio.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>@{studio.slug}</span>
                  <StudioBadge size="sm" />
                </div>
                
                {studio.description && (
                  <div className="mt-4 overflow-hidden whitespace-pre-line break-words">
                    {studio.description}
                  </div>
                )}

                {/* 소셜 링크 */}
                {studio.socialLinks && studio.socialLinks.length > 0 && (
                  <div className="mt-4">
                    <SocialLinks links={studio.socialLinks} />
                  </div>
                )}
              </div>

              {/* 프로필 사진 */}
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden relative flex-shrink-0">
                <Image
                  src={studio.avatarUrl || "/logo-bada.png"}
                  alt={studio.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-8 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">
                  {formatNumber(studio._count.events)}
                </span>
                <span className="text-muted-foreground">Post</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">
                  {formatNumber(studio._count.members)}
                </span>
                <span className="text-muted-foreground">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">
                  {formatNumber(studio.subscribersCount)}
                </span>
                <span className="text-muted-foreground">Followers</span>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex items-center justify-end gap-2">
              {isOwner ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                  >
                    Edit profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowMembersDialog(true)}
                  >
                    멤버
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-black text-white hover:bg-black/90"
                  >
                    구독
                  </Button>
                  <Button variant="outline" size="sm">
                    메시지
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 탭 네비게이션 */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* 좌측 정렬 뱃지 스타일 탭 */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === "posts"
                  ? "bg-black text-white border-2 border-black"
                  : "bg-transparent text-foreground border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              포스트
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === "calendar"
                  ? "bg-black text-white border-2 border-black"
                  : "bg-transparent text-foreground border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              캘린더
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === "notes"
                  ? "bg-black text-white border-2 border-black"
                  : "bg-transparent text-foreground border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              메모
            </button>
          </div>

        <TabsContent value="posts" className="mt-6">
          <StudioPosts studioId={studioId} isOwner={isOwner} />
        </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <StudioCalendar studioId={studioId} />
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <StudioNotes studioId={studioId} />
          </TabsContent>
        </Tabs>
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
