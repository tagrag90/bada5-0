"use client";

import { Button } from "@/components/ui/button";
import { nodeTypeLabels, nodeTypeIcons } from "@/components/workspace/nodeConfig";

export default function WorkspaceNodeAddBlock() {
  const handleNodeTypeSelect = (type: string) => {
    // 커스텀 이벤트를 발생시켜 StudioWorkspace의 handleAddNode를 호출
    const event = new CustomEvent('addWorkspaceNode', { detail: { type } });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full space-y-2">
      <div className="text-xs font-medium text-gray-500 mb-2">노드 추가</div>
      <div className="flex flex-col gap-2">
        {Object.entries(nodeTypeLabels).map(([type, label]) => {
          const Icon = nodeTypeIcons[type];
          return (
            <Button
              key={type}
              onClick={() => handleNodeTypeSelect(type)}
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2 justify-start"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

