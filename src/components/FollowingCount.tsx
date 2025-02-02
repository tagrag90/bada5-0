"use client";

import useFollowingInfo from "../hooks/useFollowingInfo";
import { FollowingInfo } from "../lib/types";
import { formatNumber } from "../lib/utils";

interface FollowingCountProps {
  userId: string;
  initialState: FollowingInfo;
}

export default function FollowingCount({
  userId,
  initialState,
}: FollowingCountProps) {
  const { data } = useFollowingInfo(userId, initialState);

  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold">
        {formatNumber(data.following)}
      </span>
      <span className="text-muted-foreground">Following</span>
    </div>
  );
} 