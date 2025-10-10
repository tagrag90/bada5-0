"use client";

import { useState } from "react";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import FollowListModal from "./FollowListModal";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="text-xl font-bold">
          {formatNumber(data.followers)}
        </span>
        <span className="text-muted-foreground">Followers</span>
      </button>

      <FollowListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        type="followers"
        title="팔로워"
      />
    </>
  );
}
