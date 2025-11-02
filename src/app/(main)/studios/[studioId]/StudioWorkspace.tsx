"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomNode from "@/components/workspace/CustomNode";
import { nodeTypeLabels, nodeTypeIcons } from "@/components/workspace/nodeConfig";
import NodeSidebar from "@/components/workspace/NodeSidebar";

interface StudioWorkspaceProps {
  studioId: string;
}

function WorkspaceContent({ studioId }: StudioWorkspaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // 기본 노드 타입 정의 (hooks 순서 유지를 위해 상단에 위치)
  const nodeTypes: NodeTypes = React.useMemo(() => ({
    custom: CustomNode,
  }), []);

  // 노드 및 연결선 조회
  const { data: nodesData, isLoading: isLoadingNodes } = useQuery({
    queryKey: ["studio-nodes", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/nodes`);
      if (!res.ok) throw new Error("Failed to fetch nodes");
      return res.json();
    },
  });

  const { data: edgesData, isLoading: isLoadingEdges } = useQuery({
    queryKey: ["studio-edges", studioId],
    queryFn: async () => {
      const res = await fetch(`/api/studios/${studioId}/edges`);
      if (!res.ok) throw new Error("Failed to fetch edges");
      return res.json();
    },
  });

  // 노드 편집 핸들러
  const handleNodeEdit = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSidebarOpen(true);
  }, []);

  // 사이드바 닫기 핸들러
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedNodeId(null);
  }, []);

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

        queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId] });
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
    [studioId, queryClient, toast]
  );

  // 노드 삭제 핸들러
  const handleNodeDelete = useCallback(
    async (nodeId: string) => {
      if (!confirm("이 노드를 삭제하시겠습니까?")) return;

      try {
        const res = await fetch(`/api/studios/${studioId}/nodes/${nodeId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete node");

        queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId] });
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId] });
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
    [studioId, queryClient, toast]
  );

  // ReactFlow를 위한 노드/연결선 변환
  const initialNodes: Node[] = nodesData?.map((node: any) => {
    return {
      id: node.id,
      type: "custom",
      position: { x: node.x, y: node.y },
      data: {
        label: node.title,
        content: node.content,
        type: node.type,
        emoji: node.emoji,
        onEdit: handleNodeEdit,
      },
      style: {
        width: node.width,
        minHeight: node.height,
        backgroundColor: "#fff",
        border: "2px solid #000",
        borderRadius: "8px",
        padding: "12px",
      },
    };
  }) || [];

  const initialEdges: Edge[] = edgesData?.map((edge: any) => ({
    id: edge.id,
    source: edge.fromId,
    target: edge.toId,
    type: edge.type === "DASHED" ? "step" : "default",
    label: edge.label || undefined,
    style: edge.color ? { stroke: edge.color } : undefined,
  })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 연결선 삭제 핸들러 (setEdges 사용 전에 정의되어야 함)
  const handleEdgeDelete = useCallback(
    async (edgeId: string) => {
      try {
        const res = await fetch(`/api/studios/${studioId}/edges/${edgeId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete edge");

        setEdges((eds) => eds.filter((e) => e.id !== edgeId));
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId] });
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
    if (nodesData) {
      const newNodes: Node[] = nodesData.map((node: any) => {
        return {
          id: node.id,
          type: "custom",
          position: { x: node.x, y: node.y },
          data: {
            label: node.title,
            content: node.content,
            type: node.type,
            emoji: node.emoji,
            onEdit: handleNodeEdit,
          },
          style: {
            width: node.width,
            minHeight: node.height,
            backgroundColor: "#fff",
            border: "2px solid #000",
            borderRadius: "8px",
            padding: "12px",
          },
        };
      });
      setNodes(newNodes);
    }
  }, [nodesData, setNodes, handleNodeEdit]);

  useEffect(() => {
    if (edgesData) {
      const newEdges: Edge[] = edgesData.map((edge: any) => ({
        id: edge.id,
        source: edge.fromId,
        target: edge.toId,
        type: edge.type === "DASHED" ? "step" : "default",
        label: edge.label || undefined,
        style: edge.color ? { stroke: edge.color } : undefined,
      }));
      setEdges(newEdges);
    }
  }, [edgesData, setEdges]);

  // 노드 생성 뮤테이션
  const createNodeMutation = useMutation({
    mutationFn: async (data: { type: string; title: string; x: number; y: number }) => {
      const res = await fetch(`/api/studios/${studioId}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId] });
      toast({
        title: "노드 생성 완료",
        description: "새로운 노드가 추가되었습니다.",
        variant: "success",
      });
    },
    onError: (error: any) => {
      console.error("Node creation error:", error);
      toast({
        title: "노드 생성 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 노드 추가 핸들러
  const handleAddNode = useCallback(
    (type: string) => {
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
      });
    },
    [reactFlowInstance, createNodeMutation]
  );

  // 연결선 추가
  const onConnect = useCallback(
    async (params: Connection) => {
      if (!params.source || !params.target) return;

      try {
        const res = await fetch(`/api/studios/${studioId}/edges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromId: params.source,
            toId: params.target,
            fromPort: params.sourceHandle || null,
            toPort: params.targetHandle || null,
          }),
        });

        if (!res.ok) throw new Error("Failed to create edge");

        // 연결선 상태 업데이트
        setEdges((eds) => addEdge(params, eds));

        // 쿼리 무효화하여 새로고침
        queryClient.invalidateQueries({ queryKey: ["studio-edges", studioId] });
        toast({
          title: "연결선 생성 성공",
          description: "노드가 연결되었습니다.",
        });
      } catch (error: any) {
        toast({
          title: "연결선 생성 실패",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    [studioId, setEdges, queryClient, toast]
  );

  // 노드 위치 업데이트 디바운스 타이머 (useRef 사용)
  const positionUpdateTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // 노드 위치 업데이트 (디바운싱)
  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      // 기존 타이머가 있으면 취소
      if (positionUpdateTimers.current[node.id]) {
        clearTimeout(positionUpdateTimers.current[node.id]);
      }

      // 새로운 타이머 설정 (300ms 디바운스)
      const timer = setTimeout(async () => {
        try {
          await fetch(`/api/studios/${studioId}/nodes/${node.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              x: node.position.x,
              y: node.position.y,
            }),
          });
          
          // 성공 후 타이머 제거
          delete positionUpdateTimers.current[node.id];
        } catch (error: any) {
          console.error("Failed to update node position:", error);
        }
      }, 300);

      positionUpdateTimers.current[node.id] = timer;
    },
    [studioId]
  );

  if (isLoadingNodes || isLoadingEdges) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div 
      className="h-screen fixed top-0 right-0 bottom-0" 
      style={{ 
        zIndex: 1, 
        left: "400px",
        width: sidebarOpen ? "calc(100% - 400px - 384px)" : "calc(100% - 400px)", // 사이드바 열림 시 너비 조정
        backgroundColor: "#E5E5E5"
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
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
        onNodeDragStop={onNodeDragStop}
        onInit={setReactFlowInstance}
        onNodeContextMenu={(event, node) => {
          event.preventDefault();
          if (confirm("이 노드를 삭제하시겠습니까?")) {
            handleNodeDelete(node.id);
          }
        }}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <Background 
          color="#ffffff" 
          gap={16}
          size={2}
        />
        <Controls 
          style={{ 
            backgroundColor: "#2a2a2a",
            border: "1px solid #3a3a3a"
          }}
        />
        <MiniMap 
          style={{ 
            backgroundColor: "#2a2a2a",
            border: "1px solid #3a3a3a"
          }}
          nodeColor={() => "#fff"}
        />
        
        {/* 노드 추가 패널 */}
        <Panel position="top-left" className="m-4" style={{ zIndex: 50 }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700">
                <Plus className="h-4 w-4" />
                노드 추가
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-gray-800 border-gray-700">
              {Object.entries(nodeTypeLabels).map(([type, label]) => {
                const Icon = nodeTypeIcons[type];
                return (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleAddNode(type)}
                    className="flex items-center gap-2 text-white hover:bg-gray-700"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </Panel>
      </ReactFlow>

      {/* 노드 편집 사이드바 */}
      {sidebarOpen && selectedNodeId && nodesData && (
        <NodeSidebar
          nodeId={selectedNodeId}
          initialTitle={
            nodesData.find((n: any) => n.id === selectedNodeId)?.title || ""
          }
          initialContent={
            nodesData.find((n: any) => n.id === selectedNodeId)?.content || ""
          }
          initialEmoji={
            nodesData.find((n: any) => n.id === selectedNodeId)?.emoji || ""
          }
          onClose={handleSidebarClose}
          onSave={handleNodeSave}
        />
      )}
    </div>
  );
}

export default function StudioWorkspace({ studioId }: StudioWorkspaceProps) {
  return (
    <ReactFlowProvider>
      <WorkspaceContent studioId={studioId} />
    </ReactFlowProvider>
  );
}
