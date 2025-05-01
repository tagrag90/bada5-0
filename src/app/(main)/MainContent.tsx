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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostEditorModal from "@/components/posts/editor/PostEditorModal";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";
import MainLogo from "@/assets/mainlogo.png";
import { useOptionalUser } from "./SessionProvider";
import InlinePostEditor from "@/components/posts/editor/InlinePostEditor";

export default function MainContent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const user = useOptionalUser();
  const isLoggedIn = !!user;

  return (
    <main className="flex-1">
      {/* 데스크톱 버전 */}
      <TabsVertical defaultValue="for-you" className="hidden w-full md:block">
        <div className="flex w-full justify-between px-4">
          <div className="flex w-1/3 items-center justify-start">
            {isLoggedIn ? (
              <UserButton className="border-2 border-stone-700" />
            ) : (
              <Link href="/login">
                <Button variant="outline" className="font-semibold">
                  로그인
                </Button>
              </Link>
            )}
          </div>
          <div className="flex w-1/3 items-center justify-center">
            <Link href="/">
              <Image
                src={MainLogo}
                alt="logo"
                width={35}
                height={35}
                className="rounded-full md:block"
              />
            </Link>
          </div>
          <div className="flex w-1/3 items-center justify-end">
            <TabsVerticalList>
              <TabsVerticalTrigger value="for-you" className="text-right">
                추천
              </TabsVerticalTrigger>
              {isLoggedIn && (
                <TabsVerticalTrigger value="following" className="text-right">
                  팔로잉
                </TabsVerticalTrigger>
              )}
            </TabsVerticalList>
          </div>
        </div>

        {/* 인라인 에디터 - 데스크톱 */}
        {isLoggedIn && (
          <div className="mt-4">
            <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
              <InlinePostEditor />
            </div>
          </div>
        )}

        <div className="mt-4">
          <TabsVerticalContent value="for-you">
            <ForYouFeed />
          </TabsVerticalContent>
          {isLoggedIn && (
            <TabsVerticalContent value="following">
              <FollowingFeed />
            </TabsVerticalContent>
          )}
        </div>
      </TabsVertical>

      {/* 모바일 버전 */}
      <div className="mb-2 flex w-full items-center justify-between px-4 md:hidden">
        <Link href="/login">
          {!isLoggedIn && (
            <Button variant="outline" size="sm" className="font-semibold">
              로그인
            </Button>
          )}
        </Link>
        <Link href="/">
          <Image
            src={MainLogo}
            alt="logo"
            width={24}
            height={24}
            className="rounded-full"
          />
        </Link>
        <div className="w-12"></div> {/* 빈 공간으로 중앙 정렬 유지 */}
      </div>

      {/* 인라인 에디터 - 모바일 */}
      {isLoggedIn && (
        <div className="mb-4 md:hidden">
          <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
            <InlinePostEditor />
          </div>
        </div>
      )}

      <Tabs defaultValue="for-you" className="w-full md:hidden">
        <TabsList className="md:hidden">
          <TabsTrigger value="for-you" className="text-center">
            추천
          </TabsTrigger>
          {isLoggedIn && (
            <TabsTrigger value="following" className="text-center">
              팔로잉
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="for-you">
          <ForYouFeed />
        </TabsContent>
        {isLoggedIn && (
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
