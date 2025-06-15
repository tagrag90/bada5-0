"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { Users, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface YoutubeStatsProps {
  channelId: string;
}

interface Stats {
  subscriberCount: string;
  videoCount: string;
}

export default function YoutubeStats({ channelId }: YoutubeStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/youtube/stats?channelId=${channelId}`,
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to parse error response" }));
          throw new Error(errorData.error || "Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error: any) {
        console.error(error);
        setError(error.message);
        setStats(null); // Clear stats on error
      } finally {
        setLoading(false);
      }
    }
    if (channelId) {
      fetchStats();
    }
  }, [channelId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-black bg-card p-4">
          <div className="flex flex-col items-start space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[50px]" />
          </div>
        </div>
        <div className="rounded-lg border-2 border-black bg-card p-4">
          <div className="flex flex-col items-start space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[50px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-card p-4">
        <p className="font-semibold text-destructive">
          통계 정보를 불러올 수 없습니다.
        </p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border-2 border-black bg-card p-4 text-left">
        <p className="text-lg font-bold">
          {formatNumber(parseInt(stats.subscriberCount))}
        </p>
        <p className="text-sm text-muted-foreground">구독자</p>
      </div>
      <div className="rounded-lg border-2 border-black bg-card p-4 text-left">
        <p className="text-lg font-bold">
          {formatNumber(parseInt(stats.videoCount))}
        </p>
        <p className="text-sm text-muted-foreground">동영상</p>
      </div>
    </div>
  );
} 