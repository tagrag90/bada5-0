"use client";

import { UserData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import FollowingCount from "./FollowingCount";
import UserPostsSlider from "./UserPostsSlider";
import { useOptionalUser } from "@/app/(main)/SessionProvider";
import { formatNumber } from "@/lib/utils";

interface UserCardProps {
  user: UserData;
}

export default function UserCard({ user }: UserCardProps) {
  const loggedInUser = useOptionalUser();
  const isLoggedIn = !!loggedInUser;

  const followerInfo = {
    followers: user._count.followers,
    isFollowedByUser: isLoggedIn
      ? !!user.followers.some(({ followerId }) => followerId === loggedInUser?.id)
      : false,
  };

  const followingInfo = {
    following: user._count.following || 0,
  };

  return (
    <div
      className="w-full max-w-md md:max-w-xl bg-card p-6 shadow-sm mb-4 mx-auto"
      style={{ borderRadius: '1.5rem' }}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-6">
          <UserTooltip user={user}>
            <Link href={`/users/${user.username}`} className="flex-1 min-w-0">
              <h2 className="text-xl font-bold hover:underline">{user.displayName}</h2>
              <div className="text-muted-foreground">@{user.username}</div>
              {user.bio && (
                <div className="mt-2 overflow-hidden whitespace-pre-line break-words text-sm">
                  {user.bio}
                </div>
              )}
            </Link>
          </UserTooltip>
          <UserTooltip user={user}>
            <Link href={`/users/${user.username}`}>
              <UserAvatar
                avatarUrl={user.avatarUrl}
                userId={user.id}
                size={80}
                className="rounded-full flex-none"
              />
            </Link>
          </UserTooltip>
        </div>

        <div className="flex items-center gap-8 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">
              {formatNumber(user._count.posts)}
            </span>
            <span className="text-muted-foreground">Post</span>
          </div>
          
          <div className="flex flex-col items-center">
            <FollowingCount 
              userId={user.id} 
              initialState={followingInfo}
            />
          </div>
          
          <div className="flex flex-col items-center">
            <FollowerCount 
              userId={user.id} 
              initialState={followerInfo}
            />
          </div>
        </div>

        {/* 최근 게시물 슬라이더 */}
        <UserPostsSlider userId={user.id} />

        <div className="flex items-center justify-end">
          {isLoggedIn && loggedInUser?.id !== user.id && (
            <FollowButton
              userId={user.id}
              initialState={followerInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
} 