"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold">
        {formatNumber(data.followers)}
      </span>
      <span className="text-muted-foreground">Followers</span>
    </div>
  );
}
