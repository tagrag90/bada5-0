import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { getUserFriendlyMessage } from "@/lib/error-messages";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
  variant?: "default" | "overlay";
}

export default function BookmarkButton({
  postId,
  initialState,
  variant = "default",
}: BookmarkButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'bookmark'),
      });
    },
  });

  const isOverlay = variant === "overlay";

  return (
    <button 
      onClick={() => mutate()} 
      className={cn(
        "flex items-center gap-2 p-2 rounded-[10px]",
        isOverlay && "text-white hover:bg-white/10"
      )}
    >
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser
            ? "fill-[#ff4b6e] text-[#ff4b6e]"
            : isOverlay
              ? "text-white"
              : "fill-gray-400 text-gray-400",
        )}
      />
    </button>
  );
}
