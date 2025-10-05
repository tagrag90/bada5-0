import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber, cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";
import Image from "next/image";
import Logo from "@/assets/logo.png";

interface FeedRightSidebarProps {
  className?: string;
}

export default async function FeedRightSidebar({ className }: FeedRightSidebarProps) {
  const { user } = await validateRequest();

  return (
    <div
      className={cn(
        "h-fit space-y-5",
        className,
      )}
    >
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {/* 공지사항 */}
        <div className="relative group">
          <div 
            className="relative space-y-3 rounded-2xl bg-black p-6 shadow-md transition-all duration-500 group-hover:scale-[1.03]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="logo"
                  width={20}
                  height={20}
                />
                <span className="text-sm font-bold text-white">Notice</span>
              </div>
            </div>
            
            <h2 className="text-sm font-medium text-white">
              Welcome to Divetobada! 크리에이터와 팬을 직접 연결하는 새로운 엔터테인먼트 플랫폼입니다.
            </h2>
          </div>
        </div>

        {/* 친구 찾아볼까요 */}
        <WhoToFollow />
        
        {/* 새로 생긴 스튜디오 */}
        <StudiosToExplore />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">크리에이터를 발견하세요</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} className="flex-none" />
              <div>
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
      ))}
    </div>
  );
}

import StudiosToExplore from "./StudiosToExplore";

