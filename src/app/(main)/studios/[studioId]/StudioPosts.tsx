"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PostData } from "@/lib/types";
import BlogPostCard from "@/components/posts/BlogPostCard";

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
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 포스트 목록 */}
      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl">📝</div>
            <div>
              <h3 className="text-xl font-semibold">아직 포스트가 없습니다</h3>
              <p className="text-muted-foreground mt-2">
                첫 번째 포스트를 작성해보세요
              </p>
            </div>
            {/* 스튜디오 글쓰기 기능 제거됨 */}
            {/* {isOwner && (
              <Link href={`/studios/${studioId}/write`}>
                <Button size="lg">포스트 작성하기</Button>
              </Link>
            )} */}
          </div>
        </Card>
      )}
    </div>
  );
}

