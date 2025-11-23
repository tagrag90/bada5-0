"use client";

import React, { useState, useRef } from "react";
import { Handle, Position, NodeProps, NodeResizer } from "reactflow";
import { Pencil, Download, FileText, ExternalLink, Trash2 } from "lucide-react";
import { nodeTypeIcons, nodeTypeLabels } from "./nodeConfig";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PostData } from "@/lib/types";
import UserAvatar from "@/components/UserAvatar";
import Image from "next/image";
import { getCompressedImageUrl } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface CustomNodeData {
  label: string;
  content?: string;
  type: string;
  icon?: string;
  emoji?: string;
  postId?: string;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  isPlanning?: boolean;
  isConnectedToPlanning?: boolean;
}

export default function CustomNode({ data, id, selected }: NodeProps<CustomNodeData>) {
  const Icon = nodeTypeIcons[data.type] || nodeTypeIcons["NOTE"];
  const typeLabel = nodeTypeLabels[data.type] || "";
  const imageRef = useRef<HTMLImageElement>(null);
  const [hasUpdatedSize, setHasUpdatedSize] = useState(false);

  // PHOTO 노드: 이미지 크기에 맞게 노드 크기 조정
  const handleImageLoad = () => {
    if (data.type === "PHOTO" && imageRef.current && !hasUpdatedSize) {
      const img = imageRef.current;
      
      // 이미지 크기가 유효한지 확인
      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }
      
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // 최소/최대 크기 제한
      const minWidth = 200;
      const maxWidth = 800;
      const minHeight = 200;
      const maxHeight = 800;
      
      // 이미지 원본 크기를 기준으로 비율 유지하며 크기 계산
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      // 너비 제한
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      } else if (width < minWidth) {
        width = minWidth;
        height = width / aspectRatio;
      }
      
      // 높이 제한
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      } else if (height < minHeight) {
        height = minHeight;
        width = height * aspectRatio;
      }
      
      // 노드 크기 업데이트 API 호출 (에러 처리 포함)
      const studioId = window.location.pathname.match(/\/studios\/([^\/]+)/)?.[1];
      if (studioId) {
        fetch(`/api/studios/${studioId}/nodes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ width, height }),
        })
          .then((response) => {
            if (response.ok) {
              setHasUpdatedSize(true);
              // 노드 크기 업데이트 후 React Flow에 반영
              window.dispatchEvent(new Event('resize'));
            }
          })
          .catch((error) => {
            logger.error("Failed to update node size:", error);
          });
      }
    }
  };

  // 게시물 노드용 데이터 조회
  const { data: postData, isLoading: isLoadingPost, error: postError } = useQuery<PostData>({
    queryKey: ["post", data.postId],
    queryFn: async () => {
      if (!data.postId) {
        logger.debug("CustomNode: postId가 없습니다", { nodeId: id, type: data.type, postId: data.postId });
        return null;
      }
      logger.debug("CustomNode: 게시물 데이터 요청", { postId: data.postId });
      const res = await fetch(`/api/posts/${data.postId}`);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Unknown error" }));
        logger.error("CustomNode: 게시물 로드 실패", { postId: data.postId, error });
        throw new Error(error.error || "Failed to fetch post");
      }
      const post = await res.json();
      logger.debug("CustomNode: 게시물 데이터 로드 성공", { postId: data.postId, hasUser: !!post.user, hasContent: !!post.content });
      return post;
    },
    enabled: data.type === "POST" && !!data.postId,
    retry: 1,
  });

  const isPlanning = data.isPlanning || data.type === "PLANNING";
  const isConnectedToPlanning = data.isConnectedToPlanning || false;
  const handleColor = isPlanning || isConnectedToPlanning ? '#9333ea' : '#000';
  const isPhotoNode = data.type === "PHOTO";

  return (
    <div 
      className={`custom-node relative group ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`} 
      style={{ 
        borderRadius: '8px', 
        overflow: 'visible', 
        position: 'relative',
        cursor: selected ? 'move' : 'pointer',
      }}
    >
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
          zIndex: 1000,
        }}
      />
      
      {/* PHOTO 노드: 사진만 표시 */}
      {isPhotoNode && (
        <>
          {/* 리사이즈 핸들 - 선택 시에만 표시 */}
          <NodeResizer
            minWidth={200}
            minHeight={200}
            isVisible={selected}
            handleStyle={{
              width: '10px',
              height: '10px',
              backgroundColor: '#000',
              border: '2px solid #fff',
              borderRadius: '2px',
            }}
          />
          
          {(() => {
            if (!data.content) {
              return (
                <div className="relative w-full h-full min-h-[200px]">
                  <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-lg" style={{ border: '2px solid #000' }}>
                    사진이 없습니다
                  </div>
                  {/* 편집/삭제 버튼 - 항상 표시 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-[100]" style={{ pointerEvents: 'auto' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        data.onEdit?.(id);
                      }}
                      className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                      title="노드 편집"
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (confirm("이 노드를 삭제하시겠습니까?")) {
                          data.onDelete?.(id);
                        }
                      }}
                      className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                      title="노드 삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            }
            
            try {
              const parsed = JSON.parse(data.content);
              const files = parsed.files || [];
              
              if (files.length === 0) {
                return (
                  <div className="relative w-full h-full min-h-[200px]">
                    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-lg" style={{ border: '2px solid #000' }}>
                      사진이 없습니다
                    </div>
                    {/* 편집/삭제 버튼 - 항상 표시 */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-[100]" style={{ pointerEvents: 'auto' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          data.onEdit?.(id);
                        }}
                        className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                        title="노드 편집"
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-800" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (confirm("이 노드를 삭제하시겠습니까?")) {
                            data.onDelete?.(id);
                          }
                        }}
                        className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                        title="노드 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              }
              
              const firstImage = files[0];
              if (!firstImage || !firstImage.url) {
                return (
                  <div className="relative w-full h-full min-h-[200px]">
                    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-lg" style={{ border: '2px solid #000' }}>
                      이미지 URL이 없습니다
                    </div>
                    {/* 편집/삭제 버튼 - 항상 표시 */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-[100]" style={{ pointerEvents: 'auto' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          data.onEdit?.(id);
                        }}
                        className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                        title="노드 편집"
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-800" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (confirm("이 노드를 삭제하시겠습니까?")) {
                            data.onDelete?.(id);
                          }
                        }}
                        className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                        title="노드 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              }
              
              return (
                <div className="relative w-full h-full">
                  {/* 사진이 노드 자체가 됨 - 이미지에 직접 테두리 적용 */}
                  <img
                    ref={imageRef}
                    src={firstImage.url}
                    alt={firstImage.name || "Photo"}
                    onLoad={handleImageLoad}
                    onError={(e) => {
                      logger.error("이미지 로드 실패:", firstImage.url, firstImage);
                      e.currentTarget.style.display = 'none';
                    }}
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '2px solid #000'
                    }}
                  />
                  {/* 편집/삭제 버튼 - 항상 표시 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-[100]" style={{ pointerEvents: 'auto' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        data.onEdit?.(id);
                      }}
                      className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                      title="노드 편집"
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (confirm("이 노드를 삭제하시겠습니까?")) {
                          data.onDelete?.(id);
                        }
                      }}
                      className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                      title="노드 삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            } catch (error) {
              logger.error("PHOTO 노드 content 파싱 실패:", error, data.content);
              return (
                <div className="relative w-full h-full min-h-[200px]">
                  <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100 text-gray-400 text-sm rounded-lg" style={{ border: '2px solid #000' }}>
                    이미지 로드 실패
                  </div>
                  {/* 편집/삭제 버튼 - 항상 표시 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-[100]" style={{ pointerEvents: 'auto' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        data.onEdit?.(id);
                      }}
                      className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                      title="노드 편집"
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (confirm("이 노드를 삭제하시겠습니까?")) {
                          data.onDelete?.(id);
                        }
                      }}
                      className="p-1.5 rounded-md bg-white hover:bg-gray-50 shadow-lg border border-gray-300 transition-all"
                      title="노드 삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            }
          })()}
        </>
      )}

      {/* 일반 노드: 이모티콘, 제목, 내용 표시 */}
      {!isPhotoNode && (
        <div className="flex flex-col items-start text-left gap-1 w-full">
          <div className="flex items-start justify-between w-full gap-2">
            <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
              {/* 이모티콘 */}
              {data.emoji && (
                <div className="text-base">{data.emoji}</div>
              )}
              {/* 제목 */}
              <div className="font-semibold text-sm text-black break-words w-full overflow-hidden">
                {data.label}
              </div>
            </div>
            {/* 편집/삭제 버튼 - 우측 상단 (이모티콘/제목과 같은 높이) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  data.onEdit?.(id);
                }}
                className="p-1.5 rounded hover:bg-gray-100"
                title="노드 편집"
              >
                <Pencil className="h-3.5 w-3.5 text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("이 노드를 삭제하시겠습니까?")) {
                    data.onDelete?.(id);
                  }
                }}
                className="p-1.5 rounded hover:bg-red-50"
                title="노드 삭제"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-600" />
              </button>
            </div>
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
                            logger.error('다운로드 실패:', error);
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
        
        {/* 캘린더 노드: 일정 정보 표시 */}
        {data.type === "SCHEDULE" && data.content && (() => {
          try {
            const scheduleData = JSON.parse(data.content);
            const startDate = scheduleData.startDate ? new Date(scheduleData.startDate) : null;
            const endDate = scheduleData.endDate ? new Date(scheduleData.endDate) : null;
            const eventType = scheduleData.eventType || "SCHEDULE";
            const eventTypeLabels: Record<string, string> = {
              SCHEDULE: "일정",
              EVENT: "행사",
              DEADLINE: "마감기한",
            };

            return (
              <div className="text-xs text-gray-600 mt-1 space-y-1">
                {eventType && (
                  <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {eventTypeLabels[eventType] || eventType}
                  </div>
                )}
                {startDate && (
                  <div className="text-gray-700">
                    <span className="font-medium">시작:</span> {startDate.toLocaleDateString("ko-KR")}
                  </div>
                )}
                {endDate && (
                  <div className="text-gray-700">
                    <span className="font-medium">종료:</span> {endDate.toLocaleDateString("ko-KR")}
                  </div>
                )}
                {scheduleData.description && (
                  <div className="text-gray-600 mt-1 line-clamp-2">
                    {scheduleData.description}
                  </div>
                )}
              </div>
            );
          } catch {
            // JSON 파싱 실패 시 일반 텍스트로 표시
            return (
              <div className="text-xs text-gray-600 mt-1 whitespace-pre-line break-words overflow-hidden line-clamp-3">
                {data.content}
              </div>
            );
          }
        })()}

        {/* 일반 노드: 내용 표시 */}
        {data.type !== "RESOURCE" && data.type !== "POST" && data.type !== "PHOTO" && data.type !== "SCHEDULE" && data.content && (
          (() => {
            // HTML 태그가 포함되어 있으면 HTML로 렌더링, 아니면 일반 텍스트로 렌더링
            const isHTML = /<[a-z][\s\S]*>/i.test(data.content);
            if (isHTML) {
              return (
                <div 
                  className={`text-xs text-gray-600 mt-1 break-words overflow-hidden leading-relaxed ${data.type === "NOTE" ? "" : "line-clamp-3"} [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_p]:empty:min-h-[1rem] [&_p]:empty:before:content-[''] [&_br]:block [&_br]:content-[''] [&_br]:mb-0.5`}
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              );
            } else {
              return (
                <div 
                  className={`text-xs text-gray-600 mt-1 whitespace-pre-line break-words overflow-hidden ${data.type === "NOTE" ? "" : "line-clamp-3"}`}
                >
                  {data.content}
                </div>
              );
            }
          })()
        )}
        </div>
      )}
      
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
          zIndex: 1000,
        }}
      />
    </div>
  );
}
