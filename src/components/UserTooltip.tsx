"use client";

import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const loggedInUser = useOptionalUser();
  const isLoggedIn = !!loggedInUser;

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: isLoggedIn
      ? !!user.followers.some(
          ({ followerId }) => followerId === loggedInUser?.id,
        )
      : false,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {isLoggedIn && loggedInUser?.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{user._count.posts}</span>
                <span className="text-sm text-muted-foreground">Post</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  {user._count.following}
                </span>
                <span className="text-sm text-muted-foreground">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  {followerState.followers}
                </span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
            </div>
            {/* <FollowerCount userId={user.id} initialState={followerState} /> */}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
