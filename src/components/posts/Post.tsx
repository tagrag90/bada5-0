"use client";

import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, convertYouTubeLinks } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare, MessageCircle, Heart, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
          : "border-b border-dotted border-b-gray-300 pb-4 pt-4",
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
              {!!post.attachments.length && (
                <div className="mt-3">
                  <MediaPreviews attachments={post.attachments} />
                </div>
              )}
            </div>
          </Linkify>
          <div className="mt-3 flex items-center space-x-4">
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
        </div>
      </div>
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

  if (attachments.length === 0) return null;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setShowCarousel(true);
  };

  // Safari에서 border-radius가 제대로 적용되도록 명시적인 스타일 정의
  const roundedStyle = {
    borderRadius: "16px",
    WebkitBorderRadius: "16px",
    overflow: "hidden",
  };

  const roundedLeftStyle = {
    borderTopLeftRadius: "16px",
    borderBottomLeftRadius: "16px",
    WebkitBorderTopLeftRadius: "16px",
    WebkitBorderBottomLeftRadius: "16px",
    overflow: "hidden",
  };

  const roundedRightStyle = {
    borderTopRightRadius: "16px",
    borderBottomRightRadius: "16px",
    WebkitBorderTopRightRadius: "16px",
    WebkitBorderBottomRightRadius: "16px",
    overflow: "hidden",
  };

  const roundedTopLeftStyle = {
    borderTopLeftRadius: "16px",
    WebkitBorderTopLeftRadius: "16px",
    overflow: "hidden",
  };

  const roundedTopRightStyle = {
    borderTopRightRadius: "16px",
    WebkitBorderTopRightRadius: "16px",
    overflow: "hidden",
  };

  const roundedBottomLeftStyle = {
    borderBottomLeftRadius: "16px",
    WebkitBorderBottomLeftRadius: "16px",
    overflow: "hidden",
  };

  const roundedBottomRightStyle = {
    borderBottomRightRadius: "16px",
    WebkitBorderBottomRightRadius: "16px",
    overflow: "hidden",
  };

  const renderMedia = (attachment: Media, style: any) => {
    if (attachment.type === "VIDEO") {
      return (
        <video
          src={attachment.url}
          className="h-full w-full object-cover"
          controls
          preload="metadata"
          playsInline
          style={style}
        />
      );
    }
    return (
      <Image
        src={attachment.url}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={style}
      />
    );
  };

  return (
    <>
      <div
        className={cn(
          "relative w-full overflow-hidden",
          attachments.length === 1 && "aspect-[16/9]",
        )}
        style={roundedStyle}
      >
        {attachments.length === 1 ? (
          <div
            className="relative h-full w-full cursor-pointer"
            onClick={() => handleImageClick(0)}
            style={roundedStyle}
          >
            {renderMedia(attachments[0], roundedStyle)}
          </div>
        ) : attachments.length === 2 ? (
          <div className="grid aspect-[2/1] w-full grid-cols-2 gap-1">
            {attachments.map((attachment, index) => (
              <div
                key={attachment.id}
                className="relative aspect-square cursor-pointer"
                onClick={() => handleImageClick(index)}
                style={index === 0 ? roundedLeftStyle : roundedRightStyle}
              >
                {renderMedia(
                  attachment,
                  index === 0 ? roundedLeftStyle : roundedRightStyle,
                )}
              </div>
            ))}
          </div>
        ) : attachments.length === 3 ? (
          <div className="grid aspect-[16/9] w-full grid-cols-2 gap-1">
            <div
              className="relative cursor-pointer"
              onClick={() => handleImageClick(0)}
              style={roundedLeftStyle}
            >
              {renderMedia(attachments[0], roundedLeftStyle)}
            </div>
            <div className="grid grid-rows-2 gap-1">
              {attachments.slice(1, 3).map((attachment, index) => (
                <div
                  key={attachment.id}
                  className="relative aspect-[2/1] cursor-pointer"
                  onClick={() => handleImageClick(index + 1)}
                  style={
                    index === 0 ? roundedTopRightStyle : roundedBottomRightStyle
                  }
                >
                  {renderMedia(
                    attachment,
                    index === 0
                      ? roundedTopRightStyle
                      : roundedBottomRightStyle,
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid aspect-[2/1.2] w-full grid-cols-2 gap-1">
            {attachments.slice(0, 4).map((attachment, index) => (
              <div
                key={attachment.id}
                className="relative aspect-[1/0.6] cursor-pointer"
                onClick={() => handleImageClick(index)}
                style={
                  index === 0
                    ? roundedTopLeftStyle
                    : index === 1
                      ? roundedTopRightStyle
                      : index === 2
                        ? roundedBottomLeftStyle
                        : roundedBottomRightStyle
                }
              >
                {renderMedia(
                  attachment,
                  index === 0
                    ? roundedTopLeftStyle
                    : index === 1
                      ? roundedTopRightStyle
                      : index === 2
                        ? roundedBottomLeftStyle
                        : roundedBottomRightStyle,
                )}
              </div>
            ))}
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

  // Safari에서 border-radius가 제대로 적용되도록 명시적인 스타일 정의
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
