import { FollowingInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowingInfo(
  userId: string,
  initialState: FollowingInfo,
) {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/following`);
      if (!response.ok) throw new Error("Failed to fetch following info");
      return response.json();
    },
    initialData: initialState,
  });
} 