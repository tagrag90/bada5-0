"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import NodeSidebar from "@/components/workspace/NodeSidebar";

interface RightSidebarAreaProps {
  children?: ReactNode;
}

/**
 * 우측 사이드바 영역 컴포넌트
 * 페이지별로 적절한 블록을 렌더링합니다.
 */
export default function RightSidebarArea({ children }: RightSidebarAreaProps) {
  const { sidebarsCollapsed, toggleSidebars, discordData } = useSidebar();
  const pathname = usePathname();
  const sidebarHeight = sidebarsCollapsed ? 60 : undefined; // 접혔을 때 높이 60px, 펼쳐졌을 때는 전체 높이
  
  // 화이트보드 파일 페이지인지 확인
  const isWorkspaceFilePage = pathname?.match(/\/studios\/[^/]+\/workspace\/[^/]+$/);

  // CSS 변수 설정 (너비는 항상 320px 유지)
  useEffect(() => {
    document.documentElement.style.setProperty("--right-sidebar-width", "320px");
  }, []);

  return (
    <aside 
      className="fixed right-4 bg-card border-2 border-black overflow-hidden hidden xl:flex xl:flex-col z-30 shadow-sm transition-all duration-300" 
      style={{ 
        width: '320px',
        top: '16px', // 항상 상단에 위치
        bottom: sidebarsCollapsed ? undefined : '16px',
        height: sidebarsCollapsed ? '60px' : undefined,
        borderRadius: '22px'
      }}
    >
      {/* 토글 버튼 - 우측 상단 */}
      <div className="flex-shrink-0 p-2 border-b border-gray-200 flex items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebars}
          className="h-6 w-6"
          title={sidebarsCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          {sidebarsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      {!sidebarsCollapsed && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 화이트보드 파일 페이지일 때는 노드 편집 사이드바 표시 */}
          {isWorkspaceFilePage && discordData?.nodeEditData ? (
            <div className="flex-1 overflow-hidden p-4">
              <NodeSidebar
                nodeId={discordData.nodeEditData.nodeId}
                initialTitle={discordData.nodeEditData.initialTitle}
                initialContent={discordData.nodeEditData.initialContent}
                initialEmoji={discordData.nodeEditData.initialEmoji}
                nodeType={discordData.nodeEditData.nodeType}
                isOpen={true}
                onClose={discordData.nodeEditData.onClose || (() => {})}
                onSave={discordData.nodeEditData.onSave || (async () => {})}
                onDelete={discordData.nodeEditData.onDelete}
              />
            </div>
          ) : (
            /* 일반 페이지일 때는 children (FeedRightSidebar) 표시 */
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

