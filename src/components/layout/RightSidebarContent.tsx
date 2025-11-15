"use client";

import { usePathname } from "next/navigation";
import FeedRightSidebar from "@/components/FeedRightSidebar";

/**
 * 우측 사이드바 내용 컴포넌트
 * 화이트보드 파일 페이지일 때는 기존 내용을 숨기고,
 * 일반 페이지일 때는 FeedRightSidebar를 표시합니다.
 */
export default function RightSidebarContent() {
  const pathname = usePathname();
  
  // 화이트보드 파일 페이지인지 확인
  const isWorkspaceFilePage = pathname?.match(/\/studios\/[^/]+\/workspace\/[^/]+$/);
  
  // 화이트보드 파일 페이지일 때는 아무것도 표시하지 않음 (노드 편집 사이드바가 표시됨)
  if (isWorkspaceFilePage) {
    return null;
  }
  
  // 일반 페이지일 때는 FeedRightSidebar 표시
  return (
    <div className="sticky top-5 p-5">
      <FeedRightSidebar />
    </div>
  );
}

