"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useParams } from "next/navigation";

export default function StudioSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setSidebar } = useSidebar();
  const params = useParams<{ studioId: string }>();
  const studioId = params.studioId;

  // 설정 페이지 진입 시 사이드바 활성화
  useEffect(() => {
    if (studioId) {
      setSidebar('discord', {
        activeTab: 'settings',
        studioId,
      });
    }
  }, [studioId, setSidebar]);

  return <>{children}</>;
}

