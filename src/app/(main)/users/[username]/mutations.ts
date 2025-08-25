import { useToast } from "@/components/ui/use-toast";
import { getUserFriendlyMessage } from "@/lib/error-messages";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { updateUserProfile } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams<{ username: string }>();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: Partial<UpdateUserProfileValues>;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilter = {
        queryKey: ["post-feed"],
        exact: true
      };

      await queryClient.cancelQueries({ queryKey: ["post-feed"] });

      queryClient.setQueriesData<InfiniteData<PostsPage>>(
        { queryKey: ["post-feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      if (params.username && updatedUser.username !== params.username) {
        router.push(`/users/${updatedUser.username}`);
        toast({
          description: `Username 변경 완료: @${updatedUser.username}. 페이지를 이동합니다.`,
        });
      } else {
        router.refresh();
        toast({
          description: "프로필이 업데이트되었습니다.",
        });
      }
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: getUserFriendlyMessage(error.message, 'user'),
      });
    },
  });

  return mutation;
}
