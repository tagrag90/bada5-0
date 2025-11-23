"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Edit2, Check, X, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface WorkspaceFileHeaderProps {
  studioId: string;
  fileId: string;
}

export default function WorkspaceFileHeader({ studioId, fileId }: WorkspaceFileHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [userUploadedThumbnailUrl, setUserUploadedThumbnailUrl] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // 파일 정보 조회
  const { data: file, isLoading } = useQuery({
    queryKey: ["workspace-file", studioId, fileId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/files/${fileId}`);
      if (!res.ok) throw new Error("Failed to fetch file");
      return res.json();
    },
  });

  // 파일 정보 업데이트
  const updateFileMutation = useMutation({
    mutationFn: async (data: { name?: string; description?: string; thumbnailUrl?: string | null }) => {
      const res = await fetch(`/api/studios/${studioId}/files/${fileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update file");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-file", studioId, fileId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-files", studioId] });
      setIsEditing(false);
      toast({
        title: "파일 정보 업데이트 완료",
        description: "파일 정보가 성공적으로 업데이트되었습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "파일 정보 업데이트 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 썸네일 업로드
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      toast({
        title: "이미지 파일만 업로드 가능",
        description: "썸네일은 이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingThumbnail(true);

    try {
      // 이미지 업로드
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'media'); // 이미지 타입으로 업로드

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.message || error.error || '업로드 실패');
      }

      const uploadResult = await uploadRes.json();

      // 사용자가 업로드한 썸네일로 표시하기 위해 localStorage에 저장
      localStorage.setItem(`user-thumbnail-${fileId}`, uploadResult.url);
      setUserUploadedThumbnailUrl(uploadResult.url);

      // 파일 정보 업데이트
      updateFileMutation.mutate({
        thumbnailUrl: uploadResult.url,
      });
    } catch (error: any) {
      toast({
        title: "썸네일 업로드 실패",
        description: error.message || "썸네일 업로드에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingThumbnail(false);
      // 파일 입력 초기화
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
    }
  };

  // 썸네일 삭제
  const handleThumbnailDelete = () => {
    // localStorage에서도 제거
    localStorage.removeItem(`user-thumbnail-${fileId}`);
    setUserUploadedThumbnailUrl(null);
    
    updateFileMutation.mutate({
      thumbnailUrl: null,
    });
  };

  // 편집 모드 시작
  useEffect(() => {
    if (file && !isEditing) {
      setEditedName(file.name);
      setEditedDescription(file.description || "");
    }
  }, [file, isEditing]);

  // 사용자가 업로드한 썸네일 URL 추적 (localStorage에 저장)
  useEffect(() => {
    if (file?.thumbnailUrl) {
      const storedUserThumbnail = localStorage.getItem(`user-thumbnail-${fileId}`);
      if (storedUserThumbnail === file.thumbnailUrl) {
        setUserUploadedThumbnailUrl(file.thumbnailUrl);
      } else {
        // localStorage에 없으면 자동 생성된 썸네일로 간주
        setUserUploadedThumbnailUrl(null);
      }
    } else {
      setUserUploadedThumbnailUrl(null);
    }
  }, [file?.thumbnailUrl, fileId]);

  // 편집 모드 시작 시 입력 필드 포커스
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (file) {
      setEditedName(file.name);
      setEditedDescription(file.description || "");
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!editedName.trim()) {
      toast({
        title: "파일 이름 필요",
        description: "파일 이름은 비어있을 수 없습니다.",
        variant: "destructive",
      });
      return;
    }
    updateFileMutation.mutate({
      name: editedName.trim(),
      description: editedDescription.trim() || undefined,
    });
  };

  const handleCancel = () => {
    if (file) {
      setEditedName(file.name);
      setEditedDescription(file.description || "");
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!file) {
    return null;
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* 파일 정보 섹션 */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* 뒤로가기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/studios/${studioId}/workspace`)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* 파일 정보 */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    ref={nameInputRef}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1"
                    placeholder="파일 이름"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === "Escape") {
                        handleCancel();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSave}
                    disabled={updateFileMutation.isPending}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={updateFileMutation.isPending}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  placeholder="캡션 (선택사항)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      e.preventDefault();
                      handleSave();
                    } else if (e.key === "Escape") {
                      handleCancel();
                    }
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold truncate">{file.name}</h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleStartEdit}
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                {file.description && (
                  <p className="text-sm text-gray-500 mt-1 break-words">{file.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 썸네일 섹션 - 사용자가 업로드한 썸네일만 표시 */}
      {userUploadedThumbnailUrl && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">썸네일</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 overflow-hidden border border-gray-200 bg-gray-100">
                <Image
                  src={userUploadedThumbnailUrl}
                  alt="썸네일"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={isUploadingThumbnail || updateFileMutation.isPending}
                  className="h-8 w-full justify-start"
                >
                  <Upload className="h-3 w-3 mr-2" />
                  변경
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleThumbnailDelete}
                  disabled={isUploadingThumbnail || updateFileMutation.isPending}
                  className="h-8 w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  삭제
                </Button>
              </div>
            </div>
          </div>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
        </div>
      )}
      
      {/* 썸네일이 없을 때만 업로드 버튼 표시 */}
      {!userUploadedThumbnailUrl && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">썸네일</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => thumbnailInputRef.current?.click()}
              disabled={isUploadingThumbnail || updateFileMutation.isPending}
              className="h-8"
            >
              <ImageIcon className="h-3 w-3 mr-2" />
              {isUploadingThumbnail ? "업로드 중..." : "썸네일 업로드"}
            </Button>
          </div>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

