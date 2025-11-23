# 피그마 스타일 화이트보드 화면 이동 및 사용 방식 변경 방안

**작성일**: 2025-01-16  
**프로젝트**: Divetobada Workspace  
**목적**: 화이트보드의 화면 이동 및 사용 방식을 피그마와 동일하게 변경하는 방안 검토

---

## 📋 목차

1. [현재 상태 분석](#1-현재-상태-분석)
2. [피그마의 주요 기능](#2-피그마의-주요-기능)
3. [변경 방안](#3-변경-방안)
4. [구현 세부사항](#4-구현-세부사항)
5. [예상 효과](#5-예상-효과)
6. [주의사항](#6-주의사항)

---

## 1. 현재 상태 분석

### 1.1 현재 React Flow 설정

**파일**: `src/app/(main)/studios/[studioId]/StudioWorkspace.tsx`

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={handleNodesChange}
  // ... 기타 props
  fitView
  style={{ backgroundColor: "#E5E5E5" }}
>
```

### 1.2 현재 동작 방식

- **캔버스 이동**: 마우스 드래그로 자유롭게 이동 가능 (기본값)
- **줌 인/아웃**: 
  - 마우스 휠로 줌 (기본값)
  - Controls 컴포넌트의 +/- 버튼
- **노드 이동**: 노드를 직접 드래그하여 이동
- **선택**: 노드 클릭으로 선택

### 1.3 문제점

1. **캔버스 이동과 노드 이동의 충돌**
   - 빈 공간 드래그 시 캔버스가 이동하여 노드 선택이 어려울 수 있음
   - 노드를 드래그하려다 실수로 캔버스가 이동하는 경우 발생

2. **피그마 사용자와의 차이**
   - 피그마 사용자들이 익숙한 스페이스바 + 드래그 방식이 아님
   - 일관성 없는 사용자 경험

---

## 2. 피그마의 주요 기능

### 2.1 화면 이동 (Pan)

- **스페이스바 + 드래그**: 캔버스 이동
- **스페이스바 누르면 손 모양 커서** (`grab` → `grabbing`)
- **빈 공간 드래그만으로는 캔버스 이동 안 됨**

### 2.2 줌 (Zoom)

- **Cmd/Ctrl + 마우스 휠**: 줌 인/아웃
- **마우스 휠만으로는 줌 안 됨** (기본적으로 스크롤)
- **숫자 키 (1, 2, 3...)**: 특정 배율로 전환

### 2.3 노드/객체 조작

- **드래그**: 노드를 직접 드래그하여 이동
- **선택**: 노드 클릭으로 선택
- **박스 선택**: 드래그로 여러 노드 선택

### 2.4 기타 단축키

- **H**: 손 도구 (Hand tool) - 캔버스 이동 모드
- **V**: 선택 도구 (Select tool) - 기본 모드
- **Z**: 줌 도구 (Zoom tool)

---

## 3. 변경 방안

### 3.1 핵심 변경사항

#### 1. 스페이스바 + 드래그로 캔버스 이동
- `panOnDrag: false`로 설정하여 기본 드래그 비활성화
- 스페이스바 키 감지하여 동적으로 `panOnDrag` 활성화
- 스페이스바 누르면 손 모양 커서 표시

#### 2. 마우스 휠 동작 변경
- `panOnScroll: false`로 설정하여 마우스 휠로 캔버스 이동 비활성화
- `zoomOnScroll: true`로 설정하여 마우스 휠로 줌
- Cmd/Ctrl + 마우스 휠로 줌 (기본 동작)

#### 3. 커서 스타일 변경
- 스페이스바 누르면 `cursor: grab` → 드래그 중 `cursor: grabbing`
- 기본 상태는 `cursor: default`

### 3.2 구현 방법

#### 방법 1: React Flow Props 활용 (권장)

```typescript
const [isSpacePressed, setIsSpacePressed] = useState(false);
const [isDragging, setIsDragging] = useState(false);

// 스페이스바 감지
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !isSpacePressed) {
      e.preventDefault(); // 스크롤 방지
      setIsSpacePressed(true);
    }
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      setIsDragging(false);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, [isSpacePressed]);

<ReactFlow
  panOnDrag={isSpacePressed} // 스페이스바 눌렀을 때만 활성화
  panOnScroll={false} // 마우스 휠로 캔버스 이동 비활성화
  zoomOnScroll={true} // 마우스 휠로 줌
  zoomOnPinch={true} // 핀치 줌 (터치 디바이스)
  style={{
    backgroundColor: "#E5E5E5",
    cursor: isSpacePressed 
      ? (isDragging ? 'grabbing' : 'grab')
      : 'default'
  }}
  onMoveStart={() => {
    if (isSpacePressed) setIsDragging(true);
  }}
  onMoveEnd={() => {
    setIsDragging(false);
  }}
>
```

#### 방법 2: 커스텀 Pan 핸들러 구현

더 세밀한 제어가 필요한 경우:

```typescript
const [panMode, setPanMode] = useState<'select' | 'pan'>('select');

// 스페이스바로 pan 모드 전환
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setPanMode('pan');
    }
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setPanMode('select');
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);

<ReactFlow
  panOnDrag={panMode === 'pan'}
  panOnScroll={false}
  zoomOnScroll={true}
  // ...
>
```

---

## 4. 구현 세부사항

### 4.1 필요한 상태 관리

```typescript
const [isSpacePressed, setIsSpacePressed] = useState(false);
const [isPanning, setIsPanning] = useState(false);
```

### 4.2 키보드 이벤트 처리

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 스페이스바 감지
    if (e.code === 'Space' && !isSpacePressed) {
      e.preventDefault(); // 페이지 스크롤 방지
      setIsSpacePressed(true);
    }
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      setIsPanning(false);
    }
  };
  
  // 전역 이벤트 리스너 등록
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, [isSpacePressed]);
```

### 4.3 React Flow Props 설정

```typescript
<ReactFlow
  // 기본 설정
  nodes={nodes}
  edges={edges}
  onNodesChange={handleNodesChange}
  
  // 피그마 스타일 설정
  panOnDrag={isSpacePressed} // 스페이스바 눌렀을 때만 활성화
  panOnScroll={false} // 마우스 휠로 캔버스 이동 비활성화
  zoomOnScroll={true} // 마우스 휠로 줌
  zoomOnPinch={true} // 핀치 줌 (터치 디바이스)
  zoomOnDoubleClick={true} // 더블클릭 줌
  
  // 커서 스타일
  style={{
    backgroundColor: "#E5E5E5",
    cursor: isSpacePressed 
      ? (isPanning ? 'grabbing' : 'grab')
      : 'default'
  }}
  
  // 이벤트 핸들러
  onMoveStart={() => {
    if (isSpacePressed) setIsPanning(true);
  }}
  onMoveEnd={() => {
    setIsPanning(false);
  }}
  
  // 기타 설정
  nodeTypes={nodeTypes}
  fitView
>
```

### 4.4 추가 개선사항

#### 1. 시각적 피드백
- 스페이스바 누르면 화면에 "스페이스바를 누른 채 드래그하여 이동" 힌트 표시
- 손 모양 커서로 명확한 피드백 제공

#### 2. 모바일 지원
- 터치 디바이스에서는 두 손가락 드래그로 캔버스 이동
- 핀치 줌 지원

#### 3. 단축키 안내
- 도움말 모달에 단축키 안내 추가
- H 키: 손 도구 (Hand tool)
- V 키: 선택 도구 (Select tool)

---

## 5. 예상 효과

### 5.1 사용자 경험 개선

1. **직관적인 조작**
   - 피그마 사용자들이 익숙한 방식으로 즉시 사용 가능
   - 학습 곡선 감소

2. **정확한 노드 선택**
   - 빈 공간 드래그로 캔버스가 이동하지 않아 노드 선택이 쉬워짐
   - 노드 드래그 시 실수로 캔버스가 이동하는 문제 해결

3. **일관성 있는 UX**
   - 피그마와 동일한 패턴으로 사용자 혼란 감소

### 5.2 작업 효율성 향상

1. **빠른 캔버스 이동**
   - 스페이스바 + 드래그로 빠르게 원하는 위치로 이동
   - 마우스 휠로 정밀한 줌 조절

2. **정확한 노드 배치**
   - 노드 드래그 시 캔버스가 움직이지 않아 정확한 위치 지정 가능

---

## 6. 주의사항

### 6.1 기존 사용자 적응

- 기존 사용자들이 익숙한 드래그 방식에서 변경되므로 적응 기간 필요
- 설정에서 기본 동작 방식을 선택할 수 있도록 옵션 제공 고려

### 6.2 접근성

- 키보드만 사용하는 사용자를 위한 대안 제공 필요
- Controls 컴포넌트의 화살표 버튼으로 캔버스 이동 가능하도록 유지

### 6.3 모바일/터치 디바이스

- 모바일에서는 스페이스바가 없으므로 다른 방식 필요
- 두 손가락 드래그로 캔버스 이동
- 핀치 줌으로 줌 인/아웃

### 6.4 브라우저 호환성

- `e.code === 'Space'`는 모든 최신 브라우저에서 지원
- 구형 브라우저를 위한 폴백 처리 필요

---

## 7. 구현 우선순위

### Phase 1: 기본 기능 (필수)
1. ✅ 스페이스바 + 드래그로 캔버스 이동
2. ✅ 마우스 휠로 줌 (panOnScroll: false, zoomOnScroll: true)
3. ✅ 스페이스바 누르면 손 모양 커서 표시

### Phase 2: 개선사항 (권장)
1. 시각적 피드백 (스페이스바 누르면 힌트 표시)
2. 모바일/터치 디바이스 지원
3. 단축키 안내 (H, V 키)

### Phase 3: 고급 기능 (선택)
1. 설정에서 기본 동작 방식 선택 가능
2. 커스텀 단축키 설정
3. 애니메이션 효과

---

## 8. 코드 예시

### 8.1 완전한 구현 예시

```typescript
"use client";

import { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  // ... 기타 imports
} from "reactflow";

function WorkspaceContent({ studioId, fileId }: StudioWorkspaceProps) {
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  // 스페이스바 감지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 스페이스바 감지 (입력 필드에 포커스가 없을 때만)
      if (e.code === 'Space' && !isSpacePressed) {
        const target = e.target as HTMLElement;
        // 입력 필드가 아닐 때만 처리
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault(); // 페이지 스크롤 방지
          setIsSpacePressed(true);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      
      // 피그마 스타일 설정
      panOnDrag={isSpacePressed} // 스페이스바 눌렀을 때만 활성화
      panOnScroll={false} // 마우스 휠로 캔버스 이동 비활성화
      zoomOnScroll={true} // 마우스 휠로 줌
      zoomOnPinch={true} // 핀치 줌
      zoomOnDoubleClick={true} // 더블클릭 줌
      
      // 커서 스타일
      style={{
        backgroundColor: "#E5E5E5",
        cursor: isSpacePressed 
          ? (isPanning ? 'grabbing' : 'grab')
          : 'default'
      }}
      
      // 이벤트 핸들러
      onMoveStart={() => {
        if (isSpacePressed) setIsPanning(true);
      }}
      onMoveEnd={() => {
        setIsPanning(false);
      }}
      
      // 기타 설정
      nodeTypes={nodeTypes}
      fitView
    >
      <Background color="#999999" gap={16} size={2} />
      <Controls />
    </ReactFlow>
  );
}
```

---

## 9. 테스트 체크리스트

### 9.1 기본 기능 테스트
- [ ] 스페이스바 누르고 드래그하면 캔버스가 이동하는가?
- [ ] 스페이스바 누르면 손 모양 커서가 표시되는가?
- [ ] 스페이스바 떼면 일반 커서로 돌아오는가?
- [ ] 빈 공간 드래그 시 캔버스가 이동하지 않는가?
- [ ] 노드 드래그 시 캔버스가 이동하지 않는가?
- [ ] 마우스 휠로 줌이 작동하는가?
- [ ] Cmd/Ctrl + 마우스 휠로 줌이 작동하는가?

### 9.2 엣지 케이스 테스트
- [ ] 입력 필드에 포커스가 있을 때 스페이스바가 정상 작동하는가?
- [ ] 모달이 열려있을 때 스페이스바가 정상 작동하는가?
- [ ] 여러 탭이 열려있을 때 스페이스바가 정상 작동하는가?
- [ ] 브라우저 뒤로가기/앞으로가기와 충돌하지 않는가?

### 9.3 모바일/터치 테스트
- [ ] 두 손가락 드래그로 캔버스 이동이 작동하는가?
- [ ] 핀치 줌이 작동하는가?
- [ ] 터치 디바이스에서 노드 드래그가 정상 작동하는가?

---

## 10. 결론

피그마 스타일의 화면 이동 방식을 적용하면:

1. **사용자 경험 개선**: 피그마 사용자들이 즉시 익숙하게 사용 가능
2. **작업 효율성 향상**: 정확한 노드 선택 및 배치 가능
3. **일관성 있는 UX**: 업계 표준과 일치하는 사용자 경험

**권장사항**: Phase 1 기본 기능을 먼저 구현하고, 사용자 피드백을 받아 Phase 2, 3을 진행하는 것이 좋습니다.

---

**© 2025 Studio_bada. All Rights Reserved.**

