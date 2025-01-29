"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, convertYouTubeLinks } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare, MessageCircle, Heart, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const queryClient = useQueryClient();
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  

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
          className="whitespace-pre-line break-words text-sm"
          dangerouslySetInnerHTML={{ __html: convertedContent }}
        />
      </div>
    );
  };

  const handleEditClick = () => {
    console.log("Edit clicked"); // 디버깅용
    setIsEditorOpen(true);
  };

  return (
    <article className="group/post overflow-hidden border-b border-dotted border-b-gray-300 bg-card pt-4 pb-4">
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
            <div className="mt-2 break-words text-base">{renderContent()}</div>
          </Linkify>
          {!!post.attachments.length && (
            <div className="mt-3">
              <MediaPreviews attachments={post.attachments} />
            </div>
          )}
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
              onClick={() => setShowComments(!showComments)}
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
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto scrollbar-hide">
        {attachments.map((media) => (
          <div
            key={media.id}
            className="relative h-[400px] w-[60%] flex-shrink-0 snap-start last:mr-[40%]"
          >
            <MediaPreview media={media} attachments={attachments} />
          </div>
        ))}
      </div>
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
        className="relative h-full w-full"
        onClick={() => setShowCarousel(true)}
      >
        {media.type === "VIDEO" ? (
          <video
            src={media.url}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-lg object-cover"
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
              className="cursor-pointer rounded-lg object-cover"
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
  onClick: () => void;
}

function CommentButton({ commentCount, onClick }: CommentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-4 py-2",
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
    </button>
  );
}
