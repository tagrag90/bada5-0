"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, formatRelativeDate } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Repeat2, Share } from "lucide-react";

// 더미 데이터 타입 정의
interface InstagramStylePostProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      bio: string | null;
      createdAt: Date;
      followers: { followerId: string; }[];
      _count: {
        posts: number;
        following: number;
        followers: number;
      };
    };
    attachments: {
      id: string;
      url: string;
      type: "IMAGE" | "VIDEO";
    }[];
    _count: {
      likes: number;
      comments: number;
      reposts: number;
    };
    isLiked: boolean;
  };
}

export default function InstagramStylePost({ post }: InstagramStylePostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === post.attachments.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? post.attachments.length - 1 : prev - 1
    );
  };

  // 드래그 시작 핸들러 (터치)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (post.attachments.length <= 1) return;
    
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  // 드래그 중 핸들러 (터치)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentXRef.current = e.touches[0].clientX;
    
    // 드래그 중 시각적 피드백을 위한 코드를 여기에 추가할 수 있습니다
  };

  // 드래그 종료 핸들러 (터치)
  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startXRef.current - currentXRef.current;
    const threshold = 50; // 슬라이드를 넘기기 위한 최소 드래그 거리
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextImage(); // 왼쪽으로 드래그하면 다음 이미지
      } else {
        prevImage(); // 오른쪽으로 드래그하면 이전 이미지
      }
    }
    
    setIsDragging(false);
  };

  // 드래그 시작 핸들러 (마우스)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (post.attachments.length <= 1) return;
    
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setIsDragging(true);
  };

  // 드래그 중 핸들러 (마우스)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    currentXRef.current = e.clientX;
    
    // 드래그 중 시각적 피드백을 위한 코드를 여기에 추가할 수 있습니다
  };

  // 드래그 종료 핸들러 (마우스)
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startXRef.current - currentXRef.current;
    const threshold = 50; // 슬라이드를 넘기기 위한 최소 드래그 거리
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextImage(); // 왼쪽으로 드래그하면 다음 이미지
      } else {
        prevImage(); // 오른쪽으로 드래그하면 이전 이미지
      }
    }
    
    setIsDragging(false);
  };

  // 드래그 취소 핸들러 (마우스가 이미지 밖으로 나갔을 때)
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const renderContent = () => {
    const shouldTruncate = post.content.length > 150 && !isExpanded;
    const displayContent = shouldTruncate 
      ? post.content.slice(0, 150) + "..." 
      : post.content;

    return (
      <div className="post-content">
        <div
          onClick={() => isExpanded && setIsExpanded(false)}
          className={cn(
            "whitespace-pre-line break-words text-base",
            isExpanded && "cursor-pointer"
          )}
        >
          {displayContent}
        </div>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ...더보기
          </button>
        )}
      </div>
    );
  };

  return (
    <article className="group/post overflow-hidden bg-card border-b border-dotted border-b-gray-300 pb-4">
      {/* 사용자 정보 헤더 */}
      <div className="flex items-center p-3">
        <UserTooltip user={post.user}>
          <Link
            href={`/users/${post.user.username}`}
            className="mr-3 flex-shrink-0"
          >
                          <UserAvatar avatarUrl={post.user.avatarUrl} userId={post.user.id} size={32} />
          </Link>
        </UserTooltip>
        <div className="min-w-0 flex-grow">
          <div className="flex min-w-0 items-center space-x-2">
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="truncate font-semibold hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <span className="text-sm text-gray-500" suppressHydrationWarning>
              · {formatRelativeDate(post.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* 이미지 섹션 - 인스타그램 스타일 슬라이드 */}
      {post.attachments.length > 0 && (
        <div 
          ref={imageContainerRef}
          className="relative w-full aspect-square cursor-grab"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* 현재 이미지 */}
          <Image
            src={post.attachments[currentImageIndex].url}
            alt=""
            fill
            className={cn(
              "object-cover select-none",
              isDragging && "pointer-events-none"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
          />
          
          {/* 이미지가 2개 이상일 경우 좌우 화살표 표시 */}
          {post.attachments.length > 1 && (
            <>
              {/* 왼쪽 화살표 */}
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="이전 이미지"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* 오른쪽 화살표 */}
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="다음 이미지"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {/* 이미지 인디케이터 */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.attachments.map((_, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 콘텐츠 섹션 - 인스타그램 스타일로 이미지 아래 배치 */}
      <div className="pt-3">
        {/* 캡션 */}
        <div className="flex items-start mb-3 px-3">
          <div className="min-w-0 flex-grow">
            {renderContent()}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center border-t pt-2 px-3">
          <button 
            onClick={handleLike}
            className={cn(
              "mr-4 flex items-center text-gray-600 hover:text-red-500",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("h-5 w-5 mr-1", isLiked && "fill-red-500")} />
            <span className="text-sm">{likeCount}</span>
          </button>
          <button className="mr-4 flex items-center text-gray-600 hover:text-blue-500">
            <MessageCircle className="h-5 w-5 mr-1" />
            <span className="text-sm">{post._count.comments}</span>
          </button>
          <button className="mr-4 flex items-center text-gray-600 hover:text-green-500">
            <Repeat2 className="h-5 w-5 mr-1" />
            <span className="text-sm">{post._count.reposts}</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
} 