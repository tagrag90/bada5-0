"use client";

import { PostData } from "@/lib/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search } from "lucide-react";
import { FigmaProgressBar } from "@/components/ui/figma-progress-bar";
import { useState } from "react";
import Link from "next/link";

interface AddToNodeDialogProps {
  post?: PostData; // 선택적 - 기존 게시물 선택 시 사용
  open: boolean;
  onClose: () => void;
  studioId?: string; // 특정 스튜디오에 추가할 경우
}

export default function AddToNodeDialog({ post, open, onClose, studioId }: AddToNodeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<PostData | null>(post || null);

  // 게시물 검색
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search-posts", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { posts: [] };
      
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Failed to search posts");
      return res.json();
    },
    enabled: !!searchQuery.trim(),
  });

  // 스튜디오 목록 가져오기 (studioId가 없을 때)
  const { data: studios, isLoading: isLoadingStudios } = useQuery({
    queryKey: ["studios"],
    queryFn: async () => {
      const res = await fetch("/api/studios");
      if (!res.ok) throw new Error("Failed to fetch studios");
      return res.json();
    },
    enabled: !studioId && open,
  });

  // 노드 생성 뮤테이션
  const createNodeMutation = useMutation({
    mutationFn: async (targetStudioId: string) => {
      if (!selectedPost) {
        throw new Error("게시물을 선택해주세요.");
      }

      const res = await fetch(`/api/studios/${targetStudioId}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "POST",
          title: selectedPost.title || `게시물: ${selectedPost.user.displayName}`,
          content: JSON.stringify({
            postId: selectedPost.id,
            studioId: selectedPost.studio?.id || null,
          }),
          x: 250,
          y: 250,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create node");
      }

      return res.json();
    },
    onSuccess: (_, targetStudioId) => {
      queryClient.invalidateQueries({ queryKey: ["studio-nodes", targetStudioId] });
      toast({
        title: "노드 추가 완료",
        description: "게시물이 워크스페이스에 노드로 추가되었습니다.",
      });
      onClose();
      setSelectedPost(null);
      setSearchQuery("");
    },
    onError: (error: Error) => {
      toast({
        title: "노드 추가 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const posts = searchResults?.posts || [];

  return (
    <>
      {/* 노드 생성 중 프로그레스 바 */}
      {createNodeMutation.isPending && <FigmaProgressBar variant="top" />}
      
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>게시물 노드 추가</DialogTitle>
          <DialogDescription>
            추가할 게시물을 검색하고 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 게시물 검색 */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="게시물 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 검색 결과 */}
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : searchQuery.trim() && posts.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2">
                {posts.map((p: PostData) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPost(p)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedPost?.id === p.id
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="font-medium text-sm">{p.user.displayName}</div>
                    <div className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {p.content?.substring(0, 100)}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() && posts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                검색 결과가 없습니다.
              </p>
            ) : null}
          </div>

          {/* 선택된 게시물 */}
          {selectedPost && (
            <div className="p-3 bg-gray-50 rounded border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{selectedPost.user.displayName}</div>
                  <div className="text-xs text-gray-600 line-clamp-2 mt-1">
                    {selectedPost.content?.substring(0, 100)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPost(null)}
                >
                  선택 해제
                </Button>
              </div>
            </div>
          )}

          {/* 스튜디오 선택 (studioId가 없을 때) */}
          {selectedPost && !studioId && (
            <div className="space-y-2">
              <div className="text-sm font-medium">스튜디오 선택</div>
              {isLoadingStudios ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {studios && studios.length > 0 ? (
                    studios.map((studio: any) => (
                      <Button
                        key={studio.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => createNodeMutation.mutate(studio.id)}
                        disabled={createNodeMutation.isPending}
                      >
                        {studio.name}
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      참여한 스튜디오가 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* studioId가 있을 때는 바로 추가 */}
          {selectedPost && studioId && (
            <Button
              className="w-full"
              onClick={() => createNodeMutation.mutate(studioId)}
              disabled={createNodeMutation.isPending}
            >
              {createNodeMutation.isPending ? "추가 중..." : "노드 추가"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

