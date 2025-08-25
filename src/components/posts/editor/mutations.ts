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
    onSuccess: async (newPost) => {
      await queryClient.cancelQueries({
        queryKey: ["post-feed"],
        exact: false
      });

      queryClient.setQueriesData<InfiniteData<PostsPage>>(
        {
          queryKey: ["post-feed"],
          exact: false,
        },
        (oldData) => {
          if (!oldData) return oldData;
          
          const firstPage = oldData.pages[0];
          if (!firstPage) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [newPost, ...firstPage.posts],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["post-feed"],
        exact: false,
        predicate: (query) => {
          if (!user) return false;
          
          const isRelevantQuery = 
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") && 
             query.queryKey.includes(user.id));
          
          return isRelevantQuery && !query.state.data;
        },
      });

      toast({
        description: "게시물이 작성되었습니다.",
      });
    },
    onError(error) {
      console.error(error);
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
      // 개별 게시물 쿼리 업데이트
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      // 피드 쿼리 업데이트
      queryClient.setQueriesData<InfiniteData<PostsPage>>(
        {
          queryKey: ["post-feed"],
          exact: false,
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) => 
                post.id === updatedPost.id ? updatedPost : post
              ),
            })),
          };
        }
      );

      toast({
        description: "게시물이 수정되었습니다.",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'post'),
      });
    },
  });

  return mutation;
}
