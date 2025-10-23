"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "@/lib/ky";

// Studio 데이터 fetch
export function useStudios() {
  return useQuery({
    queryKey: ["studios", "public"],
    queryFn: async () => {
      const response = await ky.get("/api/studios/public", {
        searchParams: {
          limit: "50",
          offset: "0",
        },
      }).json<any>();
      return response.studios;
    },
  });
}

// 추천 유저 fetch
export function useSuggestedUsers() {
  return useQuery({
    queryKey: ["users", "suggested"],
    queryFn: async () => {
      try {
        const users = await ky.get("/api/users/suggested").json<any[]>();
        return users;
      } catch (error) {
        // 비로그인 시 빈 배열 반환
        return [];
      }
    },
  });
}

// 모든 유저 fetch - 페이지네이션으로 전체 가져오기
export function useAllUsers() {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      try {
        let allUsers: any[] = [];
        let cursor: string | undefined = undefined;
        let hasMore = true;

        // 모든 유저 페이지네이션으로 가져오기
        while (hasMore && allUsers.length < 100) { // 최대 100명
          const response: { users: any[]; nextCursor: string | null } = await ky.get("/api/users/all", {
            searchParams: cursor ? { cursor } : {},
          }).json();
          
          const users = response.users || [];
          allUsers = [...allUsers, ...users];
          
          cursor = response.nextCursor || undefined;
          hasMore = !!response.nextCursor;
        }

        console.log('[Cosmos] 전체 유저 로드 완료:', allUsers.length, '명');
        return allUsers;
      } catch (error) {
        console.error('[Cosmos] User API 실패:', error);
        return [];
      }
    },
  });
}

// 특정 Studio의 Posts fetch
export function useStudioPosts(studioId: string | null) {
  return useQuery({
    queryKey: ["studio-posts", studioId],
    queryFn: async () => {
      if (!studioId) return [];
      const posts = await ky.get(`/api/studios/${studioId}/posts`).json<any[]>();
      return posts;
    },
    enabled: !!studioId && !studioId.startsWith('user-'),
  });
}

// 특정 User의 Posts fetch
export function useUserPosts(userId: string | null) {
  return useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const posts = await ky.get(`/api/users/${userId}/posts`).json<any>();
      return posts.posts || [];
    },
    enabled: !!userId,
  });
}

// 현재 로그인한 사용자 정보
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const user = await ky.get("/api/users/me").json<any>();
        return user;
      } catch (error) {
        return null;
      }
    },
  });
}

// 특정 Studio의 Items (프로젝트) fetch
export function useStudioItems(studioId: string | null) {
  return useQuery({
    queryKey: ["studio-items", studioId],
    queryFn: async () => {
      if (!studioId) return [];
      const items = await ky.get(`/api/studios/${studioId}/items`).json<any[]>();
      return items;
    },
    enabled: !!studioId,
  });
}

