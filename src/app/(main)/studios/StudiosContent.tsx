"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateStudioDialog from "./CreateStudioDialog";
import Image from "next/image";

export default function StudiosContent() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: studios, isLoading } = useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
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

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 스튜디오</h1>
          <p className="text-muted-foreground mt-1">
            크리에이터 채널을 만들고 관리하세요
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          스튜디오 생성
        </Button>
      </div>

      {/* 스튜디오 목록 */}
      {studios && studios.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio: any) => (
            <Link key={studio.id} href={`/studios/${studio.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative">
                    <Image
                      src={studio.avatarUrl || "/logo-bada.png"}
                      alt={studio.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{studio.name}</h3>
                    {studio.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {studio.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl">🎬</div>
            <div>
              <h3 className="text-xl font-semibold">
                아직 스튜디오가 없습니다
              </h3>
              <p className="text-muted-foreground mt-2">
                첫 번째 스튜디오를 만들고 크리에이터로 활동하세요
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              스튜디오 생성하기
            </Button>
          </div>
        </Card>
      )}

      {/* 생성 다이얼로그 */}
      <CreateStudioDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

