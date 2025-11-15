"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
  const nameInputRef = useRef<HTMLInputElement>(null);

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
    mutationFn: async (data: { name?: string; description?: string }) => {
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

  // 편집 모드 시작
  useEffect(() => {
    if (file && !isEditing) {
      setEditedName(file.name);
      setEditedDescription(file.description || "");
    }
  }, [file, isEditing]);

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
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3 z-10 relative">
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
            <div className="flex items-center gap-2">
              <Input
                ref={nameInputRef}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 max-w-md"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
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
          ) : (
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
          )}
          {file.description && !isEditing && (
            <p className="text-sm text-gray-500 mt-1 truncate">{file.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

