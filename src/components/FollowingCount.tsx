"use client";

import { useState } from "react";
import useFollowingInfo from "../hooks/useFollowingInfo";
import { FollowingInfo } from "../lib/types";
import { formatNumber } from "../lib/utils";
import FollowListModal from "./FollowListModal";

interface FollowingCountProps {
  userId: string;
  initialState: FollowingInfo;
}

export default function FollowingCount({
  userId,
  initialState,
}: FollowingCountProps) {
  const { data } = useFollowingInfo(userId, initialState);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="text-xl font-bold">
          {formatNumber(data.following)}
        </span>
        <span className="text-muted-foreground">Following</span>
      </button>

      <FollowListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        type="following"
        title="팔로잉"
      />
    </>
  );
} 