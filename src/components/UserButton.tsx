"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon, UserIcon, Settings, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const user = useOptionalUser();
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

  // 사용자가 로그인하지 않은 경우 null을 반환
  if (!user) return null;

  const handleLogout = () => {
    queryClient.clear();
    logout();
    setShowMobileMenu(false);
  };

  // 모바일에서는 UserButton을 숨김 (유저 프로필 페이지에서 접근)
  if (isMobile) {
    return null;
  }

  // 데스크톱 버전 (기존 드롭다운)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex-none rounded-full border border-white",
            className,
          )}
        >
          <UserAvatar avatarUrl={user.avatarUrl} userId={user.id} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        {user.username === 'qkrwnstj0401' && (
          <>
            <DropdownMenuSeparator />
            <Link href="/admin">
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Admin
              </DropdownMenuItem>
            </Link>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4 text-pink-700" />
          <p className="text-pink-700">Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
