"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Logo from "@/assets/logo.png";

interface Studio {
  id: string;
  name: string;
  avatarUrl?: string;
  type: 'PERSONAL' | 'TEAM';
  isVerified: boolean;
  _count: {
    members: number;
    events: number;
  };
}

interface ServerListProps {
  selectedStudioId?: string;
  onStudioSelect: (studioId: string | null) => void;
  onCreateStudio: () => void;
}

export default function ServerList({
  selectedStudioId,
  onStudioSelect,
  onCreateStudio,
}: ServerListProps) {
  const router = useRouter();

  // 사용자 스튜디오 목록 조회
  const { data: studios, isLoading } = useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
      return res.json() as Promise<Studio[]>;
    },
  });

  return (
    <>
      {/* 상단: 홈 버튼 (바다 로고) */}
      <div className="flex flex-col items-center p-3">
        <Link href="/">
          <button
            onClick={() => onStudioSelect(null)}
            className={cn(
              "group relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200",
              !selectedStudioId && "bg-black hover:bg-black"
            )}
            title="홈으로"
          >
            <Image
              src={Logo}
              alt="Dive to Bada"
              width={56}
              height={56}
              className={cn(
                "h-14 w-14 rounded-full object-contain opacity-60 group-hover:opacity-80",
                !selectedStudioId && "opacity-100 group-hover:opacity-100"
              )}
            />
          </button>
        </Link>

        {/* Cosmos 우주 탐험 버튼 */}
        <Link href="/ui-lab/cosmos">
          <button
            className="group relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1d2e] transition-all hover:scale-110 shadow-lg overflow-hidden"
            title="Cosmos 🌌"
          >
            <Image
              src="/cosmos-icon.png"
              alt="Cosmos"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          </button>
        </Link>

        {/* 찾기 버튼 */}
        <Link href="/explore">
          <button
            className="group relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200"
            title="스튜디오 찾기"
          >
            <Search className="h-7 w-7 text-gray-600 group-hover:text-gray-800" />
          </button>
        </Link>

        <div className="h-0.5 w-10 rounded-full bg-gray-300 mb-3" />
      </div>

      {/* 서버 목록 */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-2">
          {/* 스튜디오 목록 */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-14 animate-pulse rounded-full bg-gray-100"
                />
              ))}
            </div>
          ) : (
            studios?.map((studio) => (
              <button
                key={studio.id}
                onClick={() => {
                  onStudioSelect(studio.id);
                  router.push(`/studios/${studio.id}`);
                }}
                className={cn(
                  "group relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200",
                  selectedStudioId === studio.id && "bg-black hover:bg-black"
                )}
                title={studio.name}
              >
                    {studio.avatarUrl ? (
                      <Image
                        key={studio.avatarUrl}
                        src={studio.avatarUrl}
                        alt={studio.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-xl font-bold text-black">
                    {studio.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* 선택 표시 - 초록색 점 */}
                {selectedStudioId === studio.id && (
                  <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-green-500 border-2 border-gray-50" />
                )}

                {/* 호버 툴팁 */}
                <div className="absolute left-24 top-1/2 z-50 hidden -translate-y-1/2 rounded bg-gray-900 px-2 py-1 text-sm font-medium text-white group-hover:block">
                  {studio.name}
                </div>
              </button>
            ))
          )}

          {/* 새 스튜디오 생성 버튼 */}
          <button
            onClick={onCreateStudio}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-black hover:text-white"
            title="새 스튜디오 생성"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>
      </div>
    </>
  );
}
