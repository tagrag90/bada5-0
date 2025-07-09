"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import UserCard from "@/components/UserCard";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useOptionalUser } from "./SessionProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UsersPage {
  users: UserData[];
  nextCursor: string | null;
}

export default function UsersFeed() {
  const user = useOptionalUser();
  const isLoggedIn = !!user;

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
      <div className="p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 max-w-md mx-auto">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "error" && !isLoggedIn) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <h2 className="mb-2 text-xl font-semibold">
            사용자를 탐색하려면 로그인이 필요합니다
          </h2>
          <p className="mb-4 text-muted-foreground">
            다양한 크리에이터와 아티스트들을 만나보세요.
          </p>
          <Link href="/login">
            <Button className="w-full">로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success" && !users.length && !hasNextPage) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <p className="text-center text-muted-foreground">
            등록된 사용자가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <p className="text-center text-destructive">
            사용자 목록을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="p-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="p-4">
        <div className="max-w-md mx-auto md:text-center">
          <h2 className="text-lg md:text-2xl font-semibold">새로운 크리에이터들을 만나보세요</h2>
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
          <p className="py-4 text-center text-muted-foreground">
            모든 사용자를 확인하셨습니다 ✨
            <br />
            새로운 친구들과 함께 Bada를 즐겨보세요!
          </p>
        </div>
      )}
    </InfiniteScrollContainer>
  );
} 