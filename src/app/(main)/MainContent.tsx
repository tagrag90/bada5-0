"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ForYouFeedServer from "./ForYouFeedServer";
import FollowingFeed from "./FollowingFeed";
import { useOptionalUser } from "./SessionProvider";
import NonLoggedInContent from "@/components/NonLoggedInContent";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MainContent() {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const { setDiscordSidebar } = useSidebar();
  const pathname = usePathname();
  
  // 스튜디오 페이지인지 확인
  const isStudioPage = pathname?.startsWith('/studios/') && !pathname?.includes('/settings');

  // 디스코드 스타일 사이드바 활성화
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('posts');

  // 디스코드 사이드바 설정
  const handleStudioSelect = (studioId: string | null) => {
    setSelectedStudioId(studioId);
    setSelectedChannel('posts'); // 스튜디오 변경 시 채널 초기화
  };

  const handleChannelSelect = (channel: string) => {
    setSelectedChannel(channel);
  };

  // 디스코드 사이드바 활성화 (로그인 시 즉시 실행, 단 스튜디오 페이지에서는 제외)
  useEffect(() => {
    if (isLoggedIn && !isStudioPage) {
      setDiscordSidebar({
        selectedStudioId: selectedStudioId || null,
        selectedChannel: selectedChannel || 'posts',
        onStudioSelect: handleStudioSelect,
        onChannelSelect: handleChannelSelect,
        studioName: "",
      });
    }
  }, [isLoggedIn, selectedStudioId, selectedChannel, setDiscordSidebar, isStudioPage]);

  return (
    <main className="flex-1">
      {!isLoggedIn ? (
        <NonLoggedInContent />
      ) : (
        <>
          {/* 피드 선택 버튼 (헤더 외부) */}
          <Tabs defaultValue="for-you" className="w-full">
            {/* 피드 선택 버튼 - 수평 배열 */}
            <div className="flex justify-center px-4 py-4 border-b border-border/40 bg-background">
              <TabsList className="h-auto p-1 bg-muted rounded-lg gap-1">
                <TabsTrigger 
                  value="for-you" 
                  className="px-8 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/80"
                >
                  전체
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className="px-8 py-2.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/80"
                >
                  팔로잉
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 피드 컨텐츠 */}
            <div className="mt-4">
              <TabsContent value="for-you">
                <ForYouFeedServer />
              </TabsContent>
              <TabsContent value="following">
                <FollowingFeed />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </main>
  );
}
