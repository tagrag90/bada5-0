"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { PostData } from "@/lib/types";
import Image from "next/image";
import StudioBadge from "../StudioBadge";

interface BlogPostCardProps {
  post: PostData;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="p-6 border-0">
      {/* 스튜디오 정보 */}
      {post.studio && (
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/studios/${post.studio.id}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
              <Image
                src={post.studio.avatarUrl || "/logo-bada.png"}
                alt={post.studio.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/studios/${post.studio.id}`}
              className="font-semibold hover:underline truncate"
            >
              {post.studio.name}
            </Link>
            <StudioBadge size="sm" />
          </div>
        </div>
      )}

      {/* 포스트 내용 */}
      <Link href={`/posts/${post.id}`} className="block">
        {/* 썸네일 이미지 (첫 번째 이미지만) */}
        {post.content.includes('<img') && (
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4">
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
      </Link>
    </Card>
  );
}
