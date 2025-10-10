"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
}

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
  title: string;
}

export default function FollowListModal({
  isOpen,
  onClose,
  userId,
  type,
  title,
}: FollowListModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 팔로워/팔로잉 리스트 조회
  const { data, isLoading, error } = useQuery<{
    followers?: FollowUser[];
    following?: FollowUser[];
    total: number;
    hasMore: boolean;
  }>({
    queryKey: [`${type}-list`, userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/${type}/list`);
      if (!res.ok) throw new Error("Failed to fetch list");
      return res.json();
    },
    enabled: isOpen,
    staleTime: 0, // 모달 열 때마다 최신 데이터
    refetchOnWindowFocus: false, // 모달에서는 불필요
  });

  const users = data?.[type] || [];
  const total = data?.total || 0;

  // 검색 필터링
  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <React.Fragment>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-50 bg-black/90 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* 모달 콘텐츠 */}
      <div className="fixed left-1/2 top-1/2 z-[51] w-full max-w-md max-h-[80vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <span>{title}</span>
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {total}명
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 검색 바 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </Button>
            )}
          </div>

          {/* 사용자 리스트 */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                불러오기에 실패했습니다.
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "검색 결과가 없습니다." : "표시할 사용자가 없습니다."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Link
                      href={`/users/${user.username}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                      onClick={onClose}
                    >
                      <UserAvatar
                        avatarUrl={user.avatarUrl}
                        userId={user.id}
                        size={40}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          @{user.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          팔로워 {formatNumber(user.followersCount)} · 팔로잉 {formatNumber(user.followingCount)}
                        </div>
                      </div>
                    </Link>

                    {/* 팔로우 버튼 (본인이 아닌 경우) */}
                    <div className="ml-2">
                      <FollowButton
                        userId={user.id}
                        initialState={{
                          followers: user.followersCount,
                          isFollowedByUser: user.isFollowedByMe,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
