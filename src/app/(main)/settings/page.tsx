"use client";

import { useEffect } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function SettingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('discord', { activeTab: 'profile' });
  }, [setSidebar]);

  useEffect(() => {
    // 기본 설정 페이지는 프로필 편집으로 리다이렉트
    if (user) {
      router.replace('/settings/profile');
    }
  }, [user, router]);

  if (!user) {
    router.push("/login");
    return null;
  }

  return null;
}
