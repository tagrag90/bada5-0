"use client";

import { PostData } from "@/lib/types";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserPostPreview from "./UserPostPreview";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface UserPostsSliderProps {
  userId: string;
}

interface UserPostsResponse {
  posts: PostData[];
}

export default function UserPostsSlider({ userId }: UserPostsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-posts-preview", userId],
    queryFn: () =>
      kyInstance
        .get(`/api/users/${userId}/posts?limit=3`)
        .json<UserPostsResponse>(),
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });

  const posts = data?.posts || [];

  // 게시물이 없으면 null 반환 (현재 상태 유지)
  if (isLoading || error || posts.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < posts.length - 1;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">
        최근 게시물
      </div>
      
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (320 + 16)}px)`, // w-80 (320px) + 16px gap
            }}
          >
            {posts.map((post) => (
              <UserPostPreview key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* 좌측 화살표 */}
        {/* {canScrollLeft && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="이전 게시물"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )} */}

        {/* 우측 화살표 */}
        {/* {canScrollRight && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="다음 게시물"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )} */}

        {/* 인디케이터 */}
        {posts.length > 1 && (
          <div className="flex justify-center gap-1 mt-4">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary w-6" : "bg-muted w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 