"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

interface PublicStudio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isVerified: boolean;
  owner: {
    username: string;
    displayName: string;
  };
  _count: {
    members: number;
    events: number;
    subscriptions: number;
  };
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 검색 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 공개 스튜디오 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-studios", debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/studios/public?${params}`);
      if (!res.ok) throw new Error("Failed to fetch studios");
      return res.json() as Promise<{
        studios: PublicStudio[];
        total: number;
        hasMore: boolean;
      }>;
    },
  });

  const studios = data?.studios || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src="/logo-bada.png"
              alt="Bada Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">
          스튜디오 찾아보기
        </h1>
        <p className="text-gray-600">
          관심 있는 스튜디오를 찾아 구독하고 다양한 콘텐츠를 만나보세요
        </p>
      </div>

      {/* 검색 섹션 */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="스튜디오 이름이나 설명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* 결과 통계 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isLoading ? (
            "스튜디오를 불러오는 중..."
          ) : (
            <>
              총 <span className="font-semibold">{formatNumber(total)}</span>개의 스튜디오를 발견했습니다
              {debouncedSearch && ` ("${debouncedSearch}" 검색 결과)`}
            </>
          )}
        </p>
      </div>

      {/* 스튜디오 그리드 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">스튜디오를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600">
            {debouncedSearch
              ? `"${debouncedSearch}"에 대한 검색 결과가 없습니다.`
              : "아직 공개된 스튜디오가 없습니다."
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioExploreCard key={studio.id} studio={studio} />
          ))}
        </div>
      )}

      {/* 더 많은 결과 로드 버튼 (나중에 무한 스크롤로 개선 가능) */}
      {data?.hasMore && (
        <div className="text-center pt-6">
          <Button variant="outline" size="sm">
            더 많은 스튜디오 보기
          </Button>
        </div>
      )}
    </div>
  );
}

// 개별 스튜디오 카드 컴포넌트
function StudioExploreCard({ studio }: { studio: PublicStudio }) {
  return (
    <Link href={`/studios/${studio.id}`}>
      <div className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200 rounded-lg">
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative mx-auto">
            <Image
              src={studio.avatarUrl || "/logo-bada.png"}
              alt={studio.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{studio.name}</h3>
            {studio.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {studio.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>구독자 {formatNumber(studio._count.subscriptions)}</span>
            <span>멤버 {formatNumber(studio._count.members)}</span>
            <span>이벤트 {formatNumber(studio._count.events)}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                studio.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {studio.isVerified ? "인증됨" : "일반"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
