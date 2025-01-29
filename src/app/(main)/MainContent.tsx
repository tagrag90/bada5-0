"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostEditorModal from "@/components/posts/editor/PostEditorModal";

export default function MainContent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <main className="flex-1">
      <div className="mb-4">
        {/* <Button
          onClick={() => setIsEditorOpen(true)}
          className="w-full rounded-full bg-foreground px-6 py-2 text-background hover:bg-foreground/90"
        >
          무슨 생각을 하고 계신가요?
        </Button> */}
      </div>
      <div>user</div>
      <PostEditorModal 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
      />

      <Tabs defaultValue="for-you" className="w-full">
        <TabsList>
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