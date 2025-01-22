"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import PostEditor from "./PostEditor";

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostEditorModal({ isOpen, onClose }: PostEditorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl gap-0 p-0 md:max-w-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <button onClick={onClose} className="text-sm font-medium">
            취소
          </button>
          <span className="text-sm font-semibold">새 스레드</span>
          <div className="w-8" /> {/* 우측 여백 맞추기 용 */}
        </div>
        <div className="p-4">
          <PostEditor onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 