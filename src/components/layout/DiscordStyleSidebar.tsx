"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ServerList from "./ServerList";
import StudioContentList from "./StudioContentList";
import CreateStudioDialog from "@/app/(main)/studios/CreateStudioDialog";
import UserProfileButton from "@/components/UserProfileButton";
import BrandSidebar from "@/components/BrandSidebar";
import SettingsSidebar from "./SettingsSidebar";
import StudioSettingsSidebar from "./StudioSettingsSidebar";
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
  whoToFollowSlot?: React.ReactNode; // 서버 컴포넌트를 children으로 받음
}

export default function DiscordStyleSidebar({
  selectedStudioId,
  selectedChannel = "posts",
  onStudioSelect,
  onChannelSelect,
  isOwner = false,
  studioName = "",
  studio,
  whoToFollowSlot,
}: DiscordStyleSidebarProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');
  const isStudioSettingsPage = pathname?.includes('/studios/') && pathname?.includes('/settings');
  // 워크스페이스 파일 페이지 감지 (화이트보드 진입 시)
  const isWorkspaceFilePage = pathname?.includes('/workspace/') && pathname?.match(/\/workspace\/[^\/]+$/);

  // 테블릿 사이즈 감지 (md 이상 xl 미만)
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1280);
    };
    
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

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

      {/* 우측 칼럼: 채널 목록 또는 설정 사이드바 (테블릿에서는 숨김, 워크스페이스 파일 페이지에서는 숨김) */}
      <div className={isTablet || selectedChannel === 'workspace' || isWorkspaceFilePage ? "hidden" : "flex flex-col flex-1"} style={{ minWidth: 0 }}>
        {isSettingsPage ? (
          /* 설정 페이지일 때 설정 사이드바 표시 */
          <SettingsSidebar />
        ) : isStudioSettingsPage && selectedStudioId ? (
          /* 스튜디오 설정 페이지일 때 스튜디오 설정 사이드바 표시 */
          <StudioSettingsSidebar studioId={selectedStudioId} />
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
          /* 스튜디오 미선택 시 상단 WhoToFollow + 하단 컴포넌트들 */
          <>
            {/* 상단: WhoToFollow 컴포넌트 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {whoToFollowSlot || (
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-sm">스튜디오를 선택하세요</div>
                    </div>
                  </div>
                )}
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
