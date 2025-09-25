import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, FollowingInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";
import UserProfileMenu from "./UserProfileMenu";
import { Instagram, Link2, Users, Settings } from "lucide-react";
import Link from "next/link";
import { SkillList } from "@/components/SkillBadge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FollowingCount from "@/components/FollowingCount";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        {/* <div className="bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div> */}
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  const followingInfo: FollowingInfo = {
    following: user._count.following || 0,
  };

  // 실제 사용자 스킬 데이터 사용
  const userSkills = user.skills || [];

  return (
    <div
      className="w-full border bg-card p-8 shadow-sm"
      style={{ borderRadius: '1.5rem' }}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6 py-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <UserProfileMenu 
                username={user.username} 
                isOwnProfile={user.id === loggedInUserId}
              />
            </div>
            <div className="text-muted-foreground">@{user.username}</div>
            {user.bio && (
              <div className="overflow-hidden whitespace-pre-line break-words">
                {user.bio}
              </div>
            )}
          </div>
          <UserAvatar
            avatarUrl={user.avatarUrl}
            userId={user.id}
            size={80}
            className="rounded-full"
          />
        </div>

        {/* {user.bio && (
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        )} */}
        <div className="flex items-center gap-8 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">
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

        {/* 스킬 배지 - 팔로잉/팔로워 바로 아래 */}
        {userSkills.length > 0 && (
          <div className="mt-4">
            <SkillList skills={userSkills} />
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Instagram className="h-5 w-5 text-black" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>준비중</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link2 className="h-5 w-5 text-black" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>준비중</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="ml-auto flex gap-2">
            {user.id === loggedInUserId ? (
              <EditProfileButton user={user} />
            ) : (
              <>
                <FollowButton userId={user.id} initialState={followerInfo} />
                {/* <Button variant="outline">message</Button> */}
              </>
            )}
          </div>
        </div>



        {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            게시물{" "}
            <span className="font-semibold text-foreground">
              {formatNumber(user._count.posts)}
            </span>
          </span>
          <FollowerCount userId={user.id} initialState={followerInfo} />
          <span>
            <FollowingCount userId={user.id} initialState={followingInfo} />
          </span>
          <span>
            가입일{" "}
            <span className="font-semibold text-foreground">
              {formatDate(user.createdAt, "yyyy.MM.dd")}
            </span>
          </span>
        </div> */}
      </div>
    </div>
  );
}
