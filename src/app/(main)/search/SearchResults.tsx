"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import FollowButton from "@/components/FollowButton";
import kyInstance from "@/lib/ky";
import { PostsPage, UserData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SearchResultsProps {
  query: string;
}

interface SearchResponse {
  posts: PostsPage['posts'];
  users: UserData[];
  nextCursor: string | null;
}

// 검색 결과용 간단한 사용자 카드 컴포넌트
function SearchUserCard({ user }: { user: UserData }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-background/50">
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3 min-w-0"
        >
          <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} className="flex-none" />
          <div className="min-w-0">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <FollowButton
        userId={user.id}
        initialState={{
          followers: user._count.followers,
          isFollowedByUser: user.followers.some(
            ({ followerId }) => followerId === user.id,
          ),
        }}
      />
    </div>
  );
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/search", {
          searchParams: {
            q: query,
            ...(pageParam && { cursor: pageParam }),
          },
        })
        .json<SearchResponse>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: isClient && !!query?.trim(),
  });

  if (!isClient) {
    return <PostsLoadingSkeleton />;
  }

  const users = data?.pages[0]?.users || [];
  const posts = data?.pages.flatMap(page => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !users.length && query) {
    return (
      <p className="text-center text-muted-foreground">
        &quot;{query}&quot;에 대한 검색 결과가 없습니다.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        검색 중 오류가 발생했습니다.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-6"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {/* 사용자 검색 결과 */}
      {users.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">사용자</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <SearchUserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* 사용자와 게시물 사이 구분선 */}
      {users.length > 0 && posts.length > 0 && (
        <div className="border-t border-border my-6"></div>
      )}

      {/* 게시물 검색 결과 */}
      {posts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">게시물</h3>
          <div className="space-y-5">
            {posts.map((post) => (
              <div key={post.id} className="p-4 rounded-lg border bg-background/30">
                <Post post={post} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
