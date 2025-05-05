"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { ImageIcon, YoutubeIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useSubmitPostMutation } from "./mutations";
import PostEditorModal from "./PostEditorModal";

export default function InlinePostEditor() {
  const { user } = useSession();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  };

  const handleImageClick = () => {
    // 모달을 열되, 탭을 이미지 업로드로 포커싱할 수 있겠지만
    // 현재는 단순히 모달만 열기
    setIsEditorOpen(true);
  };

  const handleYoutubeEmbed = () => {
    // 모달을 열되, 탭을 유튜브로 포커싱할 수 있겠지만
    // 현재는 단순히 모달만 열기
    setIsEditorOpen(true);
  };

  return (
    <>
      <div className="flex items-start gap-3">
        <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        <div 
          onClick={handleOpenEditor}
          className="flex-1 cursor-pointer rounded-full bg-gray-100 px-4 py-3 text-gray-500 hover:bg-gray-200"
        >
          What&apos;s on your mind, {user.displayName || user.username}?
        </div>
      </div>
      
      {/* 하단 버튼 영역 - 트위터/페이스북 스타일 */}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-10 w-10 text-primary hover:bg-primary/10"
            )}
            onClick={handleOpenEditor}
            title="볼드체"
          >
            <span className="font-bold text-lg" style={{ fontFamily: "'MaruBuri', serif" }}>B</span>
          </Button>

          {/* 세로 구분선 */}
          <div className="h-6 w-px bg-gray-300" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 text-primary hover:bg-primary/10"
            onClick={handleImageClick}
            title="이미지 추가"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 text-primary hover:bg-primary/10"
            onClick={handleYoutubeEmbed}
            title="YouTube 영상 추가"
          >
            <YoutubeIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <Button
          onClick={handleOpenEditor}
          className="rounded-full px-4"
        >
          게시하기
        </Button>
      </div>
      
      {/* 모달 에디터 */}
      <PostEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)} 
      />
    </>
  );
} 