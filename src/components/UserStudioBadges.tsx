"use client";

import { useQuery } from "@tanstack/react-query";
import { StudioData } from "@/lib/types";
import StudioBadge from "@/components/StudioBadge";

interface UserStudioBadgesProps {
  studioIds: string[];
}

export default function UserStudioBadges({ studioIds }: UserStudioBadgesProps) {
  // 선택된 스튜디오 정보 조회
  const { data: studios } = useQuery<StudioData[]>({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
      return res.json();
    },
  });

  if (!studioIds || studioIds.length === 0 || !studios) {
    return null;
  }

  // 선택된 스튜디오만 필터링
  const displayStudios = studios.filter((s) => studioIds.includes(s.id));

  if (displayStudios.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {displayStudios.map((studio) => (
          <StudioBadge
            key={studio.id}
            studioId={studio.id}
            studioName={studio.name}
            studioAvatarUrl={studio.avatarUrl}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}

