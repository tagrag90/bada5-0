import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Flashlight, Heart, Zap } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { getUserFriendlyMessage } from "@/lib/error-messages";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
  variant?: "default" | "overlay";
}

export default function LikeButton({ postId, initialState, variant = "default" }: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'like'),
      });
    },
  });

  const isOverlay = variant === "overlay";

  return (
    <button
      onClick={() => mutate()}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-4 py-2",
        isOverlay && "text-white hover:bg-white/10"
      )}
    >
      <Heart
        strokeWidth={1.5}
        className={cn(
          "size-5",
          data.isLikedByUser
            ? "fill-[#ff5368] text-[#ff5368]"
            : isOverlay 
              ? "text-white" 
              : "fill-white text-[#000]",
        )}
      />
      <span className={cn(
        "text-sm font-normal tabular-nums",
        isOverlay ? "text-white" : "text-black"
      )}>{data.likes}</span>
    </button>
  );
}
