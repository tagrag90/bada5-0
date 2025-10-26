import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Comments from "@/components/comments/Comments";
import Post from "@/components/posts/Post";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { postId } = await params;
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  // HTML 태그 및 특수 문자 제거
  const cleanContent = post.content
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&[^;]+;/g, '') // HTML 엔티티 제거
    .replace(/\s+/g, ' ') // 연속 공백 제거
    .trim();

  return {
    title: post.title 
      ? `${post.title} | ${post.user.displayName}`
      : `${post.user.displayName}: ${cleanContent.slice(0, 50)}${cleanContent.length > 50 ? '...' : ''}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { postId } = await params;
  const { user } = await validateRequest();

  if (!user) {
    return <p className="text-destructive">권한이 없습니다.</p>;
  }

  const post = await getPost(postId, user.id);
  
  // 블로그 포스트인지 확인
  const isBlogPost = !!post.title && !!post.studioId;

  // 블로그 포스트 상세 페이지 레이아웃
  if (isBlogPost) {
    return (
      <main className="w-full min-w-0">
        <div className="max-w-4xl mx-auto px-0 md:px-6 py-8">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm">
            {/* 미니멀 뒤로가기 */}
            <div className="mb-12">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로가기
                </Link>
              </Button>
            </div>

            {/* 포스트 */}
            <Post post={post} />

            {/* 댓글 섹션 */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold mb-8">댓글</h2>
              <Comments post={post} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 일반 포스트 레이아웃
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">뒤로 가기</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">게시물</h1>
        </div>
        <Post post={post} />
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">댓글</h2>
          <div>
            <Comments post={post} />
          </div>
        </div>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} className="flex-none size-4" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
        {user.bio}
      </div>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </>
  );
}
