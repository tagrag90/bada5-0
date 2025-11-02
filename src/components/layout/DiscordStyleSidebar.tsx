"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ServerList from "./ServerList";
import StudioContentList from "./StudioContentList";
import CreateStudioDialog from "@/app/(main)/studios/CreateStudioDialog";
import UserProfileButton from "@/components/UserProfileButton";
import BrandSidebar from "@/components/BrandSidebar";
import SettingsSidebar from "./SettingsSidebar";
import Link from "next/link";

interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  _count: {
    members: number;
    events: number;
  };
  subscribersCount: number;
}

interface DiscordStyleSidebarProps {
  selectedStudioId?: string;
  selectedChannel?: string;
  onStudioSelect: (studioId: string | null) => void;
  onChannelSelect: (channel: string) => void;
  isOwner?: boolean;
  studioName?: string;
  studio?: Studio;
}

export default function DiscordStyleSidebar({
  selectedStudioId,
  selectedChannel = "posts",
  onStudioSelect,
  onChannelSelect,
  isOwner = false,
  studioName = "",
  studio,
}: DiscordStyleSidebarProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');

  const handleCreateStudio = () => {
    setShowCreateDialog(true);
  };

  return (
    <div className="relative flex h-full bg-white text-black" style={{ width: '100%' }}>
      {/* 좌측 칼럼: 서버 목록 (항상 표시) */}
      <div className="flex w-20 flex-col items-center border-r border-gray-200 bg-gray-50 flex-shrink-0">
        <ServerList
          selectedStudioId={selectedStudioId}
          onStudioSelect={onStudioSelect}
          onCreateStudio={handleCreateStudio}
        />
      </div>

      {/* 우측 칼럼: 채널 목록 또는 설정 사이드바 (1.5배 확대) */}
      <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
        {isSettingsPage ? (
          /* 설정 페이지일 때 설정 사이드바 표시 */
          <SettingsSidebar />
        ) : selectedStudioId ? (
          /* 스튜디오 선택 시 채널 목록 */
          <StudioContentList
            studioId={selectedStudioId || ""}
            studioName={studioName}
            studio={studio}
            selectedTab={selectedChannel}
            onTabSelect={onChannelSelect}
            isOwner={isOwner}
          />
        ) : (
          /* 스튜디오 미선택 시 상단 빈 공간 + 하단 컴포넌트들 */
          <>
            {/* 상단 빈 공간 */}
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-sm">스튜디오를 선택하세요</div>
              </div>
            </div>

            {/* 하단 컴포넌트들 */}
            <div className="border-t border-gray-200">
              {/* 브랜드 사이드바 */}
              <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
                <BrandSidebar />

                <div className="flex flex-col gap-6">
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
                    <div className="flex flex-col justify-end gap-1 text-xs">
                      <Link
                        href="https://www.vessel.today"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                          Vessel
                        </div>
                      </Link>

                      <Link
                        href="https://www.instagram.com/team_masanbaseball/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                          Baseball playlist
                        </div>
                      </Link>

                      <Link href="/nonexistent-page" className="block">
                        <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                          404 탐험하기
                        </div>
                      </Link>

                      <Link href="/docs" className="block">
                        <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                          Docs
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* 유저 컴포넌트 */}
              <UserProfileButton />
            </div>
          </>
        )}
      </div>

      {/* 스튜디오 생성 다이얼로그 */}
      <CreateStudioDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
