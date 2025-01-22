"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <div className="rounded-t-2xl overflow-hidden border-[0.5px] border-[#000]/[0.3]"><PostsLoadingSkeleton /></div>;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="rounded-t-2xl overflow-hidden bg-white p-4 border-[0.5px] border-[#000]/[0.3]">
        <p className="text-center text-muted-foreground">
          아직 게시물이 없습니다.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-t-2xl overflow-hidden bg-white p-4 border-[0.5px] border-[#000]">
        <p className="text-center text-destructive">
          게시물을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="rounded-t-xl overflow-hidden bg-white border-[0.5px] border-[#000]/[0.3]"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
