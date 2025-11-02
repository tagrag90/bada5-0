"use client";

import { useState } from "react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EditNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
  initialTitle: string;
  initialContent?: string;
  initialEmoji?: string;
  onSave: (nodeId: string, title: string, content?: string, emoji?: string) => Promise<void>;
}

export default function EditNodeDialog({
  open,
  onOpenChange,
  nodeId,
  initialTitle,
  initialContent = "",
  initialEmoji = "",
  onSave,
}: EditNodeDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 초기값이 변경되면 상태 업데이트
  React.useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setEmoji(initialEmoji || "");
    setShowEmojiPicker(false);
  }, [initialTitle, initialContent, initialEmoji]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(nodeId, title, content, emoji || undefined);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save node:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative">
        <DialogHeader>
          <DialogTitle>노드 편집</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 text-xl"
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
              <div className="absolute z-50 mt-2">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  autoFocusSearch={false}
                  theme={"light" as any}
                />
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
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

