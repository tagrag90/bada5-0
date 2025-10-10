"use client";

import Link from "next/link";
import { LogOutIcon, Settings, UserIcon } from "lucide-react";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";

export default function UserProfileButton() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-accent transition-colors">
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
  );
}

