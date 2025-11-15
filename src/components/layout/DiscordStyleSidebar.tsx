"use client";

import { usePathname } from "next/navigation";
import StudioContentList from "./StudioContentList";
import SettingsSidebar from "./SettingsSidebar";
import StudioSettingsSidebar from "./StudioSettingsSidebar";
import WorkspaceFileHeader from "@/app/(main)/studios/[studioId]/workspace/[fileId]/WorkspaceFileHeader";
import WorkspaceNodeAddBlock from "@/app/(main)/studios/[studioId]/workspace/[fileId]/WorkspaceNodeAddBlock";

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
  fileId?: string; // 화이트보드 파일 ID
}

export default function DiscordStyleSidebar({
  selectedStudioId,
  selectedChannel = "posts",
  onStudioSelect,
  onChannelSelect,
  isOwner = false,
  studioName = "",
  studio,
  fileId,
}: DiscordStyleSidebarProps) {
  const pathname = usePathname();
  const isSettingsPage = pathname?.startsWith('/settings');
  const isStudioSettingsPage = pathname?.includes('/studios/') && pathname?.includes('/settings');
  const isWorkspaceFilePage = pathname?.match(/\/studios\/[^/]+\/workspace\/[^/]+$/);

  return (
    <div className="relative flex h-full bg-white text-black" style={{ width: '100%' }}>
      {/* 우측 칼럼: 채널 목록 또는 설정 사이드바 */}
      <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>
        {isSettingsPage ? (
          /* 설정 페이지일 때 설정 사이드바 표시 */
          <SettingsSidebar />
        ) : isStudioSettingsPage && selectedStudioId ? (
          /* 스튜디오 설정 페이지일 때 스튜디오 설정 사이드바 표시 */
          <StudioSettingsSidebar studioId={selectedStudioId} />
        ) : isWorkspaceFilePage && selectedStudioId && fileId ? (
          /* 화이트보드 파일 페이지일 때 파일 헤더 및 노드 추가 블록 표시 */
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border-b border-gray-200">
              <WorkspaceFileHeader studioId={selectedStudioId} fileId={fileId} />
            </div>
            <div className="flex-shrink-0 border-b border-gray-200 p-3">
              <WorkspaceNodeAddBlock />
            </div>
          </div>
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
          /* 스튜디오 미선택 시 빈 상태 */
          <div className="flex items-center justify-center py-8 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm">스튜디오를 선택하세요</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
