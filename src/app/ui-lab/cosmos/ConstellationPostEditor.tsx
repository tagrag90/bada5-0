"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import PostEditor from "@/components/posts/editor/PostEditor";

interface ConstellationPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConstellationPostEditor({ isOpen, onClose }: ConstellationPostEditorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 md:p-0 gap-0 max-w-2xl bg-[#fff] rounded-t-[24px] md:rounded-[24px]" 
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b p-4 bg-white">
          <button onClick={onClose} className="text-sm font-medium">
            취소
          </button>
          <span className="text-sm font-semibold text-center">
            포스트 작성
          </span>
          <div className="w-8" />
        </div>
        <div className="p-4 overflow-y-auto">
          <PostEditor onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

