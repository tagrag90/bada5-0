"use client";

import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Pencil } from "lucide-react";
import { nodeTypeIcons, nodeTypeLabels } from "./nodeConfig";

interface CustomNodeData {
  label: string;
  content?: string;
  type: string;
  icon?: string;
  emoji?: string;
  onEdit?: (nodeId: string) => void;
}

export default function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  const Icon = nodeTypeIcons[data.type] || nodeTypeIcons["NOTE"];
  const typeLabel = nodeTypeLabels[data.type] || "";

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
          border: '2px solid #000',
          backgroundColor: '#fff',
          zIndex: 10,
        }}
      />
      {/* 편집 버튼 - 우측 상단 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onEdit?.(id);
        }}
        className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="노드 편집"
      >
        <Pencil className="h-3.5 w-3.5 text-gray-600" />
      </button>
      <div className="flex flex-col items-start text-left gap-1 w-full pr-8">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Icon className="h-3 w-3" />
          <span>{typeLabel}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-sm text-black">
          {data.emoji && <span className="text-base">{data.emoji}</span>}
          <span>{data.label}</span>
        </div>
        {data.content && (
          <div className="text-xs text-gray-600 mt-1 line-clamp-3">
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
          border: '2px solid #000',
          backgroundColor: '#fff',
          zIndex: 10,
        }}
      />
    </div>
  );
}

