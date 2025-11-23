"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Plus, FileText, Clock, Image as ImageIcon } from "lucide-react";
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
import MembersDialog from "../MembersDialog";
import EditStudioDialog from "../EditStudioDialog";

export default function WorkspaceDashboard() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setDiscordSidebar, setSidebar } = useSidebar();
  const currentUser = useOptionalUser();
  const studioId = params.studioId as string;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const [thumbnailGenerationProgress, setThumbnailGenerationProgress] = useState({ current: 0, total: 0 });

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

  // 디스코드 사이드바 활성화 (다른 페이지와 동일하게)
  React.useEffect(() => {
    if (studio) {
      setDiscordSidebar({
        selectedStudioId: studioId,
        selectedChannel: 'workspace',
        onStudioSelect: handleStudioSelect,
        onChannelSelect: handleChannelSelect,
        studioName: studio.name,
        studio: studio,
        isOwner: isOwner,
      });
    }
  }, [studio, studioId, isOwner, setDiscordSidebar, handleStudioSelect, handleChannelSelect]);

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

  // 단일 파일 썸네일 생성 핸들러 (백그라운드에서 생성)
  const handleSingleThumbnailGeneration = useCallback(async (fileId: string) => {
    try {
      // 숨겨진 iframe에서 파일을 로드하여 썸네일 생성
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.width = '1920px';
      iframe.style.height = '1080px';
      iframe.src = `/studios/${studioId}/workspace/${fileId}?generateThumbnail=true`;
      
      document.body.appendChild(iframe);
      
      // iframe이 로드되고 썸네일 생성이 완료될 때까지 대기
      await new Promise((resolve) => {
        let resolved = false;
        
        // postMessage로 썸네일 생성 완료 감지
        const messageListener = (event: MessageEvent) => {
          if (event.data?.type === 'thumbnailGenerated' && event.data?.fileId === fileId) {
            if (!resolved) {
              resolved = true;
              window.removeEventListener('message', messageListener);
              clearTimeout(timeout);
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
              resolve(null);
            }
          }
        };
        
        window.addEventListener('message', messageListener);
        
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            window.removeEventListener('message', messageListener);
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            resolve(null);
          }
        }, 30000); // 최대 30초 대기
        
        iframe.onload = () => {
          // iframe 로드 완료 후 추가 대기는 postMessage로 처리
        };
      });

      // 파일 목록 새로고침
      await queryClient.invalidateQueries({ queryKey: ["workspace-files", studioId] });
      
      toast({
        title: "썸네일 생성 완료",
        description: "썸네일이 생성되었습니다.",
      });
    } catch (error: any) {
      toast({
        title: "썸네일 생성 실패",
        description: error.message || "썸네일 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  }, [studioId, queryClient, toast]);

  // 썸네일 일괄 생성 핸들러 (백그라운드에서 순차 생성)
  const handleBatchThumbnailGeneration = useCallback(async () => {
    if (!files || files.length === 0) return;

    // 썸네일이 없고 노드가 있는 파일만 필터링
    const filesToProcess = files.filter((f: any) => !f.thumbnailUrl && (f._count?.nodes || 0) > 0);
    
    if (filesToProcess.length === 0) {
      toast({
        title: "생성할 썸네일이 없습니다",
        description: "모든 파일에 썸네일이 있거나 노드가 없습니다.",
      });
      return;
    }

    setIsGeneratingThumbnails(true);
    setThumbnailGenerationProgress({ current: 0, total: filesToProcess.length });

    try {
      // 각 파일을 순차적으로 백그라운드에서 처리
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        
        setThumbnailGenerationProgress({ current: i + 1, total: filesToProcess.length });

        // 숨겨진 iframe에서 파일을 로드하여 썸네일 생성
        await new Promise((resolve) => {
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.left = '-9999px';
          iframe.style.width = '1920px';
          iframe.style.height = '1080px';
          iframe.src = `/studios/${studioId}/workspace/${file.id}?generateThumbnail=true`;
          
          document.body.appendChild(iframe);
          
          let resolved = false;
          
          // postMessage로 썸네일 생성 완료 감지
          const messageListener = (event: MessageEvent) => {
            if (event.data?.type === 'thumbnailGenerated' && event.data?.fileId === file.id) {
              if (!resolved) {
                resolved = true;
                window.removeEventListener('message', messageListener);
                clearTimeout(timeout);
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe);
                }
                // 썸네일 생성 완료 시 파일 목록 새로고침
                queryClient.invalidateQueries({ queryKey: ["workspace-files", studioId] });
                resolve(null);
              }
            }
          };
          
          window.addEventListener('message', messageListener);
          
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              window.removeEventListener('message', messageListener);
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
              resolve(null);
            }
          }, 30000); // 최대 30초 대기 (썸네일 생성 시간 포함)
          
          iframe.onload = () => {
            // iframe 로드 완료 후 추가 대기는 postMessage로 처리
          };
        });

        // 다음 파일 처리 전 약간의 지연
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 최종 파일 목록 새로고침
      await queryClient.invalidateQueries({ queryKey: ["workspace-files", studioId] });

      toast({
        title: "썸네일 일괄 생성 완료",
        description: `${filesToProcess.length}개 파일의 썸네일이 생성되었습니다.`,
      });
    } catch (error: any) {
      toast({
        title: "썸네일 생성 실패",
        description: error.message || "썸네일 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingThumbnails(false);
      setThumbnailGenerationProgress({ current: 0, total: 0 });
    }
  }, [files, studioId, queryClient, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="w-full min-h-screen p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">워크스페이스</h1>
          <p className="text-gray-600">파일을 선택하거나 새로 만드세요</p>
        </div>

      {/* 파일 생성 버튼 및 썸네일 일괄 생성 */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          새 파일 만들기
        </Button>
        {files && files.length > 0 && files.some((f: any) => !f.thumbnailUrl && (f._count?.nodes || 0) > 0) && (
          <Button
            onClick={handleBatchThumbnailGeneration}
            disabled={isGeneratingThumbnails}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {isGeneratingThumbnails 
              ? `썸네일 생성 중... (${thumbnailGenerationProgress.current}/${thumbnailGenerationProgress.total})`
              : "썸네일 일괄 생성"}
          </Button>
        )}
      </div>

      {/* 파일 그리드 - 피그마 스타일 큰 카드 */}
      {files && files.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {files.map((file: any) => (
            <div
              key={file.id}
              onClick={() => router.push(`/studios/${studioId}/workspace/${file.id}`)}
              className="group cursor-pointer border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-lg transition-all bg-white overflow-hidden"
            >
              {/* 썸네일 영역 - 4:3 비율 */}
              <div className="aspect-[4/3] bg-gray-100 mb-4 flex items-center justify-center overflow-hidden -mx-5 -mt-5">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FileText className="h-16 w-16 text-gray-400" />
                )}
              </div>

              {/* 파일 정보 */}
              <div className="flex-1 overflow-hidden">
                <h3 
                  onClick={() => router.push(`/studios/${studioId}/workspace/${file.id}`)}
                  className="font-semibold text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer overflow-hidden text-ellipsis"
                >
                  {file.name}
                </h3>
                {file.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 overflow-hidden text-ellipsis">
                    {file.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{file._count?.nodes || 0}개 노드</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(file.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* 썸네일 생성 버튼 (썸네일이 없고 노드가 있을 때만) */}
              {!file.thumbnailUrl && (file._count?.nodes || 0) > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSingleThumbnailGeneration(file.id);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />
                    썸네일 생성
                  </Button>
                </div>
              )}
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
    </div>
  );
}

