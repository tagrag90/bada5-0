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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
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
    setNodeEditData(null);
  }, [setNodeEditData]);

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
    [studioId, fileId, queryClient, toast]
  );

  // 노드 삭제 핸들러
  const handleNodeDelete = useCallback(
    async (nodeId: string) => {
      try {
        const res = await fetch(`/api/studios/${studioId}/nodes/${nodeId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete node");

        queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId, fileId] });
        setSelectedNodeId(null);
        setSidebarOpen(false);
        setNodeEditData(null);
        toast({
          title: "노드 삭제 완료",
          description: "노드가 삭제되었습니다.",
        });
      } catch (error: any) {
        toast({
          title: "노드 삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [studioId, fileId, queryClient, toast]
  );

  // 노드 편집 핸들러
  const handleNodeEdit = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
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

  // selectedNodeId 변경 시 노드의 selected 및 draggable 속성 업데이트
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        // 드래그 중인 노드는 draggable 속성을 변경하지 않음
        const isDragging = isDraggingRef.current === n.id;
        return {
          ...n,
          selected: selectedNodeId === n.id,
          draggable: isDragging ? true : (selectedNodeId === n.id),
        };
      })
    );
  }, [selectedNodeId, setNodes]);

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
              // API 호출하여 노드 크기 업데이트
              fetch(`/api/studios/${studioId}/nodes/${change.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ width: newWidth, height: newHeight }),
              }).catch((error) => {
                console.error("Failed to update node size:", error);
              });
            }
          }
        }
      });
    },
    [nodes, studioId, onNodesChange]
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
          // 위치 업데이트 중인 노드는 현재 위치 사용
          position = currentNodePositions.current[node.id];
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
          selected: selectedNodeId === node.id,
          draggable: isDragging ? true : (selectedNodeId === node.id), // 드래그 중이거나 선택된 노드만 드래그 가능
          style: {
            width: node.type === "PHOTO" ? (node.width || 300) : node.width,
            height: node.type === "PHOTO" ? (node.height || 200) : "auto",
            backgroundColor: node.type === "PHOTO" ? "transparent" : "#fff",
            border: node.type === "PHOTO" ? "none" : (isPlanning ? "2px solid #9333ea" : "2px solid #000"),
            borderRadius: "8px",
            padding: node.type === "PHOTO" ? "0" : "12px",
          },
        };
      });
      setNodes(newNodes);
    }
  }, [nodesData, edgesData, setNodes, handleNodeEdit, handleNodeDelete, selectedNodeId]);

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

  // 노드 생성 뮤테이션
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
      toast({
        title: "노드 생성 완료",
        description: "새로운 노드가 추가되었습니다.",
        variant: "success",
      });
      setNodeCreationProgress(0);
    },
    onError: (error: any) => {
      console.error("Node creation error:", error);
      toast({
        title: "노드 생성 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
      setNodeCreationProgress(0);
    },
  });

  // 노드 생성 진행률 시뮬레이션
  useEffect(() => {
    if (createNodeMutation.isPending) {
      setNodeCreationProgress(0);
      
      // 불규칙한 진행률 시뮬레이션
      const intervals: NodeJS.Timeout[] = [];
      let currentProgress = 0;
      
      // 초기 빠른 진행 (0-40%)
      const interval1 = setInterval(() => {
        const increment = Math.random() * 10 + 3; // 3-13%씩 증가
        currentProgress = Math.min(currentProgress + increment, 40);
        setNodeCreationProgress(currentProgress);
        if (currentProgress >= 40) {
          clearInterval(interval1);
        }
      }, 80);
      intervals.push(interval1);
      
      // 중간 진행 (40-70%)
      setTimeout(() => {
        const interval2 = setInterval(() => {
          const increment = Math.random() * 5 + 2; // 2-7%씩 증가
          currentProgress = Math.min(currentProgress + increment, 70);
          setNodeCreationProgress(currentProgress);
          if (currentProgress >= 70) {
            clearInterval(interval2);
          }
        }, 100);
        intervals.push(interval2);
      }, 200);
      
      // 느린 진행 (70-90%)
      setTimeout(() => {
        const interval3 = setInterval(() => {
          const increment = Math.random() * 2 + 0.5; // 0.5-2.5%씩 증가
          currentProgress = Math.min(currentProgress + increment, 90);
          setNodeCreationProgress(currentProgress);
          if (currentProgress >= 90) {
            clearInterval(interval3);
            setNodeCreationProgress(90);
          }
        }, 150);
        intervals.push(interval3);
      }, 400);
      
      return () => {
        intervals.forEach(interval => clearInterval(interval));
      };
    } else {
      // 완료 시 100%로 이동 후 숨김
      setNodeCreationProgress((prev) => {
        if (prev < 100 && prev > 0) {
          setTimeout(() => setNodeCreationProgress(0), 300);
          return 100;
        }
        return prev;
      });
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
    (_: React.MouseEvent, node: Node) => {
      // 드래그 중이면 선택 변경 불가
      if (isDraggingRef.current) {
        return;
      }
      // 노드 선택 (이미 선택된 노드면 해제)
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    },
    []
  );

  // 빈 공간 클릭 핸들러 (선택 해제)
  const onPaneClick = useCallback(() => {
    // 드래그 중이면 선택 해제 불가
    if (isDraggingRef.current) {
      return;
    }
    setSelectedNodeId(null);
  }, []);

  // 기획노드 드래그 핸들러 (연결된 노드들도 함께 이동)
  const onNodeDragStart = useCallback(
    (_: any, node: Node) => {
      // 선택되지 않은 노드는 드래그 불가
      if (selectedNodeId !== node.id) {
        return;
      }

      // 드래그 시작 표시 및 현재 위치 저장
      isDraggingRef.current = node.id;
      draggingNodePosition.current = {
        x: node.position.x,
        y: node.position.y,
      };

      // 기획노드인 경우 연결된 노드들도 함께 이동
      if (node.data.type === "PLANNING") {
        // 드래그 시작 시 모든 연결된 노드의 초기 위치 저장
        const connectedNodeIds = getConnectedNodes(node.id);
        connectedNodesGroup.current = connectedNodeIds;
        
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
    [nodes, edges, getConnectedNodes, selectedNodeId]
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
      // 드래그 종료 표시 및 위치 초기화
      isDraggingRef.current = null;
      draggingNodePosition.current = null;

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

      // 위치 업데이트 시작 표시
      nodeIdsToUpdate.forEach((nId) => {
        updatingNodeIds.current.add(nId);
      });

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

            // 위치 업데이트 완료 표시 (서버 동기화 전에 제거)
            nodeIdsToUpdate.forEach((nId) => {
              updatingNodeIds.current.delete(nId);
            });

            // 서버에서 업데이트된 노드 데이터 다시 가져오기
            queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
          } else {
            // 업데이트할 노드가 없으면 즉시 제거
            nodeIdsToUpdate.forEach((nId) => {
              updatingNodeIds.current.delete(nId);
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

  if (isLoadingNodes || isLoadingEdges) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <FigmaProgressBar variant="center" value={fakeProgress} />
      </div>
    );
  }

  return (
    <div 
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
        nodesDraggable={true} // 개별 노드의 draggable 속성으로 제어
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
