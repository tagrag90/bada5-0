"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, LogOutIcon, Monitor, Moon, Settings, Sun, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface LeftSidebarProps {
  children?: React.ReactNode;
}

export default function LeftSidebar({ children }: LeftSidebarProps) {
  const [width, setWidth] = useState(256); // 기본 256px (w-64)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const { user } = useSession();
  const queryClient = useQueryClient();

  // localStorage에서 저장된 너비 불러오기
  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebar-width");
    if (savedWidth) {
      setWidth(parseInt(savedWidth));
    }
  }, []);

  // 리사이징 시작
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // 리사이징 중
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      // 최소 200px, 최대 400px
      if (newWidth >= 200 && newWidth <= 400) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        // localStorage에 저장
        localStorage.setItem("sidebar-width", width.toString());
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, width]);

  // 부모 컴포넌트에 너비 전달
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [width]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className="fixed left-0 top-0 h-screen bg-card border-r border-border overflow-y-auto hidden xl:flex xl:flex-col z-30"
        style={{ width: `${width}px` }}
      >
        {/* 로고 */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <Image src={Logo} alt="Divetobada" width={32} height={32} />
            <span className="font-bold text-xl">Divetobada</span>
          </Link>
        </div>

        {/* 상단 영역 - 나중에 추가될 콘텐츠 */}
        <div className="p-4 flex-shrink-0">
          {/* 여기에 나중에 콘텐츠 추가 */}
        </div>

        {/* 빈 공간 */}
        <div className="flex-grow"></div>

        {/* 하단 영역 - 트렌드 사이드바 */}
        <div className="flex-shrink-0">
          {children}
        </div>

        {/* 사용자 계정 섹션 - 최하단 */}
        {user && (
          <div className="flex-shrink-0 p-3 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                  <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} size={40} />
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {user.displayName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      @{user.username}
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-muted-foreground flex-shrink-0"
                  >
                    <circle cx="10" cy="5" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="10" cy="15" r="1.5" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user.username}`} className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>프로필 보기</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>설정</span>
                  </Link>
                </DropdownMenuItem>
                
                {/* 어드민 메뉴 (qkrwnstj0401만 접근 가능) */}
                {user.username === 'qkrwnstj0401' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    queryClient.clear();
                    logout();
                  }}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* 리사이즈 핸들 */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:w-1.5 transition-all ${
            isResizing ? "bg-blue-500 w-1.5" : "bg-transparent hover:bg-blue-400"
          }`}
          onMouseDown={startResizing}
        />
      </aside>
    </>
  );
}

