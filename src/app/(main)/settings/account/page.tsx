"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function AccountSettingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSidebar } = useSidebar();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setSidebar('discord', { activeTab: 'account' });
  }, [setSidebar]);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogoutAll = async () => {
    queryClient.clear();
    await logout();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">계정 관리</h2>

        <div className="space-y-6">
          {/* 모든 기기에서 로그아웃 */}
          <div>
            <h3 className="font-medium mb-2">모든 기기에서 로그아웃</h3>
            <p className="text-sm text-muted-foreground mb-4">
              현재 로그인된 모든 세션을 종료합니다
            </p>
            {showLogoutConfirm ? (
              <div className="border border-amber-500 bg-amber-50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">정말 로그아웃하시겠습니까?</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    취소
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleLogoutAll}
                  >
                    로그아웃
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            )}
          </div>

          <hr className="border-t" />

          {/* 계정 삭제 */}
          <div>
            <h3 className="font-medium text-destructive mb-2">계정 삭제</h3>
            <p className="text-sm text-muted-foreground mb-4">
              계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            {showDeleteConfirm ? (
              <div className="border border-red-500 bg-red-50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-red-800">
                  정말로 계정을 삭제하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    취소
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled
                  >
                    계정 삭제 (준비중)
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                계정 삭제
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

