"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, convertYouTubeLinks } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare, MessageCircle, Heart, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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


interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    const shouldTruncate = post.content.length > 150 && !isExpanded;
    const displayContent = shouldTruncate 
      ? post.content.slice(0, 150) + "..." 
      : post.content;

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
          onClick={() => isExpanded && setIsExpanded(false)}
          className={cn(
            "whitespace-pre-line break-words text-base",
            isExpanded && "cursor-pointer"
          )}
          dangerouslySetInnerHTML={{ __html: convertContent(displayContent) }}
        />
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

  const handleEditClick = () => {
    console.log("Edit clicked"); // 디버깅용
    setIsEditorOpen(true);
  };

  return (
    <article className={cn(
      "group/post overflow-hidden bg-card",
      isDetailPage 
        ? "rounded-xl p-4" 
        : "border-b border-dotted border-b-gray-300 pt-4 pb-4"
    )}>
      <div className="flex items-start">
        <UserTooltip user={post.user}>
          <Link
            href={`/users/${post.user.username}`}
            className="mr-3 flex-shrink-0"
          >
            <UserAvatar avatarUrl={post.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
        <div className="min-w-0 flex-grow">
          <div className="flex items-center justify-between">
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
            {post.user.id === user.id && (
              <>
                <PostMoreButton 
                  post={post} 
                  onEditClick={handleEditClick} 
                />
                <PostEditorModal
                  isOpen={isEditorOpen}
                  onClose={() => setIsEditorOpen(false)}
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
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post._count.likes,
                isLikedByUser: post.likes.some(
                  (like) => like.userId === user.id,
                ),
              }}
            />
            <CommentButton
              commentCount={commentCount}
              postId={post.id}
            />
            <BookmarkButton
              postId={post.id}
              initialState={{
                isBookmarkedByUser: post.bookmarks.some(
                  (bookmark) => bookmark.userId === user.id,
                ),
              }}
            />
          </div>
        </div>
      </div>
      {showComments && (
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
  if (attachments.length === 0) return null;

  return (
    <div className={cn(
      "relative w-full overflow-hidden rounded-2xl",
      attachments.length === 1 && "aspect-[16/9]"
    )}>
      {attachments.length === 1 ? (
        <Image
          src={attachments[0].url}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : attachments.length === 2 ? (
        <div className="grid grid-cols-2 gap-1 aspect-[2/1] w-full">
          {attachments.map((attachment, index) => (
            <div
              key={attachment.id}
              className={cn(
                "relative aspect-square",
                index === 0 && "rounded-l-2xl",
                index === 1 && "rounded-r-2xl"
              )}
            >
              <Image
                src={attachment.url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      ) : attachments.length === 3 ? (
        <div className="grid grid-cols-2 gap-1 aspect-[16/9] w-full">
          <div className="relative rounded-l-2xl">
            <Image
              src={attachments[0].url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          <div className="grid grid-rows-2 gap-1">
            {attachments.slice(1, 3).map((attachment, index) => (
              <div
                key={attachment.id}
                className={cn(
                  "relative aspect-[2/1]",
                  index === 0 && "rounded-tr-2xl",
                  index === 1 && "rounded-br-2xl"
                )}
              >
                <Image
                  src={attachment.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw, 12vw"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 aspect-[2/1.2] w-full">
          {attachments.slice(0, 4).map((attachment, index) => (
            <div
              key={attachment.id}
              className={cn(
                "relative aspect-[1/0.6]",
                index === 0 && "rounded-tl-2xl",
                index === 1 && "rounded-tr-2xl",
                index === 2 && "rounded-bl-2xl",
                index === 3 && "rounded-br-2xl"
              )}
            >
              <Image
                src={attachment.url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
  attachments: Media[];
}

function MediaPreview({ media, attachments }: MediaPreviewProps) {
  const [showCarousel, setShowCarousel] = useState(false);

  return (
    <>
      <div
        className="relative h-full w-full aspect-square"
        onClick={() => setShowCarousel(true)}
      >
        {media.type === "VIDEO" ? (
          <video
            src={media.url}
            className="absolute inset-0 h-full w-full cursor-pointer object-cover rounded-lg"
            controls
            preload="metadata"
            playsInline
            muted
          />
        ) : (
          <div className="absolute inset-0">
            <Image
              src={media.url}
              alt="Attachment"
              fill
              className="cursor-pointer object-cover object-top rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          "flex items-center gap-2 rounded-[10px] px-4 py-2 cursor-pointer",
        )}
      >
        <MessageCircle
          strokeWidth={1.5}
          className={cn(
            "size-5",
            commentCount > 0
              ? "fill-white text-black"
              : "fill-white text-black"
          )}
        />
        <span
          className={cn(
            "text-sm font-normal tabular-nums",
            commentCount > 0 ? "text-black" : "text-black"
          )}
        >
          {commentCount}
        </span>
      </div>
    </Link>
  );
}
