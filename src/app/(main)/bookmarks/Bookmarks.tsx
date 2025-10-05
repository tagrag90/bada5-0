"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import BlogPostCard from "@/components/posts/BlogPostCard";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Bookmarks() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/bookmarked",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <div className="rounded-t-[24px] bg-white p-4 drop-shadow"><PostsLoadingSkeleton /></div>;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="rounded-t-[24px] bg-white p-4 drop-shadow">
        북마크한 게시물이 없어요.
      </p>
    );
  }

  if (status === "error") {
    <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <p className="text-center text-destructive">
          게시물을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
  }

  return (
    <InfiniteScrollContainer
      className="rounded-t-[24px] bg-white p-4 drop-shadow"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => {
        const isBlogPost = !!post.title && !!post.studioId;
        
        if (isBlogPost) {
          return <BlogPostCard key={post.id} post={post} />;
        }
        
        return <Post key={post.id} post={post} />;
      })}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
