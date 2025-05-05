import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { Heart, MessageCircle, Repeat, Send, MoreHorizontal, Bookmark } from "lucide-react"; // Bookmark 아이콘 추가
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import BookmarkButton from "./BookmarkButton";

interface DummyPostCardProps {
  post?: PostData; // 실제 데이터 타입 사용 (통합 용이성) - optional로 변경
}

// 더미 데이터 (컴포넌트 테스트용)
const dummyPostData: PostData = {
  id: "dummy-1",
  content: "Hello new (old) friends 👋\n다들 잘 지내시나요?",
  createdAt: new Date(Date.now() - 6 * 60 * 1000), // 6분 전
  userId: "dummy-user",
  user: {
    id: "dummy-user",
    username: "junseo",
    displayName: "준서",
    avatarUrl: "https://via.placeholder.com/40", // Placeholder avatar
    bio: null,
    createdAt: new Date(),
    followers: [],
    _count: { posts: 1, followers: 0, following: 0 },
  },
  attachments: [
    {
      id: "dummy-media-1",
      postId: "dummy-1",
      type: "IMAGE",
      // Placeholder 이미지 또는 실제 이미지 URL 사용
      url: "https://images.unsplash.com/photo-1588591962114-847156d5b425?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      createdAt: new Date(),
    },
  ],
  likes: [],
  bookmarks: [],
  _count: { likes: 123, comments: 45 },
  embeddedLinks: [], // 타입 에러 해결 위해 추가 (JsonValue 타입이므로 빈 배열 또는 null 가능)
};

export default function DummyPostCard({ post = dummyPostData }: DummyPostCardProps) {
  // 실제로는 props로 받은 post 사용, 여기선 기본값으로 더미 데이터 활용
  const hasAttachments = post.attachments.length > 0;

  // 이미지가 없는 경우는 간단히 표시하거나 null 반환 (디자인 테스트 목적)
  if (!hasAttachments) {
    return (
      <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center text-gray-500">
        (이미지 없는 포스트 - 기존 디자인 적용 영역)
      </div>
    );
  }

  return (
    // 카드 컨테이너: relative, aspect ratio, overflow hidden, rounding
    <article className="relative aspect-[4/5] w-full max-w-xl overflow-hidden rounded-2xl shadow-lg group/post bg-black">
      {/* 1. 배경 이미지 */}
      <Image
        src={post.attachments[0].url} // 첫 번째 첨부파일 사용
        alt="Post background"
        fill // 부모 요소 채우기
        className="object-contain transition-transform duration-300 group-hover/post:scale-105" // object-cover -> object-contain
      />

      {/* 2. 오버레이 컨텐츠 컨테이너 */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/50 via-transparent to-black/30 text-white">
        {/* 2-1. 헤더 영역 */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} size={32} />
            </Link>
            <Link href={`/users/${post.user.username}`} className="text-sm font-semibold hover:underline text-shadow">
              {post.user.displayName}
            </Link>
            {/* 인증 마크 (필요 시) */}
            {/* <CheckCircle className="size-4 text-blue-500" /> */}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span suppressHydrationWarning>{formatRelativeDate(post.createdAt)}</span>
            <button className="p-1 hover:bg-white/20 rounded-full">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        {/* 2-2. 푸터 영역 */}
        <div className="p-4 space-y-3">
          {/* 게시물 텍스트 */}
          <p className="text-sm text-shadow line-clamp-3 whitespace-pre-line">
            {post.content}
          </p>

          {/* 액션 버튼 영역 - 실제 컴포넌트로 교체 */}
          <div className="flex items-center gap-2">
            <LikeButton
              postId={post.id}
              initialState={{ likes: post._count.likes, isLikedByUser: false }} // 더미 상태
              variant="overlay"
            />
            <CommentButton
              postId={post.id}
              commentCount={post._count.comments}
              variant="overlay"
            />
            <BookmarkButton
              postId={post.id}
              initialState={{ isBookmarkedByUser: false }} // 더미 상태
              variant="overlay"
            />
          </div>
        </div>
      </div>
    </article>
  );
} 