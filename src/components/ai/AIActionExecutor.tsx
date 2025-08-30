"use client";

import { useSubmitPostMutation } from "@/components/posts/editor/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/(main)/SessionProvider";

export function useAIActionExecutor(onActionComplete: (result: any) => void) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useSession();
  
  // 게시물 작성 mutation 재사용
  const submitPostMutation = useSubmitPostMutation();
  
    // 팔로우/언팔로우 mutation
  const followMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: 'follow' | 'unfollow' }) =>
      action === 'follow' 
        ? kyInstance.post(`/api/users/${userId}/followers`)
        : kyInstance.delete(`/api/users/${userId}/followers`),
    onSuccess: (data, variables) => {
      toast({
        description: variables.action === 'follow' ? '팔로우했습니다.' : '언팔로우했습니다.'
      });
      onActionComplete({ action: variables.action, success: true });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: "팔로우 작업 중 오류가 발생했습니다."
      });
      onActionComplete({ action: 'follow', success: false, error });
    }
  });

  // AI 액션 실행 함수들
  const executeAction = {
    // 게시물 작성
    createPost: async (content: string, mediaIds: string[] = []) => {
      try {
        const result = await submitPostMutation.mutateAsync({
          content,
          mediaIds
        });
        onActionComplete({ 
          action: 'createPost', 
          result, 
          success: true,
          message: '게시물이 성공적으로 작성되었습니다!' 
        });
        return result;
      } catch (error) {
        onActionComplete({ 
          action: 'createPost', 
          error, 
          success: false,
          message: '게시물 작성 중 오류가 발생했습니다.' 
        });
        throw error;
      }
    },
    
    // 팔로우/언팔로우
    followUser: async (userId: string) => {
      return followMutation.mutateAsync({ userId, action: 'follow' });
    },
    
    unfollowUser: async (userId: string) => {
      return followMutation.mutateAsync({ userId, action: 'unfollow' });
    },
    
    // 사용자 검색
    searchUsers: async (query: string) => {
      try {
        const response = await kyInstance.get('/api/search', {
          searchParams: { q: query }
        }).json();
        
        // 검색 페이지로 이동
        router.push(`/search?q=${encodeURIComponent(query)}`);
        
        onActionComplete({ 
          action: 'searchUsers', 
          result: response, 
          success: true,
          message: `"${query}" 검색 결과 페이지로 이동합니다.`
        });
        return response;
      } catch (error) {
        onActionComplete({ 
          action: 'searchUsers', 
          error, 
          success: false,
          message: '검색 중 오류가 발생했습니다.' 
        });
        throw error;
      }
    },

    // 트렌딩 조회
    getTrending: async () => {
      try {
        // 탐색 페이지로 이동
        router.push('/explore');
        
        onActionComplete({ 
          action: 'getTrending', 
          success: true,
          message: '트렌딩 콘텐츠 페이지로 이동합니다.'
        });
      } catch (error) {
        onActionComplete({ 
          action: 'getTrending', 
          error, 
          success: false,
          message: '트렌딩 페이지 이동 중 오류가 발생했습니다.' 
        });
      }
    },

    // 프로필 이동
    goToProfile: async () => {
      try {
        if (!user) {
          onActionComplete({ 
            action: 'goToProfile', 
            success: false,
            message: '로그인이 필요합니다.'
          });
          return;
        }

        // 현재 사용자의 프로필 페이지로 이동
        router.push(`/users/${user.username}`);
        
        onActionComplete({ 
          action: 'goToProfile', 
          success: true,
          message: `${user.displayName}님의 프로필 페이지로 이동합니다.`
        });
      } catch (error) {
        onActionComplete({ 
          action: 'goToProfile', 
          error, 
          success: false,
          message: '프로필 페이지 이동 중 오류가 발생했습니다.' 
        });
      }
    },

    // 홈 이동
    goToHome: async () => {
      try {
        router.push('/');
        
        onActionComplete({ 
          action: 'goToHome', 
          success: true,
          message: '홈 페이지로 이동합니다.'
        });
      } catch (error) {
        onActionComplete({ 
          action: 'goToHome', 
          error, 
          success: false,
          message: '홈 페이지 이동 중 오류가 발생했습니다.' 
        });
      }
    },

    // 좋아요 (최근 게시물에)
    likePost: async () => {
      try {
        // 실제로는 현재 보고 있는 게시물이나 최근 게시물의 ID가 필요
        // 현재는 시연용으로 메시지만 표시
        onActionComplete({ 
          action: 'likePost', 
          success: true,
          message: '죄송합니다. 현재 특정 게시물을 지정하는 기능이 필요합니다. 게시물 페이지에서 좋아요 버튼을 직접 클릭해주세요.'
        });
      } catch (error) {
        onActionComplete({ 
          action: 'likePost', 
          error, 
          success: false,
          message: '좋아요 처리 중 오류가 발생했습니다.' 
        });
      }
    },

    // 북마크 (최근 게시물에)
    bookmarkPost: async () => {
      try {
        // 실제로는 현재 보고 있는 게시물이나 최근 게시물의 ID가 필요
        // 현재는 시연용으로 메시지만 표시
        onActionComplete({ 
          action: 'bookmarkPost', 
          success: true,
          message: '죄송합니다. 현재 특정 게시물을 지정하는 기능이 필요합니다. 게시물 페이지에서 북마크 버튼을 직접 클릭해주세요.'
        });
      } catch (error) {
        onActionComplete({ 
          action: 'bookmarkPost', 
          error, 
          success: false,
          message: '북마크 처리 중 오류가 발생했습니다.' 
        });
      }
    },

    // 알림 조회
    viewNotifications: async () => {
      try {
        router.push('/notifications');
        
        onActionComplete({ 
          action: 'viewNotifications', 
          success: true,
          message: '알림 페이지로 이동합니다.'
        });
      } catch (error) {
        onActionComplete({ 
          action: 'viewNotifications', 
          error, 
          success: false,
          message: '알림 페이지 이동 중 오류가 발생했습니다.' 
        });
      }
    }
  };

  return { executeAction };
}
