import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber, cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import LatestYoutubeVideo from "./LatestYoutubeVideo";
import BrandSidebar from "./BrandSidebar";

interface TrendsSidebarProps {
  className?: string;
}

export default function TrendsSidebar({ className }: TrendsSidebarProps) {
  return (
    <div
      className={cn(
        "sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 rounded-2xl md:block lg:w-80",
        className,
      )}
    >
      <div className="relative group mb-4">
        {/* 공지사항 */}
        <div 
          className="relative space-y-3 rounded-2xl bg-black p-4 shadow-md transition-all duration-500 group-hover:scale-[1.03]"
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
            Welcome to Divetobada! It&apos;s a social community for everyone who likes K-culture.
          </h2>
        </div>
      </div>
      {/* <LatestYoutubeVideo channelId="UC9uSl4n2Zmz__HciYpWyASw" /> */}
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopicsWithBrand />
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
      <div className="text-xl font-bold">친구를 찾아볼까요?</div>
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

import TrendingTopics from "./TrendingTopics";

async function TrendingTopicsWithBrand() {
  return (
    <>
      <TrendingTopics />
      
      {/* 브랜드 사이드바 */}
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <BrandSidebar />

        <div className="flex flex-col gap-6">
          {/* <div className="flex w-full justify-end">
            <div className="flex flex-col justify-end gap-1 text-xs text-gray-400">
              <div className="text-right">대표자:박준서</div>
              <div className="text-right">사업자등록번호:602-13-77154</div>
            </div>
          </div> */}
          <div className="flex w-full justify-end">
            <div className="flex flex-col justify-end gap-1 text-xs text-gray-400">
              <div className="text-right">
                Email : teambada1206@gmail.com(only)
              </div>
              <div className="text-right">서비스이용약관</div>
              <Link href="/privacy">
                <div className="text-right hover:text-foreground transition-colors cursor-pointer">개인정보처리방침</div>
              </Link>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="flex flex-col justify-end gap-1 text-xs text-gray-400">
              <Link
                href="https://www.vessel.today"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="text-right">Vessel</div>
              </Link>

              <Link
                href="https://www.instagram.com/team_masanbaseball/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="text-right">Baseball playlist</div>
              </Link>
              <Link
                href="https://profuse-soil-41e.notion.site/GUEMSoNG-Digital-Magazine-1788bfe8131a80ecb20ed23cd21f2fdf?pvs=4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="text-right">Magazine 굄성;</div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
