"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsVertical, TabsVerticalContent, TabsVerticalList, TabsVerticalTrigger } from "@/components/ui/tabsvertical";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostEditorModal from "@/components/posts/editor/PostEditorModal";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";
import MainLogo from "@/assets/mainlogo.png";

export default function MainContent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <main className="flex-1">
      {/* 데스크톱 버전 */}
      <TabsVertical defaultValue="for-you" className="w-full hidden md:block">
        <div className="w-full flex justify-between px-4">
          <div className="w-1/3 items-center justify-start flex">
            <UserButton className="border-2 border-stone-700"/>
          </div>
          <div className="w-1/3 items-center justify-center flex">
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
          <div className="w-1/3 items-center justify-end flex">
            <TabsVerticalList>
              <TabsVerticalTrigger value="for-you" className="text-right">추천</TabsVerticalTrigger>
              <TabsVerticalTrigger value="following" className="text-right">팔로잉</TabsVerticalTrigger>
            </TabsVerticalList>
          </div>
        </div>

        <div className="mt-4">
          <TabsVerticalContent value="for-you">
            <ForYouFeed />
          </TabsVerticalContent>
          <TabsVerticalContent value="following">
            <FollowingFeed />
          </TabsVerticalContent>
        </div>
      </TabsVertical>
      {/* 모바일 버전 */}
      <Tabs defaultValue="for-you" className="w-full md:hidden">
        <TabsList className="md:hidden">
          <TabsTrigger value="for-you" className="text-center">추천</TabsTrigger>
          <TabsTrigger value="following" className="text-center">팔로잉</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <ForYouFeed />
        </TabsContent>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
      </Tabs>
    </main>
  );
} 