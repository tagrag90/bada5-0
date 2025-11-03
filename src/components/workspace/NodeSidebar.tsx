"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Trash2 } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface NodeSidebarProps {
  nodeId: string;
  initialTitle: string;
  initialContent?: string;
  initialEmoji?: string;
  nodeType?: string;
  isOpen?: boolean;
  onClose: () => void;
  onSave: (nodeId: string, title: string, content?: string, emoji?: string) => Promise<void>;
}

export default function NodeSidebar({
  nodeId,
  initialTitle,
  initialContent = "",
  initialEmoji = "",
  nodeType = "NOTE",
  isOpen = true,
  onClose,
  onSave,
}: NodeSidebarProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 자료 공유 노드용 파일 관리
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // content를 파싱하여 파일 목록 가져오기 (RESOURCE 타입일 때)
  const [fileList, setFileList] = useState<any[]>(() => {
    if (nodeType === "RESOURCE" && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        return parsed.files || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // 초기값이 변경되면 상태 업데이트
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setEmoji(initialEmoji || "");
    setShowEmojiPicker(false);
    
    // 파일 목록 업데이트 (RESOURCE 타입)
    if (nodeType === "RESOURCE" && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        setFileList(parsed.files || []);
      } catch {
        setFileList([]);
      }
    } else {
      setFileList([]);
    }
  }, [initialTitle, initialContent, initialEmoji, nodeType]);
  

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // emoji가 빈 문자열이면 undefined로 전달하여 null로 저장되도록 함
      const emojiValue = emoji && emoji.trim() ? emoji.trim() : undefined;
      
      // RESOURCE 타입일 때는 파일 목록을 JSON으로 저장
      let contentToSave = content;
      if (nodeType === "RESOURCE") {
        contentToSave = JSON.stringify({ files: fileList });
      }
      
      await onSave(nodeId, title, contentToSave, emojiValue);
    } catch (error) {
      console.error("Failed to save node:", error);
      // 에러는 상위 컴포넌트에서 toast로 표시되므로 여기서는 에러를 다시 throw하지 않음
    } finally {
      setIsSaving(false);
    }
  };
  
  // 자료 공유 노드용 파일 업로드 (모든 파일 타입 허용)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'resource'); // 자료 공유용 타입

        const response = await fetch('/api/upload-resource', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();

        // 파일 목록에 추가
        setFileList(prev => [...prev, {
          id: result.fileId || crypto.randomUUID(),
          url: result.url,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }]);

        toast({
          description: `${file.name} 업로드 완료!`,
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          variant: "destructive",
          description: `${file.name} 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        });
      }
    }

    setIsUploading(false);
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileRemove = (fileId: string) => {
    setFileList(prev => prev.filter(f => f.id !== fileId));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 bottom-4 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-xl">
        <h2 className="text-lg font-semibold text-black">노드 편집</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 text-xl shrink-0"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {emoji || "😊"}
            </Button>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="노드 제목"
              className="flex-1"
            />
          </div>
          {showEmojiPicker && (
            <div className="relative z-50 w-full">
              <div className="absolute top-2 left-0">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  autoFocusSearch={false}
                  theme={"light" as any}
                  width="100%"
                />
              </div>
            </div>
          )}
        </div>

        {nodeType !== "RESOURCE" && nodeType !== "POST" && (
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="노드 내용 (선택사항)"
              rows={8}
              className="resize-none"
            />
          </div>
        )}
        
        {/* 드라이브 노드: 파일 업로드 UI */}
        {nodeType === "RESOURCE" && (
          <div className="space-y-2">
            <Label>파일</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "업로드 중..." : "파일 선택"}
            </Button>
            
            {/* 파일 목록 */}
            {fileList.length > 0 && (
              <div className="space-y-2 mt-4">
                {fileList.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 border border-gray-200 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleFileRemove(file.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* 게시물 노드: 게시물 정보 표시 */}
        {nodeType === "POST" && (() => {
          try {
            const parsed = initialContent ? JSON.parse(initialContent) : {};
            const postId = parsed.postId;
            
            if (postId) {
              return (
                <div className="space-y-2">
                  <Label>연결된 게시물</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-sm font-medium">게시물 ID: {postId}</p>
                    <Link
                      href={`/posts/${postId}`}
                      target="_blank"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      게시물 보기 →
                    </Link>
                  </div>
                </div>
              );
            }
            
            return (
              <div className="space-y-2">
                <Label>게시물 노드</Label>
                <p className="text-sm text-gray-500">
                  게시물을 검색하여 선택해주세요.
                </p>
              </div>
            );
          } catch {
            return (
              <div className="space-y-2">
                <Label>게시물 노드</Label>
                <p className="text-sm text-gray-500">
                  게시물을 검색하여 선택해주세요.
                </p>
              </div>
            );
          }
        })()}
      </div>

      {/* 푸터 */}
      <div className="p-4 border-t border-gray-200 rounded-b-xl flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
        >
          취소
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !title.trim()}
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}

