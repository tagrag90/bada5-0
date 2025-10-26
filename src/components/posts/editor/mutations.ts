import { useSession, useOptionalUser } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { getUserFriendlyMessage } from "@/lib/error-messages";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  Query,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost, updatePost } from "./actions";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = useOptionalUser();

  const mutation = useMutation({
    mutationFn: submitPost,
    onMutate: (variables) => {
      console.log("🔍 mutation 호출됨 - 입력값:", variables);
    },
    onSuccess: async (newPost) => {
      // 간단한 객체 반환으로 인한 캐시 업데이트 방식 변경
      // 복잡한 setQueriesData 대신 invalidateQueries 사용
      await queryClient.invalidateQueries({
        queryKey: ["post-feed"],
        exact: false,
      });

      // 스튜디오 포스트면 스튜디오 포스트 쿼리도 무효화
      if (newPost.studioId) {
        queryClient.invalidateQueries({
          queryKey: ["studio-posts", newPost.studioId],
        });
      }

      toast({
        description: "게시물이 작성되었습니다.",
      });
    },
    onError(error) {
      console.log("❌ useSubmitPostMutation 에러 발생:", error);
      console.error("❌ 상세 에러:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'post'),
      });
    },
  });

  return mutation;
}

export function useUpdatePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: async (updatedPost) => {
      // 간단한 객체 반환으로 인한 캐시 업데이트 방식 변경
      // 복잡한 setQueryData 대신 invalidateQueries 사용
      await queryClient.invalidateQueries({
        queryKey: ["post", updatedPost.id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["post-feed"],
        exact: false,
      });

      toast({
        description: "게시물이 수정되었습니다.",
      });
    },
    onError(error) {
      console.log("❌ useSubmitPostMutation 에러 발생:", error);
      console.error("❌ 상세 에러:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'post'),
      });
    },
  });

  return mutation;
}
