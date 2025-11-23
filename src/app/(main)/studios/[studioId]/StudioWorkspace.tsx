"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FigmaProgressBar } from "@/components/ui/figma-progress-bar";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { useToast } from "@/components/ui/use-toast";
import CustomNode from "@/components/workspace/CustomNode";
import { nodeTypeLabels, nodeTypeIcons } from "@/components/workspace/nodeConfig";
import AddToNodeDialog from "@/components/posts/AddToNodeDialog";
import NodeCreationToast from "@/components/workspace/NodeCreationToast";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useOptionalUser } from "@/app/(main)/SessionProvider";
import { useWorkspaceClipboard } from "@/hooks/useWorkspaceClipboard";
import ModeToggleButton from "@/components/workspace/ModeToggleButton";
import html2canvas from "html2canvas";

interface StudioWorkspaceProps {
  studioId: string;
  fileId?: string; // 파일 ID (선택적, 없으면 기존처럼 전체 노드 표시)
}

function WorkspaceContent({ studioId, fileId }: StudioWorkspaceProps) {
  const { toast } = useToast();
  const { discordData, setNodeEditData } = useSidebar();
  const currentUser = useOptionalUser();
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]); // 다중 선택용
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [interactionMode, setInteractionMode] = useState<"drag" | "select">("drag"); // 드래그/선택 모드
  const thumbnailGenerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);
  
  // 클립보드 훅
  const { copy, paste, cut, clipboardData, loadFromStorage } = useWorkspaceClipboard(studioId);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 클립보드 로드
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
  const [workspaceStyle, setWorkspaceStyle] = useState<React.CSSProperties>({
    zIndex: 1,
    width: "100%",
    left: "0px",
    backgroundColor: "#E5E5E5",
  });
  

  // 스튜디오 정보 조회
  const { data: studio } = useQuery({
    queryKey: ["studio", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}`);
      if (!res.ok) throw new Error("Failed to fetch studio");
      return res.json();
    },
  });

  // 멤버십 상태 확인
  const { data: membershipStatus } = useQuery({
    queryKey: ["studio-membership", studioId],
    queryFn: async () => {
      if (!studioId || !currentUser) return null;
      const res = await fetch(`/api/studios/${studioId}/subscription-status`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!studioId && !!currentUser,
  });

  // 소유자 및 관리자 확인
  const isOwner = membershipStatus?.isOwner === true || (currentUser && studio && studio.ownerId === currentUser.id);
  const isAdmin = isOwner || membershipStatus?.memberRole === "ADMIN";
  
  // 모바일 네비바가 화이트보드에 덮이지 않도록 확인
  useEffect(() => {
    // 모바일에서만 확인 (스튜디오 워크스페이스 페이지)
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // 화이트보드 z-index를 네비바(z-50 정도)보다 낮게 유지
        setWorkspaceStyle(prev => ({
          ...prev,
          zIndex: 1, // 네비바는 z-50 이상이므로 충돌 없음
        }));
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 기본 노드 타입 정의 (hooks 순서 유지를 위해 상단에 위치)
  const nodeTypes: NodeTypes = React.useMemo(() => ({
    custom: CustomNode,
  }), []);

  // 가짜 진행률 상태
  const [fakeProgress, setFakeProgress] = useState(0);
  // 노드 생성 진행률 상태
  const [nodeCreationProgress, setNodeCreationProgress] = useState(0);

  // 노드 및 연결선 조회 (fileId가 있으면 필터링)
  const { data: nodesData, isLoading: isLoadingNodes } = useQuery({
    queryKey: ["studio-nodes", studioId, fileId],
    queryFn: async () => {
      const url = fileId
        ? `/api/studios/${studioId}/nodes?fileId=${fileId}`
        : `/api/studios/${studioId}/nodes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch nodes");
      return res.json();
    },
  });

  const { data: edgesData, isLoading: isLoadingEdges } = useQuery({
    queryKey: ["studio-edges", studioId, fileId],
    queryFn: async () => {
      const url = fileId
        ? `/api/studios/${studioId}/edges?fileId=${fileId}`
        : `/api/studios/${studioId}/edges`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch edges");
      return res.json();
    },
  });

  // 파일 정보 조회 (썸네일 확인용)
  const { data: fileInfo } = useQuery({
    queryKey: ["workspace-file", studioId, fileId],
    queryFn: async () => {
      if (!fileId) return null;
      const res = await fetch(`/api/studios/${studioId}/files/${fileId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!fileId,
  });

  // 썸네일 자동 생성 함수
  const generateThumbnail = useCallback(async () => {
    console.log('[썸네일 생성] 시작', { fileId, hasReactFlowInstance: !!reactFlowInstance, hasWrapper: !!reactFlowWrapperRef.current });
    
    if (!fileId || !reactFlowInstance || !reactFlowWrapperRef.current) {
      console.log('[썸네일 생성] 조건 불만족으로 중단');
      return;
    }

    try {
      // React Flow의 모든 노드 가져오기
      const currentNodes = reactFlowInstance.getNodes();
      console.log('[썸네일 생성] 현재 노드 개수:', currentNodes.length);
      
      if (!currentNodes || currentNodes.length === 0) {
        console.log('[썸네일 생성] 노드가 없어서 중단');
        return; // 노드가 없으면 썸네일 생성 안 함
      }

      // 노드들의 경계 상자 계산 (수동으로 계산)
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      currentNodes.forEach((node: Node) => {
        const nodeWidth = node.width || 200;
        const nodeHeight = node.height || 100;
        const x = node.position.x;
        const y = node.position.y;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + nodeWidth);
        maxY = Math.max(maxY, y + nodeHeight);
      });

      const nodesBounds = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };

      console.log('[썸네일 생성] 노드 영역:', nodesBounds);
      
      if (nodesBounds.width === 0 || nodesBounds.height === 0) {
        console.log('[썸네일 생성] 노드 영역이 유효하지 않아서 중단');
        return;
      }

      // 현재 뷰포트 저장
      const currentViewport = reactFlowInstance.getViewport();

      // React Flow 뷰포트 요소 찾기 (여러 가능한 선택자 시도)
      let reactFlowElement = reactFlowWrapperRef.current.querySelector('.react-flow__viewport') as HTMLElement;
      
      // .react-flow__viewport를 찾지 못하면 .react-flow를 사용
      if (!reactFlowElement) {
        reactFlowElement = reactFlowWrapperRef.current.querySelector('.react-flow') as HTMLElement;
      }
      
      // 여전히 찾지 못하면 wrapper 자체를 사용
      if (!reactFlowElement) {
        reactFlowElement = reactFlowWrapperRef.current;
      }
      
      console.log('[썸네일 생성] React Flow 요소:', reactFlowElement ? `찾음 (${reactFlowElement.className})` : '찾지 못함');
      console.log('[썸네일 생성] Wrapper 내부 요소들:', reactFlowWrapperRef.current.querySelectorAll('*').length, '개');
      
      if (!reactFlowElement) {
        console.log('[썸네일 생성] React Flow 요소를 찾지 못해서 중단');
        return;
      }

      // 노드 영역에 맞춰 뷰포트 설정
      const padding = 50;
      const targetZoom = Math.min(
        1,
        (800 - padding * 2) / nodesBounds.width,
        (600 - padding * 2) / nodesBounds.height
      );

      const viewport = {
        x: -(nodesBounds.x - padding) * targetZoom,
        y: -(nodesBounds.y - padding) * targetZoom,
        zoom: targetZoom,
      };

      // 임시로 뷰포트 변경
      reactFlowInstance.setViewport(viewport);

      // 뷰포트 변경 후 렌더링 대기
      await new Promise(resolve => setTimeout(resolve, 500));

      // 캔버스 캡처 (노드 영역만)
      console.log('[썸네일 생성] html2canvas 시작');
      const canvas = await html2canvas(reactFlowElement, {
        backgroundColor: '#E5E5E5',
        useCORS: true,
        scale: 0.5, // 썸네일 크기 최적화
        logging: false,
        width: nodesBounds.width + padding * 2,
        height: nodesBounds.height + padding * 2,
      });
      console.log('[썸네일 생성] html2canvas 완료', { width: canvas.width, height: canvas.height });

      // 원래 뷰포트로 복원
      reactFlowInstance.setViewport(currentViewport);

      // Canvas를 Blob으로 변환하고 업로드
      await new Promise<void>((resolve, reject) => {
        console.log('[썸네일 생성] Blob 변환 시작');
        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error('[썸네일 생성] Blob 생성 실패');
            reject(new Error('Blob 생성 실패'));
            return;
          }

          console.log('[썸네일 생성] Blob 생성 완료', { size: blob.size });

          try {
            // 이미지 업로드
            console.log('[썸네일 생성] 업로드 시작');
            const formData = new FormData();
            formData.append('file', blob, 'thumbnail.png');
            formData.append('type', 'media');

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!uploadRes.ok) {
              const error = await uploadRes.json();
              console.error('[썸네일 생성] 업로드 실패', error);
              throw new Error(error.message || error.error || '업로드 실패');
            }

            const uploadResult = await uploadRes.json();
            console.log('[썸네일 생성] 업로드 완료', { url: uploadResult.url });

            // 파일 썸네일 업데이트
            console.log('[썸네일 생성] 파일 업데이트 시작');
            const updateRes = await fetch(`/api/studios/${studioId}/files/${fileId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ thumbnailUrl: uploadResult.url }),
            });

            if (!updateRes.ok) {
              const error = await updateRes.json();
              console.error('[썸네일 생성] 파일 업데이트 실패', error);
              throw new Error(error.error || '파일 업데이트 실패');
            }

            const updatedFile = await updateRes.json();
            console.log('[썸네일 생성] 파일 업데이트 완료', { thumbnailUrl: updatedFile.thumbnailUrl });

            // 파일 목록 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['workspace-files', studioId] });
            console.log('[썸네일 생성] 쿼리 무효화 완료');

            // 썸네일 생성 완료 후 iframe 닫기 (부모 창이 있으면)
            if (window.parent !== window) {
              // iframe 내부에서 실행 중이면 부모에게 완료 신호 전송
              window.parent.postMessage({ type: 'thumbnailGenerated', fileId }, '*');
              console.log('[썸네일 생성] postMessage 전송 완료');
            }

            console.log('[썸네일 생성] 전체 프로세스 완료');
            resolve();
          } catch (error) {
            console.error('[썸네일 생성] 에러 발생:', error);
            reject(error);
          }
        }, 'image/png', 0.8);
      });
    } catch (error) {
      console.error('[썸네일 생성] 전체 프로세스 실패:', error);
    }
  }, [fileId, reactFlowInstance, studioId, queryClient]);

  // URL 파라미터에서 썸네일 생성 요청 확인
  const [shouldGenerateThumbnail, setShouldGenerateThumbnail] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shouldGenerate = params.get('generateThumbnail') === 'true';
      console.log('[썸네일 스케줄] URL 파라미터 확인:', { generateThumbnail: params.get('generateThumbnail'), shouldGenerate });
      setShouldGenerateThumbnail(shouldGenerate);
    }
  }, []);

  // 파일 로드 시 썸네일이 없고 노드가 있으면 자동 생성
  useEffect(() => {
    console.log('[썸네일 스케줄] useEffect 조건 확인:', {
      fileId: !!fileId,
      fileInfo: !!fileInfo,
      hasThumbnail: fileInfo?.thumbnailUrl,
      nodesDataLength: nodesData?.length,
      reactFlowInstance: !!reactFlowInstance,
      reactFlowWrapperRef: !!reactFlowWrapperRef.current,
      isLoadingNodes,
      isLoadingEdges,
      shouldGenerateThumbnail,
    });

    if (
      fileId &&
      fileInfo &&
      !fileInfo.thumbnailUrl &&
      nodesData &&
      nodesData.length > 0 &&
      reactFlowInstance &&
      reactFlowWrapperRef.current &&
      !isLoadingNodes &&
      !isLoadingEdges &&
      shouldGenerateThumbnail // URL 파라미터가 있을 때만 생성
    ) {
      console.log('[썸네일 스케줄] 모든 조건 만족, 3초 후 썸네일 생성 시작');
      // 약간의 지연 후 썸네일 생성 (렌더링 완료 대기)
      const timer = setTimeout(() => {
        console.log('[썸네일 스케줄] 타이머 완료, generateThumbnail 호출');
        generateThumbnail().catch((error) => {
          console.error('[썸네일 스케줄] 썸네일 생성 실패:', error);
        });
      }, 3000); // 렌더링 완료를 위해 3초 대기

      return () => {
        console.log('[썸네일 스케줄] 타이머 취소');
        clearTimeout(timer);
      };
    } else {
      console.log('[썸네일 스케줄] 조건 불만족으로 썸네일 생성 안 함');
    }
  }, [fileId, fileInfo, nodesData, reactFlowInstance, isLoadingNodes, isLoadingEdges, shouldGenerateThumbnail, generateThumbnail]);

  // 가짜 진행률 시뮬레이션
  useEffect(() => {
    if (isLoadingNodes || isLoadingEdges) {
      setFakeProgress(0);
      
      // 불규칙한 진행률 시뮬레이션 (80%까지)
      const intervals: NodeJS.Timeout[] = [];
      let currentProgress = 0;
      
      // 초기 빠른 진행 (0-30%)
      const interval1 = setInterval(() => {
        const increment = Math.random() * 8 + 2; // 2-10%씩 증가
        currentProgress = Math.min(currentProgress + increment, 30);
        setFakeProgress(currentProgress);
        if (currentProgress >= 30) {
          clearInterval(interval1);
        }
      }, 100);
      intervals.push(interval1);
      
      // 중간 느린 진행 (30-60%)
      setTimeout(() => {
        const interval2 = setInterval(() => {
          const increment = Math.random() * 4 + 1; // 1-5%씩 증가
          currentProgress = Math.min(currentProgress + increment, 60);
          setFakeProgress(currentProgress);
          if (currentProgress >= 60) {
            clearInterval(interval2);
          }
        }, 150);
        intervals.push(interval2);
      }, 300);
      
      // 느린 진행 (60-80%)
      setTimeout(() => {
        const interval3 = setInterval(() => {
          const increment = Math.random() * 2 + 0.5; // 0.5-2.5%씩 증가
          currentProgress = Math.min(currentProgress + increment, 80);
          setFakeProgress(currentProgress);
          if (currentProgress >= 80) {
            clearInterval(interval3);
            setFakeProgress(80);
          }
        }, 200);
        intervals.push(interval3);
      }, 800);
      
      return () => {
        intervals.forEach(interval => clearInterval(interval));
      };
    } else {
      // 로딩 완료 시 부드럽게 100%로 이동 후 숨김
      // CSS transition으로 부드럽게 처리하기 위해 즉시 100%로 설정
      if (fakeProgress < 100) {
        setFakeProgress(100);
        // 100% 도달 후 300ms 뒤 숨김 (transition이 완료된 후)
        const timer = setTimeout(() => {
          setFakeProgress(0);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoadingNodes, isLoadingEdges]);

  // 사이드바 닫기 핸들러
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setNodeEditData(null);
  }, [setNodeEditData]);

  // 썸네일 생성 스케줄링 (debounce)
  const scheduleThumbnailGeneration = useCallback(() => {
    if (!fileId) {
      console.log('[썸네일 스케줄] fileId 없어서 중단');
      return;
    }

    console.log('[썸네일 스케줄] 스케줄링 시작');

    // 기존 타이머 취소
    if (thumbnailGenerationTimeoutRef.current) {
      clearTimeout(thumbnailGenerationTimeoutRef.current);
    }

    // 3초 후 썸네일 생성 (여러 변경사항을 한 번에 처리)
    thumbnailGenerationTimeoutRef.current = setTimeout(() => {
      console.log('[썸네일 스케줄] 타이머 완료, generateThumbnail 호출');
      generateThumbnail();
    }, 3000);
  }, [fileId, generateThumbnail]);

  // 노드 저장 핸들러
  const handleNodeSave = useCallback(
    async (nodeId: string, title: string, content?: string, emoji?: string) => {
      try {
        const requestBody = { 
          title, 
          content: content || null,
          emoji: emoji && emoji.trim() ? emoji.trim() : null,
        };
        
        console.log("Saving node:", { nodeId, requestBody });

        const res = await fetch(`/api/studios/${studioId}/nodes/${nodeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          console.error("Failed to update node:", { status: res.status, errorData });
          throw new Error(errorData.error || `Failed to update node (${res.status})`);
        }

        const updatedNode = await res.json();
        console.log("Node updated successfully:", updatedNode);

        queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
        
        // 썸네일 자동 생성 스케줄링
        scheduleThumbnailGeneration();
        
        toast({
          title: "노드 업데이트 완료",
          description: "노드가 성공적으로 업데이트되었습니다.",
        });
      } catch (error: any) {
        console.error("Error in handleNodeSave:", error);
        toast({
          title: "노드 업데이트 실패",
          description: error.message || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [studioId, fileId, queryClient, toast, scheduleThumbnailGeneration]
  );

  // 노드 삭제 핸들러 (Optimistic Update 적용)
  const handleNodeDelete = useCallback(
    async (nodeId: string) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["studio-nodes", studioId, fileId] });
      
      // 이전 데이터 백업
      const previousNodes = queryClient.getQueryData(["studio-nodes", studioId, fileId]);
      
      // Optimistic Update: 즉시 노드 제거
      queryClient.setQueryData(["studio-nodes", studioId, fileId], (old: any) => {
        return old ? old.filter((node: any) => node.id !== nodeId) : [];
      });
      
      // 선택 상태 초기화
      setSelectedNodeId(null);
      setSelectedNodeIds([]);
      setSidebarOpen(false);
      setNodeEditData(null);
      
      try {
        const res = await fetch(`/api/studios/${studioId}/nodes/${nodeId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete node");

        // 성공 시 쿼리 무효화 (서버 동기화)
        queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId, fileId] });
        
        // 썸네일 자동 생성 스케줄링
        scheduleThumbnailGeneration();
        
        toast({
          title: "노드 삭제 완료",
          description: "노드가 삭제되었습니다.",
        });
      } catch (error: any) {
        // 에러 시 롤백
        if (previousNodes) {
          queryClient.setQueryData(["studio-nodes", studioId, fileId], previousNodes);
        }
        toast({
          title: "노드 삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [studioId, fileId, queryClient, toast, setNodeEditData]
  );

  // 노드 편집 핸들러
  const handleNodeEdit = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeIds([nodeId]);
    setSidebarOpen(true);
    
    // 노드 데이터를 사이드바 컨텍스트로 전달
    if (nodesData) {
      const node = nodesData.find((n: any) => n.id === nodeId);
      if (node) {
        setNodeEditData({
          nodeId: node.id,
          initialTitle: node.title || "",
          initialContent: node.content || "",
          initialEmoji: node.emoji || "",
          nodeType: node.type || "NOTE",
          onSave: handleNodeSave,
          onDelete: handleNodeDelete,
          onClose: handleSidebarClose,
        });
      }
    }
  }, [nodesData, handleNodeSave, handleNodeDelete, handleSidebarClose, setNodeEditData]);

  // ReactFlow를 위한 노드/연결선 변환
  const initialNodes: Node[] = nodesData?.map((node: any) => {
    // POST 타입일 때 content에서 postId 추출
    let postId: string | undefined;
    if (node.type === "POST" && node.content) {
      try {
        const parsed = JSON.parse(node.content);
        postId = parsed.postId;
        console.log("StudioWorkspace: POST 노드 postId 추출", { nodeId: node.id, postId, content: node.content });
      } catch (error) {
        console.error("StudioWorkspace: POST 노드 content 파싱 실패", { nodeId: node.id, content: node.content, error });
        // JSON 파싱 실패 시 무시
      }
    }
    
    const isPlanning = node.type === "PLANNING";
    const isSelected = selectedNodeId === node.id;
    
    return {
      id: node.id,
      type: "custom",
      position: { x: node.x, y: node.y },
      data: {
        label: node.title,
        content: node.content,
        type: node.type,
        emoji: node.emoji,
        postId,
        onEdit: handleNodeEdit,
        onDelete: handleNodeDelete,
        isPlanning,
        isConnectedToPlanning: false,
      },
      selected: isSelected,
      draggable: isSelected, // 선택된 노드만 드래그 가능
      style: {
        width: node.type === "PHOTO" ? (node.width || 300) : node.width,
        height: node.type === "PHOTO" ? (node.height || 200) : "auto",
        backgroundColor: node.type === "PHOTO" ? "transparent" : "#fff",
        border: node.type === "PHOTO" ? "none" : (isPlanning ? "2px solid #9333ea" : "2px solid #000"),
        borderRadius: "8px",
        padding: node.type === "PHOTO" ? "0" : "12px",
      },
    };
  }) || [];

  const initialEdges: Edge[] = edgesData?.map((edge: any) => ({
    id: edge.id,
    source: edge.fromId,
    target: edge.toId,
    type: edge.type === "DASHED" ? "step" : "default",
    label: edge.label || undefined,
    style: {
      strokeWidth: 3,
      ...(edge.color ? { stroke: edge.color } : {}),
    },
  })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 노드 위치 변경 시 현재 위치 저장
  useEffect(() => {
    nodes.forEach((node) => {
      currentNodePositions.current[node.id] = {
        x: node.position.x,
        y: node.position.y,
      };
    });
  }, [nodes]);

  // selectedNodeId/selectedNodeIds 변경 시 노드의 selected 및 draggable 속성 업데이트
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        // 드래그 중인 노드는 draggable 속성을 변경하지 않음
        const isDragging = isDraggingRef.current === n.id;
        const isSelected = selectedNodeIds.includes(n.id) || selectedNodeId === n.id;
        return {
          ...n,
          selected: isSelected,
          draggable: isDragging ? true : isSelected,
        };
      })
    );
  }, [selectedNodeId, selectedNodeIds, setNodes]);

  // 노드 크기 변경 핸들러 (PHOTO 노드 리사이즈용)
  const handleNodesChange = useCallback(
    (changes: any[]) => {
      // 기본 변경사항 적용
      onNodesChange(changes);

      // 노드 크기 변경 감지 및 저장
      changes.forEach((change) => {
        if (change.type === "dimensions" && change.id) {
          const node = nodes.find((n) => n.id === change.id);
          if (node && node.data.type === "PHOTO") {
            const newWidth = change.dimensions?.width;
            const newHeight = change.dimensions?.height;
            
            if (newWidth && newHeight) {
              // 리사이즈 중 표시
              resizingNodeIds.current.add(change.id);
              resizingNodeDimensions.current[change.id] = { width: newWidth, height: newHeight };
              
              // 디바운싱하여 API 호출
              const timerId = setTimeout(() => {
                fetch(`/api/studios/${studioId}/nodes/${change.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ width: newWidth, height: newHeight }),
                })
                  .then((res) => {
                    if (res.ok) {
                      // 성공 시 리사이즈 중 표시 제거
                      resizingNodeIds.current.delete(change.id);
                      // 쿼리 무효화하여 서버 데이터 동기화
                      queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
                    } else {
                      // 실패 시 리사이즈 중 표시 제거 및 롤백
                      resizingNodeIds.current.delete(change.id);
                      delete resizingNodeDimensions.current[change.id];
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to update node size:", error);
                    // 에러 시 리사이즈 중 표시 제거
                    resizingNodeIds.current.delete(change.id);
                    delete resizingNodeDimensions.current[change.id];
                  });
              }, 300);
              
              // 이전 타이머가 있으면 취소
              if ((positionUpdateTimers.current as any)[`resize_${change.id}`]) {
                clearTimeout((positionUpdateTimers.current as any)[`resize_${change.id}`]);
              }
              (positionUpdateTimers.current as any)[`resize_${change.id}`] = timerId;
            }
          }
        }
      });
    },
    [nodes, studioId, onNodesChange, queryClient, fileId]
  );

  // 연결선 삭제 핸들러 (setEdges 사용 전에 정의되어야 함)
  const handleEdgeDelete = useCallback(
    async (edgeId: string) => {
      try {
        const res = await fetch(`/api/studios/${studioId}/edges/${edgeId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete edge");

        setEdges((eds) => eds.filter((e) => e.id !== edgeId));
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId, fileId] });
        toast({
          title: "연결선 삭제 완료",
          description: "연결선이 삭제되었습니다.",
        });
      } catch (error: any) {
        toast({
          title: "연결선 삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [studioId, setEdges, queryClient, toast]
  );

  // 노드 데이터가 업데이트되면 반영
  useEffect(() => {
    if (nodesData && edgesData) {
      // 기획노드에 연결된 모든 노드 ID 집합 생성 (재귀적으로)
      const planningNodeIds = new Set<string>(
        nodesData.filter((n: any) => n.type === "PLANNING").map((n: any) => n.id as string)
      );
      
      const connectedToPlanning = new Set<string>();
      
      // 각 기획노드에 대해 재귀적으로 모든 연결된 노드 찾기
      planningNodeIds.forEach((planningId) => {
        const visited = new Set<string>();
        const findConnected = (nodeId: string) => {
          if (visited.has(nodeId)) return;
          visited.add(nodeId);
          
          edgesData.forEach((edge: any) => {
            if (edge.fromId === nodeId && !visited.has(edge.toId)) {
              connectedToPlanning.add(edge.toId);
              findConnected(edge.toId);
            } else if (edge.toId === nodeId && !visited.has(edge.fromId)) {
              connectedToPlanning.add(edge.fromId);
              findConnected(edge.fromId);
            }
          });
        };
        
        findConnected(planningId);
      });
      
      setNodes((currentNodes) => {
        // 현재 UI 노드 위치를 맵으로 저장
        const currentPositions = new Map<string, { x: number; y: number }>();
        currentNodes.forEach((n) => {
          currentPositions.set(n.id, { x: n.position.x, y: n.position.y });
        });
        
        const newNodes: Node[] = nodesData.map((node: any) => {
          // POST 타입일 때 content에서 postId 추출
          let postId: string | undefined;
          if (node.type === "POST" && node.content) {
            try {
              const parsed = JSON.parse(node.content);
              postId = parsed.postId;
              console.log("StudioWorkspace useEffect: POST 노드 postId 추출", { nodeId: node.id, postId, content: node.content });
            } catch (error) {
              console.error("StudioWorkspace useEffect: POST 노드 content 파싱 실패", { nodeId: node.id, content: node.content, error });
            }
          }
          
          const isPlanning = node.type === "PLANNING";
          const isConnectedToPlanning = connectedToPlanning.has(node.id);
          
          // 드래그 중이거나 위치 업데이트 중인 노드는 현재 위치를 유지
          const isDragging = isDraggingRef.current === node.id;
          const isUpdating = updatingNodeIds.current.has(node.id);
          let position = { x: node.x, y: node.y };
          
          if (isDragging && draggingNodePosition.current) {
            // 드래그 중인 노드는 저장된 위치 사용
            position = draggingNodePosition.current;
          } else if (isUpdating && currentNodePositions.current[node.id]) {
            // 위치 업데이트 중인 노드는 저장된 현재 위치 사용
            position = currentNodePositions.current[node.id];
          } else {
            // 현재 UI 위치와 서버 위치를 비교하여 UI 위치가 더 최신이면 유지
            const currentPos = currentPositions.get(node.id);
            if (currentPos) {
              const serverPos = { x: node.x, y: node.y };
              const distance = Math.sqrt(
                Math.pow(currentPos.x - serverPos.x, 2) + Math.pow(currentPos.y - serverPos.y, 2)
              );
              // 거리가 1픽셀 이상 차이나면 UI 위치가 더 최신일 가능성이 높음
              if (distance > 1) {
                position = currentPos;
              }
            }
          }
          
          // 리사이즈 중인 노드는 저장된 크기 사용
          const isResizing = resizingNodeIds.current.has(node.id);
          let nodeWidth = node.type === "PHOTO" ? (node.width || 300) : node.width;
          let nodeHeight = node.type === "PHOTO" ? (node.height || 200) : "auto";
          
          if (isResizing && resizingNodeDimensions.current[node.id]) {
            const savedDimensions = resizingNodeDimensions.current[node.id];
            nodeWidth = savedDimensions.width;
            nodeHeight = savedDimensions.height;
          }
          
          return {
            id: node.id,
            type: "custom",
            position,
            data: {
              label: node.title,
              content: node.content,
              type: node.type,
              emoji: node.emoji,
              postId,
              onEdit: handleNodeEdit,
              onDelete: handleNodeDelete,
              isPlanning,
              isConnectedToPlanning,
            },
            selected: selectedNodeIds.includes(node.id) || selectedNodeId === node.id,
            draggable: isDragging ? true : (isPlanning || selectedNodeIds.includes(node.id) || selectedNodeId === node.id), // 기획 노드는 항상 드래그 가능, 일반 노드는 선택된 경우만
            style: {
              width: nodeWidth,
              height: nodeHeight,
              backgroundColor: node.type === "PHOTO" ? "transparent" : "#fff",
              border: node.type === "PHOTO" ? "none" : (isPlanning ? "2px solid #9333ea" : "2px solid #000"),
              borderRadius: "8px",
              padding: node.type === "PHOTO" ? "0" : "12px",
            },
          };
        });
        
        return newNodes;
      });
    }
  }, [nodesData, edgesData, setNodes, handleNodeEdit, handleNodeDelete, selectedNodeId, selectedNodeIds]);

  useEffect(() => {
    if (edgesData) {
      const newEdges: Edge[] = edgesData.map((edge: any) => ({
        id: edge.id,
        source: edge.fromId,
        target: edge.toId,
        type: edge.type === "DASHED" ? "step" : "default",
        label: edge.label || undefined,
        style: {
          strokeWidth: 3,
          ...(edge.color ? { stroke: edge.color } : {}),
        },
      }));
      setEdges(newEdges);
    }
  }, [edgesData, setEdges]);

  // 노드 생성 뮤테이션 (Optimistic Update 적용)
  const createNodeMutation = useMutation({
    mutationFn: async (data: { type: string; title: string; x: number; y: number; fileId?: string }) => {
        const body: any = { ...data };
        if (fileId) {
          body.fileId = fileId;
        }
        const res = await fetch(`/api/studios/${studioId}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    },
    onMutate: async (newNode) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["studio-nodes", studioId, fileId] });
      
      // 이전 데이터 백업
      const previousNodes = queryClient.getQueryData(["studio-nodes", studioId, fileId]);
      
      // Optimistic Update: 임시 노드 추가
      const tempNode = {
        id: `temp-${Date.now()}`,
        ...newNode,
        width: 300,
        height: 200,
        content: null,
        emoji: null,
        color: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: currentUser?.id || "",
        isExecutable: false,
        status: "IDLE",
      };
      
      queryClient.setQueryData(["studio-nodes", studioId, fileId], (old: any) => {
        return old ? [...old, tempNode] : [tempNode];
      });
      
      return { previousNodes };
    },
    onSuccess: (newNode) => {
      // 서버에서 받은 실제 노드로 교체
      queryClient.setQueryData(["studio-nodes", studioId, fileId], (old: any) => {
        if (!old) return [newNode];
        return old.map((node: any) => 
          node.id?.startsWith("temp-") ? newNode : node
        );
      });
      
      // 썸네일 자동 생성 스케줄링
      scheduleThumbnailGeneration();
      
      toast({
        title: "노드 생성 완료",
        description: "새로운 노드가 추가되었습니다.",
        variant: "success",
      });
      setNodeCreationProgress(0);
    },
    onError: (error: any, newNode, context) => {
      // 에러 시 롤백
      if (context?.previousNodes) {
        queryClient.setQueryData(["studio-nodes", studioId, fileId], context.previousNodes);
      }
      console.error("Node creation error:", error);
      toast({
        title: "노드 생성 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
      setNodeCreationProgress(0);
    },
  });

  // 노드 생성 진행률 표시 (실제 진행률만)
  useEffect(() => {
    if (createNodeMutation.isPending) {
      setNodeCreationProgress(50); // 진행 중 표시
    } else {
      setNodeCreationProgress(0); // 완료 시 숨김
    }
  }, [createNodeMutation.isPending]);

  // 노드 추가 핸들러
  const handleAddNode = useCallback(
    (type: string) => {
      // POST 타입은 게시물 선택 다이얼로그 표시
      if (type === "POST") {
        setIsAddPostDialogOpen(true);
        return;
      }

      // 기본 좌표 (뷰포트 중심 또는 기본값)
      let x = 250;
      let y = 250;

      if (reactFlowInstance) {
        try {
          // 뷰포트 중심 좌표 계산
          const viewport = reactFlowInstance.getViewport();
          // ReactFlow의 좌표계: viewport.x는 이미 변환된 값
          // 화면 중심을 계산하려면 viewport.x/y를 사용
          const centerX = -viewport.x + (window.innerWidth - 400) / 2;
          const centerY = -viewport.y + window.innerHeight / 2;
          
          if (!isNaN(centerX) && !isNaN(centerY)) {
            x = centerX;
            y = centerY;
          }
        } catch (error) {
          console.error("Error calculating node position:", error);
          // 기본값 유지
        }
      }

      createNodeMutation.mutate({
        type,
        title: `${nodeTypeLabels[type]} 노드`,
        x: x,
        y: y,
        fileId: fileId || undefined, // fileId가 있으면 포함
      });
    },
    [reactFlowInstance, createNodeMutation, fileId]
  );

  // 사이드바에서 노드 추가 이벤트 리스너
  useEffect(() => {
    const handleAddNodeEvent = (event: CustomEvent<{ type: string }>) => {
      handleAddNode(event.detail.type);
    };

    window.addEventListener('addWorkspaceNode' as any, handleAddNodeEvent as EventListener);
    return () => {
      window.removeEventListener('addWorkspaceNode' as any, handleAddNodeEvent as EventListener);
    };
  }, [handleAddNode]);

  // 연결선 추가
  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) {
        console.error("onConnect: source or target is missing", params);
        return;
      }

      try {
        console.log("onConnect: Creating edge", { source: params.source, target: params.target });
        
        const edgeBody: any = {
          fromId: params.source,
          toId: params.target,
          fromPort: params.sourceHandle || null,
          toPort: params.targetHandle || null,
        };
        if (fileId) {
          edgeBody.fileId = fileId;
        }
        const res = await fetch(`/api/studios/${studioId}/edges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(edgeBody),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          console.error("onConnect: API error", { status: res.status, errorData });
          throw new Error(errorData.error || `Failed to create edge (${res.status})`);
        }

        const edgeData = await res.json();
        console.log("onConnect: Edge created successfully", edgeData);

        // 연결선 상태 업데이트
        setEdges((eds) => addEdge(params, eds));

        // 쿼리 무효화하여 새로고침
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId, fileId] });
        toast({
          title: "연결선 생성 성공",
          description: "노드가 연결되었습니다.",
        });
      } catch (error: any) {
        console.error("onConnect: Error creating edge", error);
        toast({
          title: "연결선 생성 실패",
          description: error.message || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
    [studioId, fileId, setEdges, queryClient, toast]
  );

  // 화이트보드가 전체 화면을 차지하도록 설정 (사이드바 뒤까지 포함)
  useEffect(() => {
    setWorkspaceStyle({
      zIndex: 1, // 사이드바(z-30)보다 낮게 설정하여 뒤에 위치
      width: '100%',
      left: '0px',
      top: '0px',
      bottom: '0px',
      backgroundColor: "#E5E5E5",
    });
  }, []);

  // 노드 위치 업데이트 디바운스 타이머 (useRef 사용)
  const positionUpdateTimers = useRef<Record<string, NodeJS.Timeout>>({});
  
  // 드래그 시작 시 모든 노드의 초기 위치 저장 (그룹 이동용)
  const dragStartPositions = useRef<Record<string, { x: number; y: number }>>({});
  const connectedNodesGroup = useRef<string[]>([]);
  
  // 드래그 중인 노드 ID 추적 (드래그 중 선택 해제 방지용)
  const isDraggingRef = useRef<string | null>(null);
  
  // 드래그 중인 노드의 현재 위치 저장 (nodesData 업데이트 시 위치 보존용)
  const draggingNodePosition = useRef<{ x: number; y: number } | null>(null);
  
  // 위치 업데이트가 진행 중인 노드 ID 추적 (nodesData 업데이트 시 위치 보존용)
  const updatingNodeIds = useRef<Set<string>>(new Set());
  
  // 현재 노드 위치를 저장 (nodesData 업데이트 시 비교용)
  const currentNodePositions = useRef<Record<string, { x: number; y: number }>>({});
  
  // 리사이즈 중인 노드의 크기 저장 (nodesData 업데이트 시 크기 보존용)
  const resizingNodeDimensions = useRef<Record<string, { width: number; height: number }>>({});
  const resizingNodeIds = useRef<Set<string>>(new Set());

  // 기획노드와 연결된 모든 노드 찾기 (DFS) - 재귀적으로 모든 연결 찾기
  const getConnectedNodes = useCallback((nodeId: string, visited: Set<string> = new Set()): string[] => {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);
    
    const connected: string[] = [nodeId];
    
    // 이 노드와 연결된 모든 노드 찾기
    edges.forEach((edge) => {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        connected.push(...getConnectedNodes(edge.target, visited));
      } else if (edge.target === nodeId && !visited.has(edge.source)) {
        connected.push(...getConnectedNodes(edge.source, visited));
      }
    });
    
    return connected;
  }, [edges]);

  // 노드 클릭 핸들러 (노드 선택)
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // 드래그 중이면 선택 변경 불가
      if (isDraggingRef.current) {
        return;
      }
      
      // 선택 모드일 때는 클릭으로 선택 가능
      if (interactionMode === "select") {
        // Shift + 클릭: 다중 선택 모드
        if (event.shiftKey) {
          setSelectedNodeIds(prev => {
            if (prev.includes(node.id)) {
              // 이미 선택된 노드면 해제
              const newIds = prev.filter(id => id !== node.id);
              setSelectedNodeId(newIds.length > 0 ? newIds[0] : null);
              return newIds;
            } else {
              // 선택 추가
              const newIds = [...prev, node.id];
              setSelectedNodeId(node.id);
              return newIds;
            }
          });
        } else {
          // 단일 선택 모드
          setSelectedNodeId(node.id);
          setSelectedNodeIds([node.id]);
        }
      } else {
        // 드래그 모드일 때는 기존 동작 유지
        // Shift + 클릭: 다중 선택 모드
        if (event.shiftKey) {
          setSelectedNodeIds(prev => {
            if (prev.includes(node.id)) {
              // 이미 선택된 노드면 해제
              const newIds = prev.filter(id => id !== node.id);
              setSelectedNodeId(newIds.length > 0 ? newIds[0] : null);
              return newIds;
            } else {
              // 선택 추가
              const newIds = [...prev, node.id];
              setSelectedNodeId(node.id);
              return newIds;
            }
          });
        } else {
          // 단일 선택 모드
          setSelectedNodeId(node.id);
          setSelectedNodeIds([node.id]);
        }
      }
    },
    [interactionMode]
  );

  // 빈 공간 클릭 핸들러 (선택 해제)
  const onPaneClick = useCallback(() => {
    // 드래그 중이면 선택 해제 불가
    if (isDraggingRef.current) {
      return;
    }
    // 선택 모드가 아닐 때만 선택 해제 (박스 선택 중에는 유지)
    if (interactionMode === "drag") {
      setSelectedNodeId(null);
      setSelectedNodeIds([]);
    }
  }, [interactionMode]);

  // 박스 선택 핸들러
  const onSelectionChange = useCallback((params: { nodes: Node[] }) => {
    if (interactionMode === "select") {
      const selectedIds = params.nodes.map(n => n.id);
      setSelectedNodeIds(selectedIds);
      setSelectedNodeId(selectedIds.length > 0 ? selectedIds[0] : null);
    }
  }, [interactionMode]);

  // 기획노드 드래그 핸들러 (연결된 노드들도 함께 이동)
  const onNodeDragStart = useCallback(
    (_: any, node: Node) => {
      // 선택 모드일 때는 노드 드래그 불가
      if (interactionMode === "select") {
        return;
      }
      
      // 기획 노드는 선택되지 않아도 드래그 가능 (연결된 노드들과 함께 이동)
      const isPlanningNode = node.data.type === "PLANNING";
      if (!isPlanningNode) {
        // 일반 노드는 선택되지 않으면 드래그 불가
        if (!selectedNodeIds.includes(node.id) && selectedNodeId !== node.id) {
          return;
        }
      }

      // 드래그 시작 표시 및 현재 위치 저장
      isDraggingRef.current = node.id;
      draggingNodePosition.current = {
        x: node.position.x,
        y: node.position.y,
      };

      // 기획노드인 경우 연결된 노드들도 함께 이동
      if (isPlanningNode) {
        // 드래그 시작 시 모든 연결된 노드의 초기 위치 저장
        const connectedNodeIds = getConnectedNodes(node.id);
        connectedNodesGroup.current = connectedNodeIds;
        
        // 기획 노드 자신의 초기 위치도 저장
        dragStartPositions.current[node.id] = {
          x: node.position.x,
          y: node.position.y,
        };
        
        connectedNodeIds.forEach((connectedId) => {
          const connectedNode = nodes.find((n) => n.id === connectedId);
          if (connectedNode && !dragStartPositions.current[connectedId]) {
            dragStartPositions.current[connectedId] = {
              x: connectedNode.position.x,
              y: connectedNode.position.y,
            };
          }
        });
      } else {
        // 일반 노드도 초기 위치 저장
        dragStartPositions.current[node.id] = {
          x: node.position.x,
          y: node.position.y,
        };
      }
    },
    [nodes, edges, getConnectedNodes, selectedNodeId, selectedNodeIds, interactionMode]
  );

  const onNodeDrag = useCallback(
    (_: any, node: Node) => {
      // 드래그 중인 노드의 현재 위치 업데이트
      if (isDraggingRef.current === node.id) {
        draggingNodePosition.current = {
          x: node.position.x,
          y: node.position.y,
        };
      }

      // 기획노드가 아니면 기본 동작
      if (node.data.type !== "PLANNING") return;

      // 기획노드의 초기 위치
      const planningStartPos = dragStartPositions.current[node.id];
      if (!planningStartPos) {
        // 아직 저장되지 않았다면 저장
        dragStartPositions.current[node.id] = {
          x: node.position.x,
          y: node.position.y,
        };
        return;
      }

      // 기획노드의 이동 거리 계산
      const deltaX = node.position.x - planningStartPos.x;
      const deltaY = node.position.y - planningStartPos.y;

      // 연결된 모든 노드들을 초기 위치 기준으로 이동
      setNodes((nds) =>
        nds.map((n) => {
          if (connectedNodesGroup.current.includes(n.id) && n.id !== node.id) {
            const startPos = dragStartPositions.current[n.id];
            if (startPos) {
              return {
                ...n,
                position: {
                  x: startPos.x + deltaX,
                  y: startPos.y + deltaY,
                },
              };
            }
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  // 노드 위치 업데이트 (디바운싱)
  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      // 기획노드인 경우 연결된 노드들도 함께 업데이트
      const nodeIdsToUpdate: string[] = [];
      
      if (node.data.type === "PLANNING") {
        // 연결된 모든 노드 ID 수집
        const connectedNodeIds = connectedNodesGroup.current.length > 0 
          ? connectedNodesGroup.current 
          : getConnectedNodes(node.id);
        nodeIdsToUpdate.push(...connectedNodeIds);
        
        // 초기 위치 초기화
        connectedNodeIds.forEach((nId) => {
          delete dragStartPositions.current[nId];
        });
        connectedNodesGroup.current = [];
      } else {
        nodeIdsToUpdate.push(node.id);
        delete dragStartPositions.current[node.id];
      }

      // 현재 UI 위치를 저장 (nodesData 업데이트 시 보존용)
      nodeIdsToUpdate.forEach((nId) => {
        const currentNode = nodes.find((n) => n.id === nId);
        if (currentNode) {
          currentNodePositions.current[nId] = {
            x: currentNode.position.x,
            y: currentNode.position.y,
          };
        }
      });

      // 위치 업데이트 시작 표시
      nodeIdsToUpdate.forEach((nId) => {
        updatingNodeIds.current.add(nId);
      });

      // 드래그 종료 표시 (위치 저장 후)
      isDraggingRef.current = null;
      draggingNodePosition.current = null;

      // 기존 타이머가 있으면 취소
      nodeIdsToUpdate.forEach((nId) => {
        if (positionUpdateTimers.current[nId]) {
          clearTimeout(positionUpdateTimers.current[nId]);
        }
      });

      // 새로운 타이머 설정 (300ms 디바운스)
      const timer = setTimeout(async () => {
        try {
          // 배치 업데이트
          const updates = nodeIdsToUpdate.map((nId) => {
            const updatedNode = nodes.find((n) => n.id === nId);
            if (updatedNode) {
              return {
                id: nId,
                x: updatedNode.position.x,
                y: updatedNode.position.y,
              };
            }
            return null;
          }).filter(Boolean);

          if (updates.length > 0) {
            const res = await fetch(`/api/studios/${studioId}/nodes/batch`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nodes: updates }),
            });

            if (!res.ok) {
              throw new Error("Failed to update node positions");
            }

            // 서버 동기화 완료 후 위치 업데이트 표시 제거
            // invalidateQueries 호출 전에 제거하면 위치가 덮어씌워질 수 있음
            // 서버 응답 후 약간의 지연을 두고 제거
            setTimeout(() => {
              nodeIdsToUpdate.forEach((nId) => {
                updatingNodeIds.current.delete(nId);
                delete currentNodePositions.current[nId];
              });
            }, 100);

            // 서버에서 업데이트된 노드 데이터 다시 가져오기
            queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
            
            // 썸네일 자동 생성 스케줄링
            scheduleThumbnailGeneration();
          } else {
            // 업데이트할 노드가 없으면 즉시 제거
            nodeIdsToUpdate.forEach((nId) => {
              updatingNodeIds.current.delete(nId);
              delete currentNodePositions.current[nId];
            });
          }

          // 성공 후 타이머 제거
          nodeIdsToUpdate.forEach((nId) => {
            delete positionUpdateTimers.current[nId];
          });
        } catch (error: any) {
          console.error("Failed to update node positions:", error);
          // 에러 발생 시 위치 업데이트 표시 제거
          nodeIdsToUpdate.forEach((nId) => {
            updatingNodeIds.current.delete(nId);
            delete currentNodePositions.current[nId];
          });
          // 에러 발생 시 노드를 원래 위치로 되돌리지 않음 (사용자가 이동한 위치 유지)
        }
      }, 300);

      // 각 노드에 타이머 할당
      nodeIdsToUpdate.forEach((nId) => {
        positionUpdateTimers.current[nId] = timer;
      });
    },
    [studioId, nodes, getConnectedNodes, fileId, queryClient]
  );

  // 키보드 단축키 처리 (복사/붙여넣기/잘라내기)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
      
      // 입력 필드에 포커스가 있으면 무시
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      // 드래그 중이면 무시
      if (isDraggingRef.current) {
        return;
      }
      
      // 복사 (Ctrl/Cmd + C)
      if (ctrlKey && e.key === 'c') {
        e.preventDefault();
        let nodesToCopy: Node[] = [];
        let edgesToCopy: Edge[] = [];
        
        // 선택된 노드들 가져오기
        const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
        if (selectedNodes.length === 0) {
          // 단일 선택된 노드가 있으면 그것 사용
          const singleNode = nodes.find(n => n.id === selectedNodeId);
          if (singleNode) {
            nodesToCopy = [singleNode];
          } else {
            return;
          }
        } else {
          nodesToCopy = [...selectedNodes];
        }
        
        // 기획 노드가 선택되었는지 확인하고 연결된 모든 노드 추가
        const planningNodes = nodesToCopy.filter(n => n.data.type === "PLANNING");
        if (planningNodes.length > 0) {
          const allNodeIds = new Set<string>(nodesToCopy.map(n => n.id));
          
          // 각 기획 노드에 연결된 모든 노드 찾기
          planningNodes.forEach(planningNode => {
            const connectedNodeIds = getConnectedNodes(planningNode.id);
            connectedNodeIds.forEach(nodeId => {
              allNodeIds.add(nodeId);
            });
          });
          
          // 연결된 모든 노드 추가
          nodesToCopy = nodes.filter(n => allNodeIds.has(n.id));
        }
        
        // 복사할 노드들 간의 연결선만 필터링
        const nodeIdsSet = new Set(nodesToCopy.map(n => n.id));
        edgesToCopy = edges.filter(edge => {
          const fromSelected = nodeIdsSet.has(edge.source);
          const toSelected = nodeIdsSet.has(edge.target);
          return fromSelected && toSelected; // 두 노드 모두 복사 대상이어야 함
        });
        
        copy(nodesToCopy, edgesToCopy);
        toast({
          title: "복사됨",
          description: `${nodesToCopy.length}개 노드가 복사되었습니다.`,
        });
      }
      
      // 붙여넣기 (Ctrl/Cmd + V)
      if (ctrlKey && e.key === 'v') {
        e.preventDefault();
        if (!clipboardData) {
          toast({
            title: "클립보드가 비어있습니다",
            variant: "destructive",
          });
          return;
        }
        
        try {
          // 뷰포트 중심 계산
          let offsetX = 50;
          let offsetY = 50;
          if (reactFlowInstance) {
            const viewport = reactFlowInstance.getViewport();
            offsetX = -viewport.x + window.innerWidth / 2 - 150;
            offsetY = -viewport.y + window.innerHeight / 2 - 100;
          }
          
          paste(fileId, offsetX, offsetY).then((newNodes) => {
            if (newNodes && newNodes.length > 0) {
              toast({
                title: "붙여넣기 완료",
                description: `${newNodes.length}개 노드가 붙여넣어졌습니다.`,
              });
              queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
              queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId, fileId] });
              
              // 붙여넣은 노드 선택
              const newNodeIds = newNodes.map(n => n.id);
              setSelectedNodeIds(newNodeIds);
              setSelectedNodeId(newNodeIds[0] || null);
            }
          }).catch((error) => {
            console.error('Paste failed:', error);
            toast({
              title: "붙여넣기 실패",
              description: error.message || "노드를 붙여넣는데 실패했습니다.",
              variant: "destructive",
            });
          });
        } catch (error: any) {
          toast({
            title: "붙여넣기 실패",
            description: error.message || "알 수 없는 오류가 발생했습니다.",
            variant: "destructive",
          });
        }
      }
      
      // 잘라내기 (Ctrl/Cmd + X)
      if (ctrlKey && e.key === 'x') {
        e.preventDefault();
        let nodesToCut: Node[] = [];
        let edgesToCut: Edge[] = [];
        
        // 선택된 노드들 가져오기
        const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
        if (selectedNodes.length === 0) {
          // 단일 선택된 노드가 있으면 그것 사용
          const singleNode = nodes.find(n => n.id === selectedNodeId);
          if (singleNode) {
            nodesToCut = [singleNode];
          } else {
            return;
          }
        } else {
          nodesToCut = [...selectedNodes];
        }
        
        // 기획 노드가 선택되었는지 확인하고 연결된 모든 노드 추가
        const planningNodes = nodesToCut.filter(n => n.data.type === "PLANNING");
        if (planningNodes.length > 0) {
          const allNodeIds = new Set<string>(nodesToCut.map(n => n.id));
          
          // 각 기획 노드에 연결된 모든 노드 찾기
          planningNodes.forEach(planningNode => {
            const connectedNodeIds = getConnectedNodes(planningNode.id);
            connectedNodeIds.forEach(nodeId => {
              allNodeIds.add(nodeId);
            });
          });
          
          // 연결된 모든 노드 추가
          nodesToCut = nodes.filter(n => allNodeIds.has(n.id));
        }
        
        // 잘라낼 노드들 간의 연결선만 필터링
        const nodeIdsSet = new Set(nodesToCut.map(n => n.id));
        edgesToCut = edges.filter(edge => {
          const fromSelected = nodeIdsSet.has(edge.source);
          const toSelected = nodeIdsSet.has(edge.target);
          return fromSelected && toSelected; // 두 노드 모두 잘라낼 대상이어야 함
        });
        
        cut(nodesToCut, edgesToCut, handleNodeDelete).then(() => {
          setSelectedNodeId(null);
          setSelectedNodeIds([]);
          toast({
            title: "잘라내기 완료",
            description: `${nodesToCut.length}개 노드가 잘라내어졌습니다.`,
          });
        }).catch((error) => {
          console.error('Cut failed:', error);
          toast({
            title: "잘라내기 실패",
            description: error.message || "노드를 잘라내는데 실패했습니다.",
            variant: "destructive",
          });
        });
      }
      
      // 삭제 (Delete 또는 Backspace)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        
        // 선택된 노드들 가져오기
        const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
        let nodesToDelete: Node[] = [];
        
        if (selectedNodes.length === 0) {
          // 단일 선택된 노드가 있으면 그것 사용
          const singleNode = nodes.find(n => n.id === selectedNodeId);
          if (singleNode) {
            nodesToDelete = [singleNode];
          } else {
            return;
          }
        } else {
          nodesToDelete = [...selectedNodes];
        }
        
        if (nodesToDelete.length === 0) {
          return;
        }
        
        // 확인 다이얼로그
        const nodeCount = nodesToDelete.length;
        const confirmMessage = nodeCount === 1 
          ? "이 노드를 삭제하시겠습니까?" 
          : `${nodeCount}개 노드를 삭제하시겠습니까?`;
        
        if (!confirm(confirmMessage)) {
          return;
        }
        
        // 노드 삭제 실행 (Optimistic Update는 handleNodeDelete 내부에서 처리)
        Promise.all(nodesToDelete.map(node => handleNodeDelete(node.id)))
          .then(() => {
            toast({
              title: "삭제 완료",
              description: `${nodeCount}개 노드가 삭제되었습니다.`,
            });
          })
          .catch((error) => {
            console.error('Delete failed:', error);
            toast({
              title: "삭제 실패",
              description: error.message || "노드를 삭제하는데 실패했습니다.",
              variant: "destructive",
            });
          });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodes, edges, selectedNodeIds, selectedNodeId, copy, paste, cut, clipboardData, fileId, reactFlowInstance, queryClient, studioId, toast, handleNodeDelete]);

  if (isLoadingNodes || isLoadingEdges) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <FigmaProgressBar variant="center" value={fakeProgress} />
      </div>
    );
  }

  return (
    <div 
      ref={reactFlowWrapperRef}
      className="h-screen fixed top-0 right-0 bottom-0" 
      style={workspaceStyle}
    >

      {/* 노드 생성 중 토스트 팝업 */}
      <NodeCreationToast
        isVisible={createNodeMutation.isPending}
        progress={nodeCreationProgress}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={(changes) => {
          // 연결선 삭제 처리
          changes.forEach((change) => {
            if (change.type === "remove" && change.id) {
              const edge = edges.find((e) => e.id === change.id);
              if (edge) {
                handleEdgeDelete(change.id);
              }
            }
          });
          onEdgesChange(changes);
        }}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onInit={setReactFlowInstance}
        onNodeContextMenu={(event, node) => {
          event.preventDefault();
          if (confirm("이 노드를 삭제하시겠습니까?")) {
            handleNodeDelete(node.id);
          }
        }}
        onEdgeClick={(event, edge) => {
          event.stopPropagation();
          if (confirm("이 연결선을 삭제하시겠습니까?")) {
            handleEdgeDelete(edge.id);
          }
        }}
        nodeTypes={nodeTypes}
        nodesDraggable={interactionMode === "drag"} // 드래그 모드일 때만 노드 드래그 가능
        panOnDrag={interactionMode === "drag"} // 드래그 모드일 때 빈 공간 드래그로 캔버스 이동 가능
        selectionOnDrag={interactionMode === "select"} // 선택 모드일 때 박스 선택 활성화
        fitView
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <Background 
          color="#999999" 
          gap={16}
          size={2}
        />
        <Controls 
          style={{ 
            backgroundColor: "#2a2a2a",
            border: "1px solid #3a3a3a"
          }}
        />
      </ReactFlow>


      {/* 게시물 노드 추가 다이얼로그 */}
      <AddToNodeDialog
        open={isAddPostDialogOpen}
        onClose={() => setIsAddPostDialogOpen(false)}
        studioId={studioId}
        fileId={fileId}
      />

      {/* 모드 전환 플로팅 버튼 */}
      <ModeToggleButton
        mode={interactionMode}
        onModeChange={setInteractionMode}
      />
    </div>
  );
}

export default function StudioWorkspace({ studioId, fileId }: StudioWorkspaceProps) {
  return (
    <ReactFlowProvider>
      <WorkspaceContent studioId={studioId} fileId={fileId} />
    </ReactFlowProvider>
  );
}
