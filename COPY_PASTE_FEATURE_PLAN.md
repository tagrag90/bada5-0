# 피그마 스타일 복사/붙여넣기/잘라내기 기능 구현 방안

**작성일**: 2025-01-16  
**프로젝트**: Divetobada Workspace  
**목적**: 노드 및 연결선을 복사/붙여넣기/잘라내기하여 다른 화이트보드 파일에 붙여넣을 수 있는 기능 구현

---

## 📋 목차

1. [기능 개요](#1-기능-개요)
2. [구현 방안](#2-구현-방안)
3. [데이터 구조](#3-데이터-구조)
4. [API 설계](#4-api-설계)
5. [UI/UX 설계](#5-uiux-설계)
6. [구현 단계](#6-구현-단계)
7. [주의사항](#7-주의사항)

---

## 1. 기능 개요

### 1.1 핵심 기능
- **복사 (Ctrl/Cmd + C)**: 선택된 노드와 연결선을 클립보드에 복사
- **붙여넣기 (Ctrl/Cmd + V)**: 클립보드의 노드를 현재 화이트보드에 붙여넣기
- **잘라내기 (Ctrl/Cmd + X)**: 선택된 노드와 연결선을 복사 후 삭제
- **다중 선택**: Shift + 클릭 또는 박스 선택으로 여러 노드 선택
- **파일 간 이동**: 다른 화이트보드 파일에 붙여넣기 가능

### 1.2 피그마와의 차이점
- 피그마: 단일 파일 내에서 복사/붙여넣기
- 우리: **여러 파일 간 복사/붙여넣기** 지원

---

## 2. 구현 방안

### 2.1 클립보드 관리

#### 방법 1: 로컬 스토리지 (권장)
- **장점**: 브라우저를 닫아도 유지, 다른 탭과 공유 가능
- **단점**: 크기 제한 (약 5-10MB)
- **용도**: 노드 데이터가 작을 때 적합

#### 방법 2: 메모리 (Context/State)
- **장점**: 빠른 접근, 크기 제한 없음
- **단점**: 탭 닫으면 사라짐
- **용도**: 임시 복사본

#### 방법 3: 하이브리드
- 작은 데이터: 메모리
- 큰 데이터: 로컬 스토리지
- **권장**: 메모리 사용 (노드 데이터는 작음)

### 2.2 복사/붙여넣기 흐름

```
1. 사용자가 노드 선택 (단일 또는 다중)
2. Ctrl/Cmd + C 또는 Ctrl/Cmd + X
3. 노드 데이터 + 연결선 데이터 수집
4. 클립보드에 저장 (메모리 또는 로컬 스토리지)
5. 다른 파일로 이동 또는 같은 파일에서 Ctrl/Cmd + V
6. 클립보드에서 데이터 읽기
7. 새 ID 생성 및 위치 오프셋 적용
8. API 호출하여 노드 생성
9. 연결선 재생성 (노드 ID 매핑)
```

---

## 3. 데이터 구조

### 3.1 클립보드 데이터 구조

```typescript
interface ClipboardData {
  version: string; // "1.0"
  studioId: string; // 원본 스튜디오 ID
  sourceFileId?: string; // 원본 파일 ID (선택적)
  nodes: ClipboardNode[];
  edges: ClipboardEdge[];
  copiedAt: number; // 타임스탬프
}

interface ClipboardNode {
  // 노드 기본 정보
  type: NodeType;
  title: string;
  content?: string;
  emoji?: string;
  color?: string;
  
  // 위치 및 크기 (상대 좌표)
  x: number;
  y: number;
  width: number;
  height: number;
  
  // 메타데이터
  config?: any;
  
  // 임시 ID (붙여넣기 시 매핑용)
  tempId: string;
}

interface ClipboardEdge {
  fromTempId: string; // 원본 노드의 tempId
  toTempId: string; // 대상 노드의 tempId
  type: EdgeType;
  label?: string;
  color?: string;
  fromPort?: string;
  toPort?: string;
}
```

### 3.2 노드 ID 매핑

```typescript
// 복사 시: 실제 ID → tempId
const nodeIdMap = new Map<string, string>();
nodes.forEach((node, index) => {
  const tempId = `temp_${index}_${Date.now()}`;
  nodeIdMap.set(node.id, tempId);
});

// 붙여넣기 시: tempId → 새 ID
const tempToNewIdMap = new Map<string, string>();
```

---

## 4. API 설계

### 4.1 기존 API 활용
- `POST /api/studios/[studioId]/nodes` - 노드 생성
- `POST /api/studios/[studioId]/edges` - 연결선 생성
- `PATCH /api/studios/[studioId]/nodes/batch` - 노드 일괄 생성 (신규 필요)

### 4.2 신규 API (선택적)

#### 배치 노드 생성 API
```typescript
POST /api/studios/[studioId]/nodes/batch-create
Body: {
  nodes: Array<{
    type: NodeType;
    title: string;
    content?: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    emoji?: string;
    color?: string;
    config?: any;
    fileId?: string;
  }>;
  fileId?: string;
}
Response: {
  nodes: Array<{ id: string; ... }>;
}
```

#### 배치 연결선 생성 API
```typescript
POST /api/studios/[studioId]/edges/batch-create
Body: {
  edges: Array<{
    fromId: string;
    toId: string;
    fromPort?: string;
    toPort?: string;
    type: EdgeType;
    label?: string;
    color?: string;
    fileId?: string;
  }>;
  fileId?: string;
}
Response: {
  edges: Array<{ id: string; ... }>;
}
```

---

## 5. UI/UX 설계

### 5.1 키보드 단축키

| 단축키 | 동작 |
|--------|------|
| `Ctrl/Cmd + C` | 선택된 노드 복사 |
| `Ctrl/Cmd + V` | 클립보드 붙여넣기 |
| `Ctrl/Cmd + X` | 선택된 노드 잘라내기 |
| `Ctrl/Cmd + A` | 모든 노드 선택 (선택적) |
| `Delete` | 선택된 노드 삭제 (기존 기능) |

### 5.2 다중 선택

#### 방법 1: Shift + 클릭
- Shift 키를 누른 상태에서 노드 클릭
- 기존 선택에 추가/제거

#### 방법 2: 박스 선택 (드래그)
- 빈 공간에서 드래그하여 박스 선택
- 박스 안에 포함된 노드 모두 선택

#### 방법 3: 둘 다 지원 (권장)

### 5.3 시각적 피드백

- **선택된 노드**: 파란색 링 (이미 구현됨)
- **복사 가능 표시**: 선택된 노드에 "복사됨" 힌트 (선택적)
- **붙여넣기 위치**: 마우스 위치에 미리보기 (선택적)

### 5.4 컨텍스트 메뉴 (선택적)

- 우클릭 메뉴에 "복사", "붙여넣기", "잘라내기" 옵션 추가

---

## 6. 구현 단계

### Phase 1: 기본 복사/붙여넣기 (같은 파일 내)

#### 6.1 클립보드 관리
```typescript
// hooks/useClipboard.ts
const useClipboard = () => {
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null);
  
  const copyNodes = useCallback((nodes: Node[], edges: Edge[]) => {
    // 노드와 연결선을 클립보드 형식으로 변환
    const clipboardNodes = nodes.map((node, index) => ({
      type: node.data.type,
      title: node.data.label,
      content: node.data.content,
      emoji: node.data.emoji,
      x: node.position.x,
      y: node.position.y,
      width: node.width || 300,
      height: node.height || 200,
      tempId: `temp_${index}_${Date.now()}`,
    }));
    
    // 연결선을 tempId로 변환
    const clipboardEdges = edges.map((edge) => ({
      fromTempId: getTempId(edge.source),
      toTempId: getTempId(edge.target),
      type: edge.type,
      // ...
    }));
    
    setClipboardData({
      version: "1.0",
      studioId: studioId,
      nodes: clipboardNodes,
      edges: clipboardEdges,
      copiedAt: Date.now(),
    });
  }, [studioId]);
  
  const pasteNodes = useCallback(async (targetFileId?: string, offsetX = 0, offsetY = 0) => {
    if (!clipboardData) return;
    
    // 새 노드 생성
    const newNodes = await Promise.all(
      clipboardData.nodes.map((node) =>
        fetch(`/api/studios/${studioId}/nodes`, {
          method: "POST",
          body: JSON.stringify({
            ...node,
            x: node.x + offsetX,
            y: node.y + offsetY,
            fileId: targetFileId,
          }),
        })
      )
    );
    
    // 연결선 재생성
    // ...
  }, [clipboardData, studioId]);
  
  return { copyNodes, pasteNodes, clipboardData };
};
```

#### 6.2 키보드 이벤트 처리
```typescript
// StudioWorkspace.tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
    
    // 입력 필드에 포커스가 있으면 무시
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    
    if (ctrlKey && e.key === 'c') {
      e.preventDefault();
      // 선택된 노드 복사
      const selectedNodes = nodes.filter(n => n.selected);
      const relatedEdges = edges.filter(e => 
        selectedNodes.some(n => n.id === e.source || n.id === e.target)
      );
      copyNodes(selectedNodes, relatedEdges);
    }
    
    if (ctrlKey && e.key === 'v') {
      e.preventDefault();
      // 붙여넣기
      const viewport = reactFlowInstance?.getViewport();
      const centerX = viewport ? -viewport.x + window.innerWidth / 2 : 250;
      const centerY = viewport ? -viewport.y + window.innerHeight / 2 : 250;
      pasteNodes(fileId, centerX, centerY);
    }
    
    if (ctrlKey && e.key === 'x') {
      e.preventDefault();
      // 잘라내기 (복사 + 삭제)
      const selectedNodes = nodes.filter(n => n.selected);
      const relatedEdges = edges.filter(e => 
        selectedNodes.some(n => n.id === e.source || n.id === e.target)
      );
      copyNodes(selectedNodes, relatedEdges);
      // 선택된 노드 삭제
      selectedNodes.forEach(node => handleNodeDelete(node.id));
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [nodes, edges, copyNodes, pasteNodes, fileId]);
```

### Phase 2: 다중 선택

#### 6.3 Shift + 클릭
```typescript
const onNodeClick = useCallback(
  (event: React.MouseEvent, node: Node) => {
    if (event.shiftKey) {
      // 다중 선택 모드
      setSelectedNodeIds(prev => {
        if (prev.includes(node.id)) {
          return prev.filter(id => id !== node.id); // 선택 해제
        } else {
          return [...prev, node.id]; // 선택 추가
        }
      });
    } else {
      // 단일 선택 모드
      setSelectedNodeId(node.id);
    }
  },
  []
);
```

#### 6.4 박스 선택
```typescript
// React Flow의 SelectionMode 활용
<ReactFlow
  selectionMode={SelectionMode.Full}
  onSelectionStart={(params) => {
    // 박스 선택 시작
  }}
  onSelectionEnd={(params) => {
    // 선택된 노드 ID 수집
    const selectedIds = params.nodes.map(n => n.id);
    setSelectedNodeIds(selectedIds);
  }}
>
```

### Phase 3: 파일 간 붙여넣기

#### 6.5 클립보드 영구 저장
```typescript
// 로컬 스토리지에 저장
const saveToLocalStorage = (data: ClipboardData) => {
  localStorage.setItem('workspace-clipboard', JSON.stringify(data));
};

const loadFromLocalStorage = (): ClipboardData | null => {
  const data = localStorage.getItem('workspace-clipboard');
  return data ? JSON.parse(data) : null;
};
```

#### 6.6 다른 파일에서 붙여넣기
- 클립보드 데이터에 `studioId`와 `sourceFileId` 포함
- 다른 파일에서 붙여넣기 시 자동으로 `fileId` 변경
- 권한 확인: 같은 스튜디오 내에서만 붙여넣기 가능

---

## 7. 주의사항

### 7.1 데이터 무결성

1. **노드 참조 문제**
   - POST 노드의 `postId`는 그대로 유지
   - RESOURCE/PHOTO 노드의 파일 URL은 그대로 유지
   - 연결선의 포트 정보는 유지

2. **ID 충돌 방지**
   - 복사 시 새 ID 생성 (서버에서 cuid() 사용)
   - 연결선의 `fromId`, `toId`는 새 노드 ID로 매핑

3. **권한 확인**
   - 같은 스튜디오 내에서만 복사/붙여넣기 가능
   - 파일 접근 권한 확인

### 7.2 성능 고려사항

1. **대량 노드 복사**
   - 100개 이상 노드 복사 시 성능 저하 가능
   - 배치 API 사용 권장

2. **연결선 재생성**
   - 복사된 노드 간 연결선만 재생성
   - 외부 노드와의 연결선은 제거

### 7.3 UX 고려사항

1. **붙여넣기 위치**
   - 뷰포트 중심에 붙여넣기 (기본)
   - 마우스 위치에 붙여넣기 (선택적)

2. **선택 상태**
   - 붙여넣기 후 새 노드가 선택된 상태로 표시
   - 바로 이동 가능하도록

3. **에러 처리**
   - 복사 실패 시 토스트 메시지
   - 붙여넣기 실패 시 원본 유지

---

## 8. 구현 예시 코드

### 8.1 클립보드 훅

```typescript
// hooks/useWorkspaceClipboard.ts
import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface ClipboardData {
  version: string;
  studioId: string;
  sourceFileId?: string;
  nodes: Array<{
    type: string;
    title: string;
    content?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    emoji?: string;
    color?: string;
    tempId: string;
  }>;
  edges: Array<{
    fromTempId: string;
    toTempId: string;
    type: string;
    label?: string;
    color?: string;
  }>;
  copiedAt: number;
}

export const useWorkspaceClipboard = (studioId: string) => {
  const [clipboardData, setClipboardData] = useState<ClipboardData | null>(null);
  
  const copy = useCallback((nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return;
    
    // 노드 ID → tempId 매핑
    const nodeIdToTempId = new Map<string, string>();
    const clipboardNodes = nodes.map((node, index) => {
      const tempId = `temp_${index}_${Date.now()}`;
      nodeIdToTempId.set(node.id, tempId);
      
      return {
        type: node.data.type,
        title: node.data.label,
        content: node.data.content,
        emoji: node.data.emoji,
        x: node.position.x,
        y: node.position.y,
        width: (node.width as number) || 300,
        height: (node.height as number) || 200,
        color: node.data.color,
        tempId,
      };
    });
    
    // 연결선 변환 (복사된 노드 간 연결만)
    const clipboardEdges = edges
      .filter(edge => {
        const fromSelected = nodes.some(n => n.id === edge.source);
        const toSelected = nodes.some(n => n.id === edge.target);
        return fromSelected && toSelected; // 둘 다 선택된 노드 간 연결만
      })
      .map(edge => ({
        fromTempId: nodeIdToTempId.get(edge.source)!,
        toTempId: nodeIdToTempId.get(edge.target)!,
        type: edge.type || 'default',
        label: edge.label,
        color: edge.style?.stroke,
      }));
    
    const data: ClipboardData = {
      version: "1.0",
      studioId,
      nodes: clipboardNodes,
      edges: clipboardEdges,
      copiedAt: Date.now(),
    };
    
    setClipboardData(data);
    // 로컬 스토리지에도 저장 (선택적)
    localStorage.setItem(`workspace-clipboard-${studioId}`, JSON.stringify(data));
  }, [studioId]);
  
  const paste = useCallback(async (
    targetFileId: string | undefined,
    offsetX: number = 0,
    offsetY: number = 0
  ) => {
    if (!clipboardData) return null;
    
    // tempId → 새 노드 ID 매핑
    const tempIdToNewId = new Map<string, string>();
    
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
          fileId: targetFileId,
        }),
      });
      const newNode = await res.json();
      tempIdToNewId.set(node.tempId, newNode.id);
      return newNode;
    });
    
    const newNodes = await Promise.all(nodePromises);
    
    // 연결선 생성
    const edgePromises = clipboardData.edges.map((edge) =>
      fetch(`/api/studios/${studioId}/edges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromId: tempIdToNewId.get(edge.fromTempId)!,
          toId: tempIdToNewId.get(edge.toTempId)!,
          type: edge.type,
          label: edge.label,
          color: edge.color,
          fileId: targetFileId,
        }),
      })
    );
    
    await Promise.all(edgePromises);
    
    return newNodes;
  }, [clipboardData, studioId]);
  
  const cut = useCallback((nodes: Node[], edges: Edge[], onDelete: (id: string) => void) => {
    copy(nodes, edges);
    // 선택된 노드 삭제
    nodes.forEach(node => onDelete(node.id));
  }, [copy]);
  
  return { copy, paste, cut, clipboardData };
};
```

### 8.2 StudioWorkspace 통합

```typescript
// StudioWorkspace.tsx에 추가
const { copy, paste, cut, clipboardData } = useWorkspaceClipboard(studioId);
const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

