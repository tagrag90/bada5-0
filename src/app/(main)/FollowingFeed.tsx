"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function FollowingFeed() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/following",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  // Pull-to-Refresh 핸들러
  const handleRefresh = async () => {
    await refetch();
  };

  if (status === "pending") {
    return <div className="rounded-t-[24px] bg-white p-4 drop-shadow"><PostsLoadingSkeleton /></div>;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <p className="text-center text-muted-foreground">
          게시물이 없습니다. 사람들을 팔로우하여 게시물을 확인해 보세요.
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
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-muted-foreground py-4">
          모든 게시물을 확인하셨습니다 ✨ NO MORE POSTS<br/>
          How About making your own post? for more fun!
        </p>
      )}
    </InfiniteScrollContainer>
  );
}
