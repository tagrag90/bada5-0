"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Plus, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useOptionalUser } from "@/app/(main)/SessionProvider";

export default function WorkspaceDashboard() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setDiscordSidebar } = useSidebar();
  const currentUser = useOptionalUser();
  const studioId = params.studioId as string;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

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

  // 소유자 및 관리자 확인
  const isOwner = membershipStatus?.isOwner === true || (currentUser && studio && studio.ownerId === currentUser.id);
  const isAdmin = isOwner || membershipStatus?.memberRole === "ADMIN";

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
      // 이미 워크스페이스 페이지에 있으므로 이동 불필요
      return;
    } else {
      router.push(`/studios/${studioId}?tab=${channel}`);
    }
  }, [studioId, router]);

  // 디스코드 사이드바 설정
  React.useEffect(() => {
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

  // 파일 목록 조회
  const { data: files, isLoading } = useQuery({
    queryKey: ["workspace-files", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json();
    },
  });

  // 파일 생성
  const createFileMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/studios/${studioId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create file");
      }
      return res.json();
    },
    onSuccess: (newFile) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-files", studioId] });
      setIsCreateDialogOpen(false);
      setNewFileName("");
      toast({
        title: "파일 생성 완료",
        description: "새 파일이 생성되었습니다.",
      });
      // 새 파일의 화이트보드로 이동
      router.push(`/studios/${studioId}/workspace/${newFile.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "파일 생성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "파일 이름 필요",
        description: "파일 이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    createFileMutation.mutate(newFileName.trim());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">워크스페이스</h1>
        <p className="text-gray-600">파일을 선택하거나 새로 만드세요</p>
      </div>

      {/* 파일 생성 버튼 */}
      <div className="mb-6">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          새 파일 만들기
        </Button>
      </div>

      {/* 파일 그리드 */}
      {files && files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file: any) => (
            <div
              key={file.id}
              onClick={() => router.push(`/studios/${studioId}/workspace/${file.id}`)}
              className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-md transition-all bg-white"
            >
              {/* 썸네일 영역 */}
              <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* 파일 정보 */}
              <div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {file.name}
                </h3>
                {file.description && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {file.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{file._count?.nodes || 0}개 노드</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(file.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>아직 파일이 없습니다.</p>
          <p className="text-sm mt-2">새 파일을 만들어 시작하세요.</p>
        </div>
      )}

      {/* 파일 생성 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 파일 만들기</DialogTitle>
            <DialogDescription>
              워크스페이스에 새 파일을 만듭니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">파일 이름</label>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="예: 프로젝트 계획"
                className="mt-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFile();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setNewFileName("");
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateFile}
              disabled={createFileMutation.isPending}
            >
              {createFileMutation.isPending ? "생성 중..." : "만들기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

