"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostData } from "@/lib/types";
import PostEditor from "./PostEditor";

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: PostData; // 수정 모드일 때 전달되는 게시물 데이터
}

export default function PostEditorModal({ isOpen, onClose, post }: PostEditorModalProps) {
  const isEditMode = !!post; // post가 있으면 수정 모드

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 md:p-0 gap-0 max-w-2xl bg-[#fff] rounded-t-[24px] md:rounded-[24px]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b p-4 bg-white">
          <button onClick={onClose} className="text-sm font-medium">
            취소
          </button>
          <span className="text-sm font-semibold text-center">
            {isEditMode ? "포스트 수정" : "포스트 작성"}
          </span>
          <div className="w-8" /> {/* 우측 여백 맞추기 용 */}
        </div>
        <div className="p-4 overflow-y-auto">
          <PostEditor onSuccess={onClose} post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 