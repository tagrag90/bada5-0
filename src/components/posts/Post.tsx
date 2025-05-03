"use client";

import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, convertYouTubeLinks } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare, MessageCircle, Heart, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import { useQueryClient } from "@tanstack/react-query";
import { MediaCarousel } from "./MediaCarousel";
import { Button } from "@/components/ui/button";
import PostEditorModal from "@/components/posts/editor/PostEditorModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToast } from "@/components/ui/use-toast";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const router = useRouter();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const pathname = usePathname();

  // 상세 페이지인지 확인
  const isDetailPage = pathname?.startsWith(`/posts/${post.id}`);

  const updateCommentCount = (newCount: number) => {
    setCommentCount(newCount);
    queryClient.setQueryData(["post", post.id], (oldData: any) => ({
      ...oldData,
      _count: {
        ...oldData._count,
        comments: newCount,
      },
    }));
  };

  const convertContent = (content: string) => {
    // YouTube 임베드 처리는 여기서만 하고
    return convertYouTubeLinks(content);
  };

  const renderContent = () => {
    const convertedContent = convertContent(post.content);

    // YouTube 임베드가 있는 경우
    if (post.content?.includes("youtube.com")) {
      return (
        <div className="post-content sm:mb-15 -mt-1">
          <div className="relative mb-4 w-full overflow-hidden rounded-lg pt-[75%] sm:pt-[72%]">
            <div
              dangerouslySetInnerHTML={{
                __html: convertedContent,
              }}
              className="absolute inset-0 [&>iframe]:rounded-lg"
            />
          </div>
        </div>
      );
    }

    // 일반 텍스트인 경우
    return (
      <div className="post-content">
        <div
          className="whitespace-pre-line break-words text-base"
          dangerouslySetInnerHTML={{ __html: convertContent(post.content) }}
        />
      </div>
    );
  };

  const handleEditClick = () => {
    setIsEditorOpen(true);
  };

  const handleRequireLogin = (action: string) => {
    toast({
      title: "로그인이 필요합니다",
      description: `${action}하려면 로그인이 필요합니다.`,
      duration: 3000,
    });
    router.push("/login");
  };

  return (
    <article
      className={cn(
        "group/post overflow-hidden bg-card",
        isDetailPage
          ? "rounded-xl p-4"
          : "border-b border-dotted border-b-gray-300 p-4",
      )}
    >
      <div className="flex items-start">
        {isLoggedIn ? (
          <UserTooltip user={post.user}>
            <Link
              href={`/users/${post.user.username}`}
              className="mr-3 flex-shrink-0"
            >
              <UserAvatar avatarUrl={post.user.avatarUrl} size={40} />
            </Link>
          </UserTooltip>
        ) : (
          <div
            className="mr-3 flex-shrink-0 cursor-pointer"
            onClick={() => handleRequireLogin("프로필 보기")}
          >
            <UserAvatar avatarUrl={post.user.avatarUrl} size={40} />
          </div>
        )}
        <div className="min-w-0 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center space-x-2">
              {isLoggedIn ? (
                <UserTooltip user={post.user}>
                  <Link
                    href={`/users/${post.user.username}`}
                    className="truncate font-semibold hover:underline"
                  >
                    {post.user.displayName}
                  </Link>
                </UserTooltip>
              ) : (
                <span
                  className="cursor-pointer truncate font-semibold hover:underline"
                  onClick={() => handleRequireLogin("프로필 보기")}
                >
                  {post.user.displayName}
                </span>
              )}
              <span className="text-sm text-gray-500" suppressHydrationWarning>
                · {formatRelativeDate(post.createdAt)}
              </span>
            </div>
            {isLoggedIn && post.user.id === user?.id && (
              <>
                <PostMoreButton post={post} onEditClick={handleEditClick} />
                <PostEditorModal
                  isOpen={isEditorOpen}
                  onClose={() => setIsEditorOpen(false)}
                  post={post}
                />
              </>
            )}
          </div>
          <Linkify>
            <div className="break-words text-base">
              {renderContent()}
            </div>
          </Linkify>
          {/* 액션 버튼 블록 시작 - 이 블록을 잘라냅니다 */}
          {/* <div className="mt-3 flex items-center space-x-4 pl-[52px]">
            ... (버튼 내용) ...
          </div> */}
          {/* 액션 버튼 블록 끝 */}
        </div>
      </div>

      {/* 이미지(MediaPreviews) 블록 */}
      {!!post.attachments.length && (
        <div className={cn("mt-3", !isDetailPage && "mx-[-1rem]")}>
          <MediaPreviews attachments={post.attachments} />
        </div>
      )}

      {/* !!! 액션 버튼을 여기로 이동하고 왼쪽 패딩(pl-[52px]) 유지 !!! */}
      <div className="mt-3 flex items-center space-x-4 pl-[52px]">
            {isLoggedIn ? (
              <>
                <LikeButton
                  postId={post.id}
                  initialState={{
                    likes: post._count.likes,
                    isLikedByUser: post.likes.some(
                      (like) => like.userId === user?.id,
                    ),
                  }}
                />
                <CommentButton commentCount={commentCount} postId={post.id} />
                <BookmarkButton
                  postId={post.id}
                  initialState={{
                    isBookmarkedByUser: post.bookmarks.some(
                      (bookmark) => bookmark.userId === user?.id,
                    ),
                  }}
                />
              </>
            ) : (
              <>
                <button
                  onClick={() => handleRequireLogin("좋아요")}
                  className="flex items-center gap-2 rounded-[10px] px-4 py-2"
                >
                  <Heart
                    strokeWidth={1.5}
                    className="size-5 fill-white text-[#000]"
                  />
                  <span className="text-sm font-normal tabular-nums">
                    {post._count.likes}
                  </span>
                </button>
                <button
                  onClick={() => handleRequireLogin("댓글 작성")}
                  className="flex items-center gap-2 rounded-[10px] px-4 py-2"
                >
                  <MessageCircle className="size-5 text-[#000]" />
                  <span className="text-sm font-normal tabular-nums">
                    {commentCount}
                  </span>
                </button>
                <button
                  onClick={() => handleRequireLogin("북마크")}
                  className="flex items-center gap-2 rounded-[10px] px-4 py-2"
                >
                  <Bookmark className="size-5 text-[#000]" />
                </button>
              </>
            )}
          </div>

      {/* 댓글 영역 */}
      {isLoggedIn && showComments && (
        <div className="mt-3">
          <Comments post={post} />
        </div>
      )}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  if (attachments.length === 0) return null;

  const handlePreviewClick = () => {
    if (Math.abs(startXRef.current - currentXRef.current) < 10) {
      setSelectedIndex(currentImageIndex);
    setShowCarousel(true);
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % attachments.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + attachments.length) % attachments.length);
  };

  const handleDragStart = (clientX: number) => {
    if (attachments.length <= 1) return;
    setIsDragging(true);
    startXRef.current = clientX;
    currentXRef.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || attachments.length <= 1) return;
    currentXRef.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging || attachments.length <= 1) return;
    setIsDragging(false);

    const diff = startXRef.current - currentXRef.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();

  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  const roundedStyle = {
    borderRadius: "8px",
    WebkitBorderRadius: "8px",
    overflow: "hidden",
  };

  const renderMedia = (attachment: (typeof attachments)[0]) => {
    if (attachment.type === "VIDEO") {
      return (
        <video
          key={attachment.id}
          src={attachment.url}
          className="h-full w-full object-cover"
          preload="metadata"
          playsInline
          muted
          controls
        />
      );
    } else {
    return (
      <Image
          key={attachment.id}
        src={attachment.url}
          alt="Attachment preview"
        width={0}
        height={0}
        className="w-full h-auto object-contain"
          sizes="100vw"
      />
    );
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative w-full overflow-hidden",
          attachments.length > 1 ? "cursor-grab" : "cursor-pointer",
          isDragging && "cursor-grabbing"
        )}
        onClick={handlePreviewClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
          >
        {renderMedia(attachments[currentImageIndex])}

        {attachments.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/75 focus:outline-none"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/75 focus:outline-none"
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {attachments.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    index === currentImageIndex ? "bg-white" : "bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showCarousel && (
        <MediaCarousel
          media={attachments.map((a) => ({ id: a.id, url: a.url, type: a.type }))}
          initialIndex={selectedIndex}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </>
  );
}

interface MediaPreviewProps {
  media: Media;
  attachments: Media[];
}

function MediaPreview({ media, attachments }: MediaPreviewProps) {
  const [showCarousel, setShowCarousel] = useState(false);

  const roundedStyle = {
    borderRadius: "12px",
    WebkitBorderRadius: "12px",
    overflow: "hidden",
  };

  return (
    <>
      <div
        className="relative aspect-square h-full w-full"
        onClick={() => setShowCarousel(true)}
        style={roundedStyle}
      >
        {media.type === "VIDEO" ? (
          <video
            src={media.url}
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            controls
            preload="metadata"
            playsInline
            muted
            style={roundedStyle}
          />
        ) : (
          <div className="absolute inset-0" style={roundedStyle}>
            <Image
              src={media.url}
              alt="Attachment"
              fill
              className="cursor-pointer object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={roundedStyle}
            />
          </div>
        )}
      </div>
      {showCarousel && (
        <MediaCarousel
          media={attachments.map((a) => ({
            id: a.id,
            url: a.url,
            type: a.type,
          }))}
          initialIndex={attachments.findIndex((a) => a.id === media.id)}
          onClose={() => setShowCarousel(false)}
        />
      )}
    </>
  );
}

interface CommentButtonProps {
  commentCount: number;
  postId: string;
}

function CommentButton({ commentCount, postId }: CommentButtonProps) {
  return (
    <Link href={`/posts/${postId}`}>
      <div
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-[10px] px-4 py-2",
        )}
      >
        <MessageCircle
          strokeWidth={1.5}
          className={cn(
            "size-5",
            commentCount > 0
              ? "fill-white text-black"
              : "fill-white text-black",
          )}
        />
        <span
          className={cn(
            "text-sm font-normal tabular-nums",
            commentCount > 0 ? "text-black" : "text-black",
          )}
        >
          {commentCount}
        </span>
      </div>
    </Link>
  );
}
