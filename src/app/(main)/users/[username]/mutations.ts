import { useToast } from "@/components/ui/use-toast";
import { getUserFriendlyMessage } from "@/lib/error-messages";
import { PostsPage } from "@/lib/types";
// UploadThing 제거 - Vercel Blob 사용
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

  // Vercel Blob 아바타 업로드 함수
  const uploadAvatarToBlob = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: Partial<UpdateUserProfileValues>;
      avatar?: File;
    }) => {
      console.log('🔍 mutationFn 호출:', { hasAvatar: !!avatar, values });

      // 아바타가 있으면 먼저 업로드하고 URL을 포함해서 프로필 업데이트
      if (avatar) {
        console.log('📤 아바타 업로드 시작');
        const uploadResult = await uploadAvatarToBlob(avatar);
        console.log('📥 아바타 업로드 완료:', uploadResult.url);

        return updateUserProfile({
          ...values,
          avatarUrl: uploadResult.url,
        });
      }

      // 아바타가 없으면 그냥 프로필 업데이트
      console.log('📝 아바타 없이 프로필 업데이트');
      return updateUserProfile(values);
    },
    onSuccess: async (updatedUser) => {
      // Server component 캐시를 위해 페이지 새로고침
      router.refresh();

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
