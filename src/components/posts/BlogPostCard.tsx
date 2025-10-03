"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { PostData } from "@/lib/types";

interface BlogPostCardProps {
  post: PostData;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        {/* 썸네일 이미지 (첫 번째 이미지만) */}
        {post.content.includes('<img') && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
            {(() => {
              const imgMatch = post.content.match(/<img[^>]+src="([^"]+)"/);
              if (imgMatch) {
                return (
                  <img
                    src={imgMatch[1]}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* 제목 */}
        {post.title && (
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        )}
        
        {/* 본문 미리보기 (2줄) */}
        <div className="text-muted-foreground line-clamp-2 mb-4">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/<img[^>]*>/g, '') }} />
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
          <span>·</span>
          <span>좋아요 {post._count.likes}</span>
          <span>·</span>
          <span>댓글 {post._count.comments}</span>
        </div>
      </Card>
    </Link>
  );
}


