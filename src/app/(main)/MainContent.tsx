"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TabsVertical,
  TabsVerticalContent,
  TabsVerticalList,
  TabsVerticalTrigger,
} from "@/components/ui/tabsvertical";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import UsersFeed from "./UsersFeed";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";
import MainLogoWhite from "@/assets/logowhite.png";
import MainLogoBlack from "@/assets/logobalck.png";
import { useOptionalUser } from "./SessionProvider";
import InlinePostEditor from "@/components/posts/editor/InlinePostEditor";
import { cn } from "@/lib/utils";

export default function MainContent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const [activeMobileTab, setActiveMobileTab] = useState<'for-you' | 'following' | 'users'>('users');

  return (
    <main className="flex-1">
      {/* 데스크톱 버전 */}
      <TabsVertical defaultValue="users" className="hidden w-full md:block">
        <div
          className="flex w-full justify-between px-4 py-4"
          style={{ borderRadius: '1.5rem', backgroundColor: '#000000' }}
        >
          <div className="flex w-1/3 items-center justify-start">
            {isLoggedIn ? (
              <UserButton className="border-2 border-stone-700" />
            ) : (
              <Link href="/login">
                <Button variant="outline" className="font-semibold text-white">
                  로그인
                </Button>
              </Link>
            )}
          </div>
          <div className="flex w-1/3 items-center justify-center">
            <Link href="/">
              <Image
                src={MainLogoWhite}
                alt="logo"
                width={26}
                height={26}
                className="md:block"
              />
            </Link>
          </div>
          <div className="flex w-1/3 items-center justify-end">
            <TabsVerticalList>
              <TabsVerticalTrigger value="users" className="text-right">
                사용자
              </TabsVerticalTrigger>
              {isLoggedIn && (
                <TabsVerticalTrigger value="following" className="text-right">
                  팔로잉
                </TabsVerticalTrigger>
              )}
              {/* <TabsVerticalTrigger value="for-you" className="text-right">
                추천
              </TabsVerticalTrigger> */}
            </TabsVerticalList>
          </div>
        </div>

        {/* 인라인 에디터 - 데스크톱 */}
        {/* {isLoggedIn && (
          <div className="mt-4">
            <div className="rounded-[24px] bg-white p-4 drop-shadow overflow-hidden">
              <InlinePostEditor />
            </div>
          </div>
        )} */}

        <div className="mt-4">
          <TabsVerticalContent value="users">
            <UsersFeed />
          </TabsVerticalContent>
          {isLoggedIn && (
            <TabsVerticalContent value="following">
              <FollowingFeed />
            </TabsVerticalContent>
          )}
          {/* <TabsVerticalContent value="for-you">
            <ForYouFeed />
          </TabsVerticalContent> */}
        </div>
      </TabsVertical>

      {/* 모바일 버전 */}
      <div
        className="mb-2 w-full px-4 py-5 md:hidden"
        style={{ backgroundColor: '#000000' }}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-12 flex-shrink-0 justify-start">
            <Link href="/login">
              {!isLoggedIn && (
                <Button variant="outline" size="sm" className="font-semibold text-white">
                  로그인
                </Button>
              )}
            </Link>
          </div>
          <Link href="/">
            <Image
              src={MainLogoWhite}
              alt="logo"
              width={18}
              height={18}
            />
          </Link>
          <div className="w-12 flex-shrink-0"></div>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setActiveMobileTab('users')}
            className={cn(
              "text-sm font-medium transition-colors",
              activeMobileTab === 'users'
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            사용자
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setActiveMobileTab('following')}
              className={cn(
                "text-sm font-medium transition-colors",
                activeMobileTab === 'following'
                  ? 'text-white font-semibold'
                  : 'text-gray-400 hover:text-gray-300'
              )}
            >
              팔로잉
            </button>
          )}
          {/* <button
            onClick={() => setActiveMobileTab('for-you')}
            className={cn(
              "text-sm font-medium transition-colors",
              activeMobileTab === 'for-you'
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            추천
          </button> */}
        </div>
      </div>

      {/* {isLoggedIn && (
        <div className="mb-4 md:hidden">
          <div className="rounded-[24px] bg-white p-4 drop-shadow overflow-hidden">
            <InlinePostEditor />
          </div>
        </div>
      )} */}

      <div className="w-full md:hidden">
        {activeMobileTab === 'users' && <UsersFeed />}
        {isLoggedIn && activeMobileTab === 'following' && <FollowingFeed />}
        {/* {activeMobileTab === 'for-you' && <ForYouFeed />} */}
      </div>
    </main>
  );
}
