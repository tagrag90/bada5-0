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

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
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
        description: "문제가 발생했습니다. 다시 시도해 주세요.",
      });
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className={cn(
        "flex items-center gap-2 rounded-[10px] px-4 py-2",
        data.isLikedByUser
          ? "bg-[#00dd89] text-white"
          : "bg-gray-100 text-gray-900",
      )}
    >
      <Zap
        className={cn(
          "size-5",
          data.isLikedByUser
            ? "fill-white text-white"
            : "fill-[#00dd89] text-[#00dd89]",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} {data.likes === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
