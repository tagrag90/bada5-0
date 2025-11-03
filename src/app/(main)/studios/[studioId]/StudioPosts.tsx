"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PostData } from "@/lib/types";
import Post from "@/components/posts/Post";
import BlogPostCard from "@/components/posts/BlogPostCard";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

export default function StudioPosts({
  studioId,
  isOwner
}: {
  studioId: string;
  isOwner: boolean;
}) {
  const { data: posts, isLoading } = useQuery<PostData[]>({
    queryKey: ["studio-posts", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <PostsLoadingSkeleton />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl">📝</div>
            <div>
              <h3 className="text-xl font-semibold">아직 포스트가 없습니다</h3>
              <p className="text-muted-foreground mt-2">
                첫 번째 포스트를 작성해보세요
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="rounded-t-[24px] bg-white p-4 drop-shadow">
      {posts
        .filter((post) => post && post.id) // 유효한 post만 필터링
        .map((post) => {
          // post.user가 없으면 렌더링 스킵
          if (!post.user) {
            console.warn(`StudioPosts: Post ${post.id} has no user data`);
            return null;
          }

          const isBlogPost = !!post.title && !!post.studioId;
          
          if (isBlogPost) {
            return <BlogPostCard key={post.id} post={post} />;
          }
          
          return <Post key={post.id} post={post} />;
        })
        .filter(Boolean) // null 제거
      }
    </div>
  );
}

