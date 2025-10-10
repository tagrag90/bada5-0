"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { getUserFriendlyMessage } from "@/lib/error-messages";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onSuccess: () => {
      // 팔로워/팔로잉 리스트 쿼리 무효화 (모달에서 최신 데이터 반영)
      queryClient.invalidateQueries({ queryKey: ["followers-list"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["following-list"], exact: false });
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'follow'),
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
      className={
        data.isFollowedByUser
          ? "w-28 border-2 hover:bg-destructive hover:text-destructive-foreground"
          : "w-28 bg-black text-white hover:bg-gray-800"
      }
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
