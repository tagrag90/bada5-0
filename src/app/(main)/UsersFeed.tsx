"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import UserCard from "@/components/UserCard";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
// UsersFeed는 로그인한 사용자만 접근 가능

interface UsersPage {
  users: UserData[];
  nextCursor: string | null;
}

export default function UsersFeed() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["users-feed", "all"],
    queryFn: async ({ pageParam }) => {
      return await kyInstance
        .get(
          "/api/users/all",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<UsersPage>();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const users = data?.pages.flatMap((page) => page.users) || [];

  if (status === "pending") {
    return (
      <div className="p-2 md:p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 md:p-4 max-w-md mx-auto">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-2 md:h-3 bg-gray-200 rounded animate-pulse w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }



  if (status === "success" && !users.length && !hasNextPage) {
    return (
      <div className="p-2 md:p-4">
        <div className="max-w-md mx-auto">
          <p className="text-center text-sm md:text-base text-muted-foreground">
            등록된 사용자가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-2 md:p-4">
        <div className="max-w-md mx-auto">
          <p className="text-center text-sm md:text-base text-destructive">
            사용자 목록을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="p-2 md:p-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >

      <div className="p-2 md:p-4">
        <div className="max-w-md mx-auto md:text-center">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">새로운 크리에이터들을 만나보세요</h2>
          <p className="text-sm text-muted-foreground mt-1">
            최근 가입한 순서로 표시됩니다
          </p>
        </div>
      </div>

      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

      {isFetchingNextPage && (
        <div className="max-w-md mx-auto">
          <Loader2 className="mx-auto my-3 animate-spin" />
        </div>
      )}

      {!hasNextPage && users.length > 0 && (
        <div className="max-w-md mx-auto">
          <p className="py-3 md:py-4 text-center text-sm md:text-base text-muted-foreground">
            모든 사용자를 확인하셨습니다 ✨
            <br />
            새로운 친구들과 함께 Bada를 즐겨보세요!
          </p>
        </div>
      )}
    </InfiniteScrollContainer>
  );
} 