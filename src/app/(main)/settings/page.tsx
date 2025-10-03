"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Shield, Bell, Trash2, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/app/(main)/SessionProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogoutAll = async () => {
    queryClient.clear();
    await logout();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">설정</h1>
      </div>

      {/* 계정 보안 */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5" />
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

      {/* 알림 설정 */}
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

      {/* 계정 관리 */}
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
