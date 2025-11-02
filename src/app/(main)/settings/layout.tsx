"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setSidebar } = useSidebar();
  const pathname = usePathname();

  // 설정 페이지 진입 시 사이드바 활성화 (각 페이지에서 개별 관리하므로 여기서는 기본 설정만)
  useEffect(() => {
    // 각 설정 페이지에서 개별적으로 사이드바를 관리하므로 여기서는 기본 설정만 수행
    // 페이지별 사이드바 활성화는 각 페이지 컴포넌트에서 처리
  }, [setSidebar, pathname]);

  return <>{children}</>;
}

