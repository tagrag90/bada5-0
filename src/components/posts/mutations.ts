import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deletePost } from "./actions";

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      await queryClient.cancelQueries({
        queryKey: ["post-feed"],
        exact: false
      });

      queryClient.setQueriesData<InfiniteData<PostsPage>>(
        {
          queryKey: ["post-feed"],
          exact: false
        },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(page => ({
              ...page,
              posts: page.posts.filter(post => post.id !== deletedPost.id)
            }))
          };
        }
      );

      toast({
        title: "포스트가 삭제되었습니다.",
      });

      if (pathname && pathname.startsWith(`/posts/${deletedPost.id}`)) {
        router.push("/");
      }
    },
    onError: (error) => {
      toast({
        title: "포스트 삭제 중 오류가 발생했습니다.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return mutation;
}
