"use client";

import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate, convertYouTubeLinks, getCompressedImageUrl } from "@/lib/utils";
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
import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Comments from "../comments/Comments";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";
import PostEditorModal from "./editor/PostEditorModal";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ReactHtmlParser from "react-html-parser";
import LinkPreviewComponent from "./editor/LinkPreviewComponent";
import StudioBadge from "../StudioBadge";
import BlogPostCard from "./BlogPostCard";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const pathname = usePathname();

  // 상세 페이지인지 확인
  const isDetailPage = pathname?.startsWith(`/posts/${post.id}`);
  
  // 블로그형 포스트인지 확인 (제목이 있고 스튜디오 포스트)
  const isBlogPost = !!post.title && !!post.studioId;
  

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




  // 블로그 포스트 상세 페이지 전용 레이아웃
  if (isBlogPost && isDetailPage) {
    return (
      <>
        <article className="w-full bg-white">
          {/* 미니멀 메타 정보 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              {post.studio ? (
                <>
                  <Link
                    href={`/studios/${post.studio.id}`}
                    className="hover:underline font-medium"
                  >
                    {post.studio.name}
                  </Link>
                  <span>·</span>
                </>
              ) : (
                <>
                  <Link
                    href={`/users/${post.user.username}`}
                    className="hover:underline font-medium"
                  >
                    {post.user.displayName}
                  </Link>
                  <span>·</span>
                </>
              )}
              <time suppressHydrationWarning>
                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </div>

          {/* 구분선 */}
          <hr className="border-t border-gray-200 mb-12" />

          {/* 본문 내용 */}
          <div className="prose prose-lg max-w-none mb-16">
            <ContentRenderer content={post.content} />
          </div>

          {/* 구분선 */}
          <hr className="border-t border-gray-200 mt-16" />
        </article>

        {/* 수정 모달 */}
        {isEditModalOpen && (
          <PostEditorModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              queryClient.invalidateQueries({
                queryKey: ["post-feed"],
              });
            }}
            post={post}
          />
        )}
      </>
    );
  }

  // 일반 포스트 레이아웃
  return (
    <>
    <article
      className={cn(
        "group/post overflow-hidden bg-card",
        isDetailPage
          ? "rounded-xl p-4"
          : "border-b border-dotted border-b-gray-300 pb-4 pt-4",
      )}
    >
      <div className="flex items-start">
        {/* 스튜디오 포스트면 스튜디오 아바타, 아니면 유저 아바타 */}
        {post.studio ? (
          <Link
            href={`/studios/${post.studio.id}`}
            className="mr-3 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
              <Image
                src={post.studio.avatarUrl || "/logo-bada.png"}
                alt={post.studio.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        ) : (
          <>
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
          </>
        )}
        <div className="min-w-0 flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center space-x-2">
              {/* 스튜디오 포스트면 스튜디오 이름, 아니면 유저 이름 */}
              {post.studio ? (
                <>
                  <Link
                    href={`/studios/${post.studio.id}`}
                    className="truncate font-semibold hover:underline"
                  >
                    {post.studio.name}
                  </Link>
                  <StudioBadge size="sm" />
                </>
              ) : (
                <>
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
                </>
              )}
              <span className="text-sm text-gray-500" suppressHydrationWarning>
                · {formatRelativeDate(post.createdAt)}
              </span>
            </div>
            {isLoggedIn && post.user.id === user?.id && (
              <PostMoreButton
                post={post}
                onEditClick={() => {
                  setIsEditModalOpen(true);
                }}
              />
            )}
          </div>
          
          {/* 블로그형 포스트 (피드에서만 미리보기) */}
          {isBlogPost && !isDetailPage ? (
            <div className="mt-3">
              <BlogPostCard post={post} />
            </div>
          ) : (
            /* 일반 포스트 또는 상세 페이지 */
            <>
              <div className="post-content break-words text-base">
                <ContentRenderer content={post.content} />
              </div>
              {!!post.attachments.length && (
                <div className="mt-3">
                  <MediaSlider attachments={post.attachments} />
                </div>
              )}
            </>
          )}

      {/* 링크 미리보기 표시 - content에서 메타데이터 추출 */}
      {(() => {
        try {
          // content에서 링크 미리보기 메타데이터 추출
          const linkPreviewMatch = post.content.match(/<!-- LINK_PREVIEWS: (.*?) -->/);
          if (linkPreviewMatch) {
            const previews = JSON.parse(linkPreviewMatch[1]);
            return Array.isArray(previews) && previews.length > 0 ? (
              <div className="mt-3 space-y-2">
                {previews.map((preview: any, index: number) => (
                  <LinkPreviewComponent
                    key={preview.id || index}
                    url={preview.url}
                    title={preview.title}
                    description={preview.description}
                    image={preview.image}
                  />
                ))}
              </div>
            ) : null;
          }
          return null;
        } catch (error) {
          console.error('링크 미리보기 파싱 오류:', error);
          return null;
        }
      })()}
          {/* 블로그 포스트가 아닐 때만 액션 버튼 표시 */}
          {!isBlogPost && (
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
          )}
        
        </div>
      </div>
      {isLoggedIn && showComments && (
        <div className="mt-3">
          <Comments post={post} />
        </div>
      )}
    </article>
    
    {/* 수정 모달 */}
    {isEditModalOpen && (
      <PostEditorModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          // 게시물 데이터 새로고침
          queryClient.invalidateQueries({
            queryKey: ["post-feed"],
          });
        }}
        post={post}
      />
    )}
  </>
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

    // YouTube 별도 임베드 처리 제거 (링크 미리보기로 통합)
    // if (
    //   node.type === "tag" &&
    //   node.name === "div" &&
    //   node.attribs.class?.includes("youtube-embed")
    // ) {
    //   const iframe = node.children.find((child: any) => child.name === "iframe");
    //   if (iframe) {
    //     return (
    //       <div className="youtube-embed w-full">
    //         <iframe
    //           width="100%"
    //           src={iframe.attribs.src}
    //           frameBorder="0"
    //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //           allowFullScreen
    //         ></iframe>
    //       </div>
    //     );
    //   }
    // }

    return undefined; // 기본 변환 사용
  };

  const options = {
    decodeEntities: true,
    transform,
  };

  // 링크 미리보기 메타데이터와 숨겨진 URL들 제거한 순수한 content만 렌더링
  const cleanContent = content
    .replace(/<!-- LINK_PREVIEWS: .*? -->/g, '') // 미리보기 메타데이터 제거
    .replace(/<!-- HIDDEN_LINK: .*? -->/g, '') // 숨겨진 하이퍼링크 제거
    .replace(/<!-- HIDDEN_URL: .*? -->/g, '') // 숨겨진 일반 URL 제거
    .replace(/-->/g, '') // 남은 특수문자 --> 제거
    .replace(/<p>\s*<\/p>/g, '') // 빈 p 태그 제거
    .replace(/\s{2,}/g, ' ') // 연속 공백 정리
    .trim(); // 앞뒤 공백 제거
  
  // 먼저 YouTube 링크를 HTML 태그로 변환
  const contentWithYoutubeLinks = convertYouTubeLinks(cleanContent);

  return <>{ReactHtmlParser(contentWithYoutubeLinks, options)}</>;
}

