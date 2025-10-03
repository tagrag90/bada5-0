"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import PostEditor from "@/components/posts/editor/PostEditor";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudioWriteContent({ studioId }: { studioId: string }) {
  const router = useRouter();

  const { data: studio, isLoading } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) throw new Error("Failed to fetch studio");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">스튜디오를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* 돌아가기 버튼 (왼쪽 상단) */}
      <div className="absolute top-6 left-6 z-50">
        <Link href={`/studios/${studioId}`}>
          <Button variant="ghost" size="sm" className="rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </Link>
      </div>

      {/* 에디터 영역 */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        <PostEditor 
          onSuccess={() => router.push(`/studios/${studioId}`)} 
          studioId={studioId}
          studio={studio}
        />
      </div>
    </div>
  );
}

