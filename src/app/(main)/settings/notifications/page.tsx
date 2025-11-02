"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function NotificationsSettingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('discord', { activeTab: 'notifications' });
  }, [setSidebar]);

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">알림 설정</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
            알림 설정 기능은 추후 추가될 예정입니다.
          </p>
        </div>
      </Card>
    </div>
  );
}

