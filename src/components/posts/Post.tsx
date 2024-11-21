"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare } from "lucide-react";
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

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();
  const [commentCount, setCommentCount] = useState(post._count.comments);

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

  return (
    <article className="group/post overflow-hidden border-b border-gray-200 bg-card p-4">
      <div className="flex items-start">
        <UserTooltip user={post.user}>
          <Link
            href={`/users/${post.user.username}`}
            className="mr-3 flex-shrink-0"
          >
            <UserAvatar avatarUrl={post.user.avatarUrl} size={48} />
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
            {post.user.id === user.id && <PostMoreButton post={post} />}
          </div>
          <Linkify>
            <div className="mt-2 break-words text-base">{post.content}</div>
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
  const displayMedia = attachments.slice(0, 5);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto pb-4 scrollbar-hide">
        {displayMedia.map((media, index) => (
          <div
            key={media.id}
            className={cn(
              "relative shrink-0 snap-start rounded-2xl",
              displayMedia.length === 1 ? "h-80 w-full" : "h-80 w-[67%]",
              displayMedia.length === 5 &&
                index === 4 &&
                attachments.length > 5 &&
                "relative after:absolute after:inset-0 after:flex after:items-center after:justify-center after:rounded-2xl after:bg-black/40 after:text-2xl after:font-bold after:text-white",
              displayMedia.length === 5 &&
                index === 4 &&
                attachments.length > 5 &&
                `after:content-['+${attachments.length - 5}']`,
            )}
          >
            <MediaPreview media={media} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        fill
        className="rounded-2xl object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <video src={media.url} controls className="h-full w-full object-cover" />
    );
  }

  return <p className="text-destructive">지원되지 않는 미디어 유형</p>;
}

interface CommentButtonProps {
  commentCount: number;
  onClick: () => void;
}

function CommentButton({ commentCount, onClick }: CommentButtonProps) {
  const hasComments = commentCount > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-4 py-2",
        hasComments ? "bg-[#00dd89] text-white" : "bg-gray-100 text-gray-900",
      )}
    >
      <MessageSquare
        className={cn("size-5", hasComments ? "text-white" : "text-gray-500")}
      />
      <span className="text-sm font-medium tabular-nums">{commentCount}</span>
    </button>
  );
}
