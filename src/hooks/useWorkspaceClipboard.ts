import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface ClipboardNode {
  type: string;
  title: string;
  content?: string;
  emoji?: string;
  color?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  config?: any;
  tempId: string;
}

interface ClipboardEdge {
  fromTempId: string;
  toTempId: string;
  type: string;
  label?: string;
  color?: string;
  fromPort?: string;
  toPort?: string;
}

interface ClipboardData {
  version: string;
  studioId: string;
  sourceFileId?: string;
  nodes: ClipboardNode[];
  edges: ClipboardEdge[];
  copiedAt: number;
}

export const useWorkspaceClipboard = (studioId: string) => {
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null);

  const copy = useCallback((nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return;

    // 노드 ID → tempId 매핑
    const nodeIdToTempId = new Map<string, string>();
    const clipboardNodes: ClipboardNode[] = nodes.map((node, index) => {
      const tempId = `temp_${index}_${Date.now()}`;
      nodeIdToTempId.set(node.id, tempId);

      return {
        type: node.data.type,
        title: node.data.label,
        content: node.data.content,
        emoji: node.data.emoji,
        color: node.data.color,
        x: node.position.x,
        y: node.position.y,
        width: (node.width as number) || 300,
        height: (node.height as number) || 200,
        config: node.data.config,
        tempId,
      };
    });

    // 연결선 변환 (복사된 노드 간 연결만)
    const selectedNodeIds = new Set(nodes.map(n => n.id));
    const clipboardEdges: ClipboardEdge[] = edges
      .filter(edge => {
        const fromSelected = selectedNodeIds.has(edge.source);
        const toSelected = selectedNodeIds.has(edge.target);
        return fromSelected && toSelected; // 둘 다 선택된 노드 간 연결만
      })
      .map(edge => ({
        fromTempId: nodeIdToTempId.get(edge.source)!,
        toTempId: nodeIdToTempId.get(edge.target)!,
        type: edge.type || 'default',
        label: edge.label,
        color: edge.style?.stroke,
        fromPort: edge.sourceHandle || undefined,
        toPort: edge.targetHandle || undefined,
      }));

    const data: ClipboardData = {
      version: "1.0",
      studioId,
      nodes: clipboardNodes,
      edges: clipboardEdges,
      copiedAt: Date.now(),
    };

    setClipboardData(data);
    // 로컬 스토리지에도 저장 (파일 간 이동용)
    try {
      localStorage.setItem(`workspace-clipboard-${studioId}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save clipboard to localStorage:', error);
    }
  }, [studioId]);

  const paste = useCallback(async (
    targetFileId: string | undefined,
    offsetX: number = 0,
    offsetY: number = 0
  ): Promise<Node[] | null> => {
    if (!clipboardData) return null;

    // tempId → 새 노드 ID 매핑
    const tempIdToNewId = new Map<string, string>();

    try {
      // 노드 생성
      const nodePromises = clipboardData.nodes.map(async (node) => {
        const res = await fetch(`/api/studios/${studioId}/nodes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: node.type,
            title: node.title,
            content: node.content,
            emoji: node.emoji,
            color: node.color,
            x: node.x + offsetX,
            y: node.y + offsetY,
            width: node.width,
            height: node.height,
            config: node.config,
            fileId: targetFileId,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create node');
        }

        const newNode = await res.json();
        tempIdToNewId.set(node.tempId, newNode.id);
        return newNode;
      });

      const newNodes = await Promise.all(nodePromises);

      // 연결선 생성
      const edgePromises = clipboardData.edges.map(async (edge) => {
        const fromId = tempIdToNewId.get(edge.fromTempId);
        const toId = tempIdToNewId.get(edge.toTempId);

        if (!fromId || !toId) {
          console.warn('Failed to find node IDs for edge:', edge);
          return null;
        }

        const res = await fetch(`/api/studios/${studioId}/edges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromId,
            toId,
            fromPort: edge.fromPort,
            toPort: edge.toPort,
            type: edge.type,
            label: edge.label,
            color: edge.color,
            fileId: targetFileId,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          console.warn('Failed to create edge:', error);
          return null;
        }

        return res.json();
      });

      await Promise.all(edgePromises);

      return newNodes;
    } catch (error) {
      console.error('Paste failed:', error);
      throw error;
    }
  }, [clipboardData, studioId]);

  const cut = useCallback(async (nodes: Node[], edges: Edge[], onDelete: (id: string) => Promise<void>) => {
    copy(nodes, edges);
    // 선택된 노드 삭제
    await Promise.all(
      nodes.map(node => onDelete(node.id).catch(error => {
        console.error('Failed to delete node:', error);
      }))
    );
  }, [copy]);

  // 로컬 스토리지에서 클립보드 로드
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(`workspace-clipboard-${studioId}`);
      if (stored) {
        const data = JSON.parse(stored) as ClipboardData;
        // 같은 스튜디오의 클립보드만 로드
        if (data.studioId === studioId) {
          setClipboardData(data);
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to load clipboard from localStorage:', error);
    }
    return null;
  }, [studioId]);

  return { copy, paste, cut, clipboardData, loadFromStorage };
};

