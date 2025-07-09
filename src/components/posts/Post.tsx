"use client";

import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, convertYouTubeLinks } from "@/lib/utils";
import { Media } from "@prisma/client";
import {
  MessageSquare,
  MessageCircle,
  Heart,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Comments from "../comments/Comments";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ReactHtmlParser from "react-html-parser";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();
  const [commentCount, setCommentCount] = useState(post._count.comments);
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

  const handleRequireLogin = (action: string) => {
    alert(`${action}하려면 로그인이 필요합니다.`);
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
              <UserAvatar avatarUrl={post.user.avatarUrl} userId={post.user.id} size={40} />
            </Link>
          </UserTooltip>
        ) : (
          <div
            className="mr-3 flex-shrink-0 cursor-pointer"
            onClick={() => handleRequireLogin("프로필 보기")}
          >
            <UserAvatar avatarUrl={post.user.avatarUrl} userId={post.user.id} size={40} />
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
              <PostMoreButton
                post={post}
                onEditClick={() => {
                  alert("수정 기능이 현재 비활성화되어 있습니다.");
                }}
              />
            )}
          </div>
          <div className="post-content break-words text-base">
            <ContentRenderer content={post.content} />
          </div>
          {!!post.attachments.length && (
            <div className="mt-3">
              <MediaSlider attachments={post.attachments} />
            </div>
          )}
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

function ContentRenderer({ content }: { content: string }) {
  const transform = (node: any) => {
    if (node.type === "text") {
      const text = node.data;
      const hashtagRegex = /(#[a-zA-Z0-9가-힣]+)/g;
      const parts = text.split(hashtagRegex);

      return parts.map((part: any, index: number) => {
        if (part.match(hashtagRegex)) {
          return (
            <Link
              key={index}
              href={`/hashtag/${part.slice(1)}`}
              className="hashtag"
            >
              {part}
            </Link>
          );
        }
        return part;
      });
    }

    if (node.name === "a" && node.attribs.href) {
      if (!node.attribs.class?.includes("hashtag")) {
        node.attribs.class = `${node.attribs.class || ""} text-primary hover:underline`;
      }
    }

    // 유튜브 임베드 처리
    if (
      node.type === "tag" &&
      node.name === "div" &&
      node.attribs.class?.includes("youtube-embed")
    ) {
      const iframe = node.children.find((child: any) => child.name === "iframe");
      if (iframe) {
        return (
          <div className="youtube-embed w-full">
            <iframe
              width="100%"
              src={iframe.attribs.src}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
    }

    return undefined; // 기본 변환 사용
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  // 먼저 YouTube 링크를 HTML 태그로 변환
  const contentWithYoutubeLinks = convertYouTubeLinks(content);

  return <>{ReactHtmlParser(contentWithYoutubeLinks, options)}</>;
}

interface MediaSliderProps {
  attachments: Media[];
}

function MediaSlider({ attachments }: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (attachments.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev < attachments.length - 1 ? prev + 1 : prev,
    );
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  const renderMedia = (attachment: Media) => {
    if (attachment.type === "VIDEO") {
      return (
        <video
          src={attachment.url}
          className="h-full w-full object-cover"
          controls
          preload="metadata"
          playsInline
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
      />
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="relative aspect-[4/3] w-full flex-shrink-0"
          >
            {renderMedia(attachment)}
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1 text-white hover:bg-opacity-75"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {currentIndex < attachments.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-1 text-white hover:bg-opacity-75"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {attachments.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform items-center space-x-2">
          {attachments.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index ? "w-5 bg-white" : "w-2.5 bg-gray-500"
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
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