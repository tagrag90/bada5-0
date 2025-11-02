"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function SecuritySettingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const { setSidebar } = useSidebar();

  useEffect(() => {
    setSidebar('discord', { activeTab: 'security' });
  }, [setSidebar]);

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5" />
          <h2 className="text-xl font-semibold">계정 보안</h2>
        </div>

        <div className="space-y-6">
          {/* 비밀번호 변경 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              비밀번호
            </Label>
            <Button variant="outline" disabled className="w-full">
              비밀번호 변경
            </Button>
            <p className="text-xs text-muted-foreground">
              비밀번호 변경 기능은 추후 추가될 예정입니다.
            </p>
          </div>

          <hr className="border-t" />

          {/* Google 연동 상태 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              소셜 계정 연동
            </Label>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
                  <span className="text-sm font-semibold">G</span>
                </div>
                <span className="font-medium">Google</span>
              </div>
              <span className="text-sm text-green-600 font-medium">연동됨</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

