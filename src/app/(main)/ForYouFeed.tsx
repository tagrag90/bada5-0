"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useOptionalUser } from "./SessionProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HTTPError } from "ky";

export default function ForYouFeed() {
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
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
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

  if (status === "pending") {
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
          크리에이터와 아티스트들을 위한 소셜 미디어 커뮤니티에 가입하고 더 많은
          기능을 이용해보세요.
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
      className="rounded-[24px] bg-white drop-shadow overflow-hidden"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {!isLoggedIn && posts.length > 0 && (
        <div className="mb-4 rounded-lg border bg-muted/20 p-4">
          <p className="text-center text-sm font-medium">
            로그인하면 더 많은 기능을 이용할 수 있습니다.
            <Link href="/login" className="ml-1 text-primary hover:underline">
              로그인하기
            </Link>
          </p>
        </div>
      )}

      {posts
        .filter(post => !!post)
        .map((post) => (
        <Post key={post.id} post={post} />
      ))}

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
