"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface NodeSidebarProps {
  nodeId: string;
  initialTitle: string;
  initialContent?: string;
  initialEmoji?: string;
  onClose: () => void;
  onSave: (nodeId: string, title: string, content?: string, emoji?: string) => Promise<void>;
}

export default function NodeSidebar({
  nodeId,
  initialTitle,
  initialContent = "",
  initialEmoji = "",
  onClose,
  onSave,
}: NodeSidebarProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 초기값이 변경되면 상태 업데이트
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setEmoji(initialEmoji || "");
    setShowEmojiPicker(false);
  }, [initialTitle, initialContent, initialEmoji]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // emoji가 빈 문자열이면 undefined로 전달하여 null로 저장되도록 함
      const emojiValue = emoji && emoji.trim() ? emoji.trim() : undefined;
      await onSave(nodeId, title, content, emojiValue);
    } catch (error) {
      console.error("Failed to save node:", error);
      // 에러는 상위 컴포넌트에서 toast로 표시되므로 여기서는 에러를 다시 throw하지 않음
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
      </div>

      {/* 푸터 */}
      <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
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