interface MediaSliderProps {
  attachments: Media[];
}

function MediaSlider({ attachments }: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 터치 슬라이드 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

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

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    if (attachments.length <= 1) return;
    
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || attachments.length <= 1) return;
    
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || attachments.length <= 1) return;
    
    const diff = startXRef.current - currentXRef.current;
    const threshold = 100; // 슬라이드를 넘기기 위한 최소 드래그 거리
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 왼쪽으로 드래그하면 다음 이미지
        setCurrentIndex((prev) =>
          prev < attachments.length - 1 ? prev + 1 : prev,
        );
      } else {
        // 오른쪽으로 드래그하면 이전 이미지
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // 마우스 이벤트 핸들러 (데스크톱 드래그 지원)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (attachments.length <= 1) return;
    
    e.preventDefault();
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setIsDragging(true);

    // 전역 마우스 이벤트 리스너 추가
    const handleGlobalMouseMove = (e: MouseEvent) => {
      currentXRef.current = e.clientX;
      const diff = currentXRef.current - startXRef.current;
      setDragOffset(diff);
    };

    const handleGlobalMouseUp = () => {
      const diff = startXRef.current - currentXRef.current;
      const threshold = 100; // 슬라이드를 넘기기 위한 최소 드래그 거리
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // 왼쪽으로 드래그하면 다음 이미지
          setCurrentIndex((prev) =>
            prev < attachments.length - 1 ? prev + 1 : prev,
          );
        } else {
          // 오른쪽으로 드래그하면 이전 이미지
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }
      
      setIsDragging(false);
      setDragOffset(0);
      
      // 전역 이벤트 리스너 제거
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    // 전역 이벤트 리스너 등록
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
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
    
    // 피드에서는 압축본 사용 (품질 75%, 최대 800px)
    const feedUrl = getCompressedImageUrl(attachment.url, 75, 800);
    
    return (
      <Image
        src={feedUrl}
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
        className={`flex ${isDragging ? '' : 'transition-transform duration-300 ease-in-out'}`}
        style={{ 
          transform: `translateX(${-currentIndex * 100 + (dragOffset / window.innerWidth) * 100}%)` 
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
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