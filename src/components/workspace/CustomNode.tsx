"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Pencil, Download, FileText, ExternalLink } from "lucide-react";
import { nodeTypeIcons, nodeTypeLabels } from "./nodeConfig";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PostData } from "@/lib/types";
import UserAvatar from "@/components/UserAvatar";
import Image from "next/image";
import { getCompressedImageUrl } from "@/lib/utils";

interface CustomNodeData {
  label: string;
  content?: string;
  type: string;
  icon?: string;
  emoji?: string;
  postId?: string;
  onEdit?: (nodeId: string) => void;
  isPlanning?: boolean;
  isConnectedToPlanning?: boolean;
}

export default function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  const Icon = nodeTypeIcons[data.type] || nodeTypeIcons["NOTE"];
  const typeLabel = nodeTypeLabels[data.type] || "";

  // 게시물 노드용 데이터 조회
  const { data: postData, isLoading: isLoadingPost, error: postError } = useQuery<PostData>({
    queryKey: ["post", data.postId],
    queryFn: async () => {
      if (!data.postId) {
        console.log("CustomNode: postId가 없습니다", { nodeId: id, type: data.type, postId: data.postId });
        return null;
      }
      console.log("CustomNode: 게시물 데이터 요청", { postId: data.postId });
      const res = await fetch(`/api/posts/${data.postId}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("CustomNode: 게시물 로드 실패", { postId: data.postId, error });
        throw new Error(error.error || "Failed to fetch post");
      }
      const post = await res.json();
      console.log("CustomNode: 게시물 데이터 로드 성공", { postId: data.postId, hasUser: !!post.user, hasContent: !!post.content });
      return post;
    },
    enabled: data.type === "POST" && !!data.postId,
    retry: 1,
  });

  const isPlanning = data.isPlanning || data.type === "PLANNING";
  const isConnectedToPlanning = data.isConnectedToPlanning || false;
  const handleColor = isPlanning || isConnectedToPlanning ? '#9333ea' : '#000';

  return (
    <div className="custom-node relative group">
      {/* 입력 연결점 - 좌측 (보더 위에 위치) */}
      <Handle 
        type="target" 
        position={Position.Left}
        style={{
          left: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px',
          border: `2px solid ${handleColor}`,
          backgroundColor: '#fff',
          zIndex: 10,
        }}
      />
      <div className="flex flex-col items-start text-left gap-1 w-full">
        <div className="flex items-start justify-between w-full gap-2">
          <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
            {/* 이모티콘 */}
            {data.emoji && (
              <div className="text-base">{data.emoji}</div>
            )}
            {/* 제목 */}
            <div className="font-semibold text-sm text-black break-words w-full">
              {data.label}
            </div>
          </div>
          {/* 편집 버튼 - 우측 상단 (이모티콘/제목과 같은 높이) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit?.(id);
            }}
            className="p-1.5 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex-shrink-0"
            title="노드 편집"
          >
            <Pencil className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>
        
        {/* 드라이브 노드: 파일 목록 */}
        {data.type === "RESOURCE" && data.content && (() => {
          try {
            const parsed = JSON.parse(data.content);
            const files = parsed.files || [];
            if (files.length > 0) {
              return (
                <div className="mt-2 w-full space-y-1">
                  {files.slice(0, 3).map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 text-xs text-gray-700 p-1 hover:bg-gray-50 rounded"
                    >
                      <FileText className="h-3 w-3" />
                      <span className="truncate flex-1">{file.name}</span>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          try {
                            const response = await fetch(file.url);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.name || 'download';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            a.remove();
                          } catch (error) {
                            console.error('다운로드 실패:', error);
                            // 실패 시 기본 방식으로 폴백
                            const a = document.createElement('a');
                            a.href = file.url;
                            a.download = file.name || 'download';
                            a.target = '_blank';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="다운로드"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {files.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      외 {files.length - 3}개 파일
                    </div>
                  )}
                </div>
              );
            }
          } catch {
            // JSON 파싱 실패 시 기본 내용 표시
          }
          return null;
        })()}
        
        {/* 게시물 노드: 게시물 미리보기 */}
        {data.type === "POST" && (
          <div className="mt-2 w-full space-y-2">
            {!data.postId ? (
              <div className="text-xs text-red-500">⚠️ 게시물 ID가 없습니다</div>
            ) : isLoadingPost ? (
              <div className="text-xs text-gray-500">로딩 중...</div>
            ) : postError ? (
              <div className="text-xs text-red-500">
                ❌ 오류: {postError instanceof Error ? postError.message : "게시물을 불러올 수 없습니다"}
              </div>
            ) : postData ? (
              <>
                {/* 유저 정보 */}
                <div className="flex items-center gap-2">
                  <UserAvatar
                    avatarUrl={postData.user?.avatarUrl}
                    userId={postData.user?.id}
                    size={24}
                  />
                  <span className="text-xs font-medium text-black">
                    {postData.user?.displayName || "알 수 없음"}
                  </span>
                </div>

                {/* 게시물 내용 */}
                {postData.content && (
                  <div
                    className="text-xs text-gray-700 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: postData.content.substring(0, 200) + (postData.content.length > 200 ? "..." : ""),
                    }}
                  />
                )}

                {/* 이미지 */}
                {postData.attachments && postData.attachments.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {postData.attachments
                      .filter((att) => att.type === "IMAGE")
                      .slice(0, 2)
                      .map((att) => (
                        <div
                          key={att.id}
                          className="relative aspect-square rounded overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={getCompressedImageUrl(att.url, 75, 150)}
                            alt="Post image"
                            fill
                            className="object-cover"
                            sizes="150px"
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* 게시물 보기 링크 */}
                <Link
                  href={`/posts/${data.postId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>게시물 보기</span>
                </Link>
              </>
            ) : (
              <div className="text-xs text-gray-500">게시물을 불러올 수 없습니다</div>
            )}
          </div>
        )}
        
        {/* 일반 노드: 내용 표시 */}
        {data.type !== "RESOURCE" && data.type !== "POST" && data.content && (
          <div className={`text-xs text-gray-600 mt-1 whitespace-pre-line break-words ${data.type === "NOTE" ? "" : "line-clamp-3"}`}>
            {data.content}
          </div>
        )}
      </div>
      {/* 출력 연결점 - 우측 (보더 위에 위치) */}
      <Handle 
        type="source" 
        position={Position.Right}
        style={{
          right: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '12px',
          height: '12px',
          border: `2px solid ${handleColor}`,
          backgroundColor: '#fff',
          zIndex: 10,
        }}
      />
    </div>
  );
}