// 키보드 이벤트
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
    const target = e.target as HTMLElement;
    
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    
    if (ctrlKey && e.key === 'c') {
      e.preventDefault();
      const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
      const relatedEdges = edges.filter(e =>
        selectedNodes.some(n => n.id === e.source || n.id === e.target)
      );
      copy(selectedNodes, relatedEdges);
      toast({ title: "복사됨", description: `${selectedNodes.length}개 노드가 복사되었습니다.` });
    }
    
    if (ctrlKey && e.key === 'v') {
      e.preventDefault();
      if (!clipboardData) {
        toast({ title: "클립보드가 비어있습니다", variant: "destructive" });
        return;
      }
      const viewport = reactFlowInstance?.getViewport();
      const offsetX = viewport ? -viewport.x + window.innerWidth / 2 - 150 : 250;
      const offsetY = viewport ? -viewport.y + window.innerHeight / 2 - 100 : 250;
      paste(fileId, offsetX, offsetY).then(() => {
        toast({ title: "붙여넣기 완료", description: "노드가 붙여넣어졌습니다." });
        queryClient.invalidateQueries({ queryKey: ["studio-nodes", studioId, fileId] });
      });
    }
    
    if (ctrlKey && e.key === 'x') {
      e.preventDefault();
      const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
      if (selectedNodes.length === 0) return;
      const relatedEdges = edges.filter(e =>
        selectedNodes.some(n => n.id === e.source || n.id === e.target)
      );
      cut(selectedNodes, relatedEdges, handleNodeDelete);
      toast({ title: "잘라내기 완료", description: `${selectedNodes.length}개 노드가 잘라내어졌습니다.` });
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [nodes, edges, selectedNodeIds, copy, paste, cut, clipboardData, fileId, reactFlowInstance]);
```

---

## 9. 구현 우선순위

### Phase 1: 기본 기능 (필수)
1. ✅ 단일 노드 선택 후 복사/붙여넣기
2. ✅ 같은 파일 내 복사/붙여넣기
3. ✅ 키보드 단축키 (Ctrl/Cmd + C, V, X)

### Phase 2: 다중 선택 (권장)
1. Shift + 클릭으로 다중 선택
2. 박스 선택 (드래그)
3. 다중 노드 복사/붙여넣기

### Phase 3: 파일 간 이동 (고급)
1. 다른 파일에 붙여넣기
2. 클립보드 영구 저장 (로컬 스토리지)
3. 파일 간 이동 시 권한 확인

### Phase 4: 고급 기능 (선택)
1. 컨텍스트 메뉴 (우클릭)
2. 붙여넣기 위치 미리보기
3. 복사 히스토리 (여러 번 복사)

---

## 10. 예상 효과

### 10.1 사용자 경험 개선
- **작업 효율성 향상**: 노드를 빠르게 복사하여 재사용
- **템플릿 활용**: 자주 사용하는 노드 구조를 복사하여 재사용
- **파일 간 이동**: 노드를 다른 파일로 쉽게 이동

### 10.2 업계 표준 준수
- 피그마, 어도비 일러스트레이터 등과 동일한 UX
- 사용자 학습 곡선 감소

---

## 11. 결론

피그마 스타일의 복사/붙여넣기/잘라내기 기능을 구현하면:

1. **작업 효율성 향상**: 노드 재사용 및 템플릿 활용
2. **파일 간 이동**: 노드를 다른 화이트보드로 쉽게 이동
3. **일관성 있는 UX**: 업계 표준과 일치하는 사용자 경험

**권장사항**: Phase 1부터 시작하여 점진적으로 확장하는 것이 좋습니다.

---

**© 2025 Studio_bada. All Rights Reserved.**

