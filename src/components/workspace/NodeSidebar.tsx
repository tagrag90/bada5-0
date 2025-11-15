"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Trash2, Bold, Highlighter } from "lucide-react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";

interface NodeSidebarProps {
  nodeId: string;
  initialTitle: string;
  initialContent?: string;
  initialEmoji?: string;
  nodeType?: string;
  isOpen?: boolean;
  onClose: () => void;
  onSave: (nodeId: string, title: string, content?: string, emoji?: string) => Promise<void>;
  onDelete?: (nodeId: string) => Promise<void>;
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
  onDelete,
}: NodeSidebarProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Tiptap 에디터 (RESOURCE, POST 타입이 아닐 때만 사용)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: false,
        strike: false,
        code: false,
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        hardBreak: false,
        dropcursor: false,
        gapcursor: false,
        history: {},
      }),
      Highlight.configure({ multicolor: false }),
    ],
    content: nodeType !== "RESOURCE" && nodeType !== "POST" && nodeType !== "PHOTO" && nodeType !== "SCHEDULE" ? initialContent : "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "text-sm leading-normal focus:outline-none min-h-[200px] p-3",
      },
    },
  });
  
  // 자료 공유 노드용 파일 관리
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // content를 파싱하여 파일 목록 가져오기 (RESOURCE, PHOTO 타입일 때)
  const [fileList, setFileList] = useState<any[]>(() => {
    if ((nodeType === "RESOURCE" || nodeType === "PHOTO") && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        return parsed.files || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // 캘린더 노드용 일정 정보 (SCHEDULE 타입일 때)
  const [scheduleData, setScheduleData] = useState<{
    startDate?: string;
    endDate?: string;
    eventType?: "SCHEDULE" | "EVENT" | "DEADLINE";
    description?: string;
  }>(() => {
    if (nodeType === "SCHEDULE" && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        return {
          startDate: parsed.startDate || "",
          endDate: parsed.endDate || "",
          eventType: parsed.eventType || "SCHEDULE",
          description: parsed.description || "",
        };
      } catch {
        // JSON이 아니면 일반 텍스트로 처리
        return {
          startDate: "",
          endDate: "",
          eventType: "SCHEDULE" as const,
          description: initialContent,
        };
      }
    }
    return {
      startDate: "",
      endDate: "",
      eventType: "SCHEDULE" as const,
      description: "",
    };
  });

  // 초기값이 변경되면 상태 업데이트
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setEmoji(initialEmoji || "");
    setShowEmojiPicker(false);
    
    // Tiptap 에디터 내용 업데이트 (RESOURCE, POST, PHOTO 타입이 아닐 때만)
    if (editor && nodeType !== "RESOURCE" && nodeType !== "POST" && nodeType !== "PHOTO") {
      editor.commands.setContent(initialContent || "");
    }
    
    // 파일 목록 업데이트 (RESOURCE, PHOTO 타입)
    if ((nodeType === "RESOURCE" || nodeType === "PHOTO") && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        setFileList(parsed.files || []);
      } catch {
        setFileList([]);
      }
    } else {
      setFileList([]);
    }

    // 캘린더 노드 데이터 업데이트 (SCHEDULE 타입)
    if (nodeType === "SCHEDULE" && initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        setScheduleData({
          startDate: parsed.startDate || "",
          endDate: parsed.endDate || "",
          eventType: parsed.eventType || "SCHEDULE",
          description: parsed.description || "",
        });
      } catch {
        // JSON이 아니면 일반 텍스트를 description으로 처리
        setScheduleData({
          startDate: "",
          endDate: "",
          eventType: "SCHEDULE" as const,
          description: initialContent,
        });
      }
    }
  }, [initialTitle, initialContent, initialEmoji, nodeType, editor]);
  

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // emoji가 빈 문자열이면 undefined로 전달하여 null로 저장되도록 함
      const emojiValue = emoji && emoji.trim() ? emoji.trim() : undefined;
      
      // RESOURCE, PHOTO 타입일 때는 파일 목록을 JSON으로 저장
      // SCHEDULE 타입일 때는 일정 정보를 JSON으로 저장
      let contentToSave = content;
      if (nodeType === "RESOURCE" || nodeType === "PHOTO") {
        contentToSave = JSON.stringify({ files: fileList });
      } else if (nodeType === "SCHEDULE") {
        // 캘린더 노드: 일정 정보를 JSON으로 저장
        contentToSave = JSON.stringify({
          startDate: scheduleData.startDate || "",
          endDate: scheduleData.endDate || "",
          eventType: scheduleData.eventType || "SCHEDULE",
          description: scheduleData.description || "",
        });
      } else if (nodeType !== "POST" && editor) {
        // Tiptap 에디터에서 HTML 가져오기
        contentToSave = editor.getHTML();
      }
      
      await onSave(nodeId, title, contentToSave, emojiValue);
    } catch (error) {
      console.error("Failed to save node:", error);
      // 에러는 상위 컴포넌트에서 toast로 표시되므로 여기서는 에러를 다시 throw하지 않음
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("이 노드를 삭제하시겠습니까?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(nodeId);
      onClose();
    } catch (error) {
      console.error("Failed to delete node:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // 자료 공유/사진 노드용 파일 업로드
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      try {
        // PHOTO 타입은 이미지만 허용
        if (nodeType === "PHOTO" && !file.type.startsWith('image/')) {
          toast({
            variant: "destructive",
            description: `${file.name}은(는) 이미지 파일만 업로드 가능합니다.`,
          });
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', nodeType === "PHOTO" ? 'media' : 'resource');

        const response = await fetch(nodeType === "PHOTO" ? '/api/upload' : '/api/upload-resource', {
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
          id: result.fileId || result.mediaId || crypto.randomUUID(),
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
    <div className="w-full bg-card border border-border rounded-xl shadow-sm flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-border rounded-t-xl">
        <h2 className="text-lg font-semibold">노드 편집</h2>
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

        {/* 캘린더 노드: 날짜 선택 및 일정 관리 UI */}
        {nodeType === "SCHEDULE" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>이벤트 종류</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={scheduleData.eventType === "SCHEDULE" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScheduleData({ ...scheduleData, eventType: "SCHEDULE" })}
                >
                  일정
                </Button>
                <Button
                  type="button"
                  variant={scheduleData.eventType === "EVENT" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScheduleData({ ...scheduleData, eventType: "EVENT" })}
                >
                  행사
                </Button>
                <Button
                  type="button"
                  variant={scheduleData.eventType === "DEADLINE" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScheduleData({ ...scheduleData, eventType: "DEADLINE" })}
                >
                  마감기한
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">시작 날짜</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={scheduleData.startDate || ""}
                  onChange={(e) => setScheduleData({ ...scheduleData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">종료 날짜</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={scheduleData.endDate || ""}
                  onChange={(e) => setScheduleData({ ...scheduleData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={scheduleData.description || ""}
                onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })}
                placeholder="일정에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>
          </div>
        )}

        {nodeType !== "RESOURCE" && nodeType !== "POST" && nodeType !== "PHOTO" && nodeType !== "SCHEDULE" && editor && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">내용</Label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  title="볼드체"
                >
                  <Bold className={`h-4 w-4 ${editor.isActive('bold') ? 'text-blue-600' : ''}`} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  disabled={!editor.can().chain().focus().toggleHighlight().run()}
                  title="형광펜"
                >
                  <Highlighter className={`h-4 w-4 ${editor.isActive('highlight') ? 'text-yellow-600' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="border border-gray-200 rounded-md min-h-[200px] [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-normal [&_.ProseMirror_p]:my-1 [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_p:last-child]:mb-0">
              <EditorContent editor={editor} />
            </div>
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

        {/* 사진 노드: 이미지 업로드 UI */}
        {nodeType === "PHOTO" && (
          <div className="space-y-2">
            <Label>사진</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
              {isUploading ? "업로드 중..." : "사진 선택"}
            </Button>
            
            {/* 이미지 목록 */}
            {fileList.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {fileList.map((file) => (
                  <div
                    key={file.id}
                    className="relative aspect-square rounded overflow-hidden border border-gray-200 group"
                  >
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleFileRemove(file.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
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
      <div className="p-4 border-t border-border rounded-b-xl flex justify-between items-center flex-shrink-0">
        {onDelete && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving || isDeleting}
          >
            취소
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isDeleting || !title.trim()}
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}

