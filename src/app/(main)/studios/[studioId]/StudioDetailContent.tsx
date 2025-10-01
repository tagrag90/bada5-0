"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EditStudioDialog from "./EditStudioDialog";
import MembersDialog from "./MembersDialog";
import StudioCalendar from "./StudioCalendar";
import StudioNotes from "./StudioNotes";
import Image from "next/image";

export default function StudioDetailContent({ studioId }: { studioId: string }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const { data: studio, isLoading } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) throw new Error("Failed to fetch studio");
      return res.json();
    },
  });

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
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* 배너 이미지 */}
      {studio.bannerUrl && (
        <Card className="overflow-hidden">
          <div className="relative w-full aspect-[21/9]">
            <Image
              src={studio.bannerUrl}
              alt="Studio banner"
              fill
              className="object-cover"
            />
          </div>
        </Card>
      )}

      {/* 헤더 */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative">
                <Image
                  src={studio.avatarUrl || "/logo-bada.png"}
                  alt={studio.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{studio.name}</h1>
                <p className="text-muted-foreground">@{studio.slug}</p>
              </div>
            </div>
            {studio.description && (
              <p className="text-muted-foreground">{studio.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <span>구독자 {studio.subscribersCount}</span>
              <span>멤버 {studio._count.members}</span>
              <span>이벤트 {studio._count.events}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  studio.type === "PERSONAL"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {studio.type === "PERSONAL" ? "개인" : "팀"}
              </span>
              {studio.isVerified && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  인증됨
                </span>
              )}
              {!studio.isPublic && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  비공개
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowMembersDialog(true)}>
              멤버
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
              설정
            </Button>
          </div>
        </div>
      </Card>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-card">
          <TabsTrigger value="events">이벤트</TabsTrigger>
          <TabsTrigger value="calendar">캘린더</TabsTrigger>
          <TabsTrigger value="notes">메모</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🎫</div>
              <div>
                <h3 className="text-xl font-semibold">아직 이벤트가 없습니다</h3>
                <p className="text-muted-foreground mt-2">
                  첫 번째 이벤트를 만들고 티켓을 발급하세요
                </p>
              </div>
              <Button size="lg">이벤트 만들기</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <StudioCalendar studioId={studioId} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <StudioNotes studioId={studioId} />
        </TabsContent>
      </Tabs>

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
    </div>
  );
}

