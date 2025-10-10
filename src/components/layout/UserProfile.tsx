"use client";

import { useQuery } from "@tanstack/react-query";
import { Settings, Mic, Headphones, MicOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  onSettingsClick?: () => void;
}

export default function UserProfile({ onSettingsClick }: UserProfileProps) {
  // 현재 사용자 정보 조회
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) return null;
      return res.json();
    },
  });

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-2 border-t border-gray-200">
      <button className="group relative flex w-full items-center rounded-lg p-2 transition-all hover:bg-gray-100">
        <div className="relative mr-3">
          <Image
            src={currentUser.avatarUrl || "/avatars/default-1.png"}
            alt={currentUser.displayName || currentUser.username}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          {/* 온라인 상태 표시 */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-gray-50 bg-green-500" />
        </div>

        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-black truncate">
            {currentUser.displayName || currentUser.username}
          </div>
          <div className="text-xs text-gray-500">
            #{currentUser.username}
          </div>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="flex items-center gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600">
            <Mic className="h-4 w-4" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600">
            <Headphones className="h-4 w-4" />
          </button>
          <button
            onClick={onSettingsClick}
            className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </button>
    </div>
  );
}
