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

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

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
              post={post}
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
    <div
      className={cn(
        "flex flex-wrap gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
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
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">지원되지 않는 미디어 유형</p>;
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments} <span className="hidden sm:inline">댓글</span>
      </span>
    </button>
  );
}
