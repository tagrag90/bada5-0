"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import BlogPostCard from "@/components/posts/BlogPostCard";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useOptionalUser } from "./SessionProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HTTPError } from "ky";

interface ForYouFeedClientProps {
  initialData?: PostsPage | null;
}

export default function ForYouFeedClient({ initialData }: ForYouFeedClientProps) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
    refetch,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [null],
    } : undefined,
    queryFn: async ({ pageParam }) => {
      try {
        return await kyInstance
          .get(
            "/api/posts/for-you",
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<PostsPage>();
      } catch (err: any) {
        // 인증 관련 에러가 발생하면 비로그인 사용자를 위한 공개 API를 사용
        if (err.response?.status === 401) {
          return await kyInstance
            .get(
              "/api/posts/public",
              pageParam ? { searchParams: { cursor: pageParam } } : {},
            )
            .json<PostsPage>();
        }
        throw err;
      }
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  // Pull-to-Refresh 핸들러
  const handleRefresh = async () => {
    await refetch();
  };

  if (isPending) {
    return (
      <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <PostsLoadingSkeleton />
      </div>
    );
  }

  if (status === "error" && !isLoggedIn) {
    return (
      <div className="rounded-t-[24px] bg-white p-6 drop-shadow">
        <h2 className="mb-2 text-xl font-semibold">
          Bada에 오신 것을 환영합니다
        </h2>
        <p className="mb-4 text-muted-foreground">
          크리에이터와 팬을 직접 연결하는 엔터테인먼트 플랫폼에 가입하고 
          주도권을 가지고 활동을 시작해보세요.
        </p>
        <Link href="/login">
          <Button className="w-full">로그인하기</Button>
        </Link>
      </div>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <p className="text-center text-muted-foreground">
          아직 게시물이 없습니다.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <p className="text-center text-destructive">
          게시물을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="rounded-t-[24px] bg-white p-4 drop-shadow"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {!isLoggedIn && posts.length > 0 && (
        <div className="mb-4 rounded-lg border bg-muted/20 p-4">
          <p className="text-center text-sm font-medium">
            Log in to access more features.
            <Link href="/login" className="ml-1 text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      )}

      {posts.map((post) => {
        const isBlogPost = !!post.title && !!post.studioId;
        
        if (isBlogPost) {
          return <BlogPostCard key={post.id} post={post} />;
        }
        
        return <Post key={post.id} post={post} />;
      })}

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}

      {!hasNextPage && posts.length > 0 && (
        <p className="py-4 text-center text-muted-foreground">
          모든 게시물을 확인하셨습니다 ✨ NO MORE POSTS
          <br />
          How About making your own post? for more fun!
        </p>
      )}
    </InfiniteScrollContainer>
  );
}
