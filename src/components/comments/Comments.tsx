"use client";

import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  // 컴포넌트가 마운트될 때 댓글을 자동으로 불러옵니다
  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const commentCount = comments.length;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          {commentCount > 0 ? `총 ${commentCount}개의 댓글` : "아직 댓글이 없어요."}
        </div>
      </div>
      <CommentInput post={post} />
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "error" && (
        <p className="text-center text-destructive">
          댓글을 불러오는 중 오류가 발생했습니다.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetching}
          className="w-full text-sm text-muted-foreground hover:text-foreground py-2 rounded-md"
        >
          {isFetching ? "댓글 불러오는 중..." : "이전 댓글 더 보기"}
        </button>
      )}
    </div>
  );
}
