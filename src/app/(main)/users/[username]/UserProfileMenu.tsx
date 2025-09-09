"use client";

import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, LogOutIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserProfileMenuProps {
  username: string;
  isOwnProfile: boolean;
}

export default function UserProfileMenu({ username, isOwnProfile }: UserProfileMenuProps) {
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 본인 프로필이 아니면 메뉴를 표시하지 않음
  if (!isOwnProfile) return null;

  const handleLogout = () => {
    queryClient.clear();
    logout();
    setShowMobileMenu(false);
  };

  // 모바일 버전
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileMenu(true)}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        {/* 모바일 메뉴 다이얼로그 */}
        <Dialog open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg">
            <DialogHeader className="bg-white pt-6">
              <DialogTitle className="text-center text-gray-900">프로필 메뉴</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 bg-white p-2">
              {username === 'qkrwnstj0401' && (
                <>
                  <Link href="/admin" onClick={() => setShowMobileMenu(false)}>
                    <button className="flex w-full items-center space-x-3 rounded-lg p-3 text-left bg-gray-50 hover:bg-gray-100 text-gray-900">
                      <Settings className="h-5 w-5 text-gray-700" />
                      <span>관리자</span>
                    </button>
                  </Link>
                  <div className="border-t border-gray-200" />
                </>
              )}
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-3 rounded-lg p-3 text-left text-red-700 bg-red-50 hover:bg-red-100 border border-red-200"
              >
                <LogOutIcon className="h-5 w-5 text-red-600" />
                <span>로그아웃</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // 데스크톱 버전
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {username === 'qkrwnstj0401' && (
          <>
            <Link href="/admin">
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                관리자
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 bg-red-50 focus:bg-red-100"
        >
          <LogOutIcon className="mr-2 size-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
