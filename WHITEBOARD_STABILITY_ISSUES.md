# 화이트보드 기능 불안정 요소 분석 보고서

## 🔴 심각한 문제 (Critical Issues)

### 1. 타이머 메모리 누수
**위치**: `StudioWorkspace.tsx` - `positionUpdateTimers.current`
- **문제**: `positionUpdateTimers.current`에 저장된 타이머들이 컴포넌트 언마운트 시 정리되지 않음
- **영향**: 메모리 누수, 예상치 못한 API 호출 발생 가능
- **위치**: 
  - `onNodeDragStop` (라인 1528-1532)
  - `handleNodesChange` (라인 776-779)

### 2. 썸네일 생성 중 뷰포트 복원 실패 가능성
**위치**: `StudioWorkspace.tsx` - `generateThumbnail` 함수
- **문제**: 에러 발생 시 뷰포트가 원래 상태로 복원되지 않을 수 있음
- **영향**: 사용자가 화면을 잃어버릴 수 있음
- **위치**: 라인 159-340 (try-catch 블록 내에서 뷰포트 복원이 에러 발생 시 실행되지 않을 수 있음)

### 3. 경쟁 조건 (Race Condition) - 노드 위치 업데이트
**위치**: `StudioWorkspace.tsx` - `onNodeDragStop`
- **문제**: 
  - `updatingNodeIds.current`를 100ms 후에 클리어하는데, 서버 응답이 늦으면 위치가 덮어씌워질 수 있음
  - 여러 노드를 빠르게 드래그하면 타이머가 겹칠 수 있음
- **영향**: 노드 위치가 예상치 못하게 변경될 수 있음
- **위치**: 라인 1494-1499

### 4. 세션 스토리지 초기화 플래그 누적
**위치**: `StudioWorkspace.tsx` - `onInit` 핸들러
- **문제**: `workspace-initialized-${fileId}` 플래그가 세션 스토리지에 계속 쌓임
- **영향**: 세션 스토리지 공간 낭비, 파일이 변경되어도 플래그가 남아있을 수 있음
- **위치**: 라인 1826-1839

## 🟡 중간 수준 문제 (Medium Issues)

### 5. 리사이즈 타이머 정리 누락
**위치**: `StudioWorkspace.tsx` - `handleNodesChange`
- **문제**: `resize_${change.id}` 타이머가 컴포넌트 언마운트 시 정리되지 않음
- **영향**: 메모리 누수 가능성
- **위치**: 라인 776-779

### 6. Ref 객체 메모리 누수
**위치**: `StudioWorkspace.tsx` - 여러 `useRef` 객체들
- **문제**: 
  - `currentNodePositions.current`
  - `resizingNodeDimensions.current`
  - `dragStartPositions.current`
  - `updatingNodeIds.current`
  - 위 객체들이 계속 쌓이지만 정리되지 않음
- **영향**: 장시간 사용 시 메모리 사용량 증가
- **위치**: 전역적으로 사용됨

### 7. 쿼리 무효화 중복 호출
**위치**: `StudioWorkspace.tsx` - 여러 위치
- **문제**: 같은 쿼리를 여러 곳에서 동시에 무효화하면 불필요한 리렌더링 발생
- **영향**: 성능 저하
- **위치**: 
  - `handleNodeSave` (라인 518)
  - `handleNodeDelete` (라인 568-569)
  - `onNodeDragStop` (라인 1502)
  - `createNodeMutation.onSuccess` (라인 1007)

### 8. 이미지 로드 중복 호출 가능성
**위치**: `CustomNode.tsx` - `handleImageLoad`
- **문제**: `hasUpdatedSize` 상태로 중복 호출을 방지하지만, 노드가 재생성되면 다시 호출될 수 있음
- **영향**: 불필요한 API 호출
- **위치**: 라인 35-94

### 9. 클립보드 로드 의존성 문제
**위치**: `StudioWorkspace.tsx` - `useEffect` with `loadFromStorage`
- **문제**: `loadFromStorage`가 `useCallback`으로 메모이제이션되어 있지만, 의존성 배열에 `studioId`만 있어서 문제가 될 수 있음
- **영향**: 클립보드가 제대로 로드되지 않을 수 있음
- **위치**: 라인 55-57

### 10. 노드 위치 동기화 불필요한 업데이트
**위치**: `StudioWorkspace.tsx` - `useEffect` (라인 704-711)
- **문제**: `nodes` 변경 시마다 `currentNodePositions.current`를 업데이트하는데, 이게 불필요한 업데이트를 유발할 수 있음
- **영향**: 성능 저하
- **위치**: 라인 704-711

## 🟢 경미한 문제 (Minor Issues)

### 11. 에러 핸들링 부족
**위치**: `StudioWorkspace.tsx` - `onNodeDragStop`
- **문제**: API 호출 실패 시 롤백 로직이 없음
- **영향**: 사용자가 노드를 이동했는데 서버에 반영되지 않을 수 있음
- **위치**: 라인 1518-1526

### 12. 썸네일 생성 디바운스 중복
**위치**: `StudioWorkspace.tsx` - `scheduleThumbnailGeneration`
- **문제**: 여러 곳에서 호출되면 타이머가 중복 설정될 수 있음 (현재는 정리하고 있지만, 타이밍 이슈 가능)
- **영향**: 불필요한 썸네일 생성 시도
- **위치**: 라인 471-489

### 13. POST 노드 content 파싱 에러 처리
**위치**: `StudioWorkspace.tsx` - `initialNodes` 및 `useEffect` (라인 816-937)
- **문제**: JSON 파싱 실패 시 에러만 로그하고 계속 진행
- **영향**: POST 노드가 제대로 표시되지 않을 수 있음
- **위치**: 라인 646-655, 856-864

### 14. 연결선 생성 실패 시 롤백 없음
**위치**: `StudioWorkspace.tsx` - `onConnect`
- **문제**: API 호출 실패 시 이미 추가된 연결선이 UI에 남아있을 수 있음
- **영향**: UI와 서버 상태 불일치
- **위치**: 라인 1120-1173

### 15. 붙여넣기 실패 시 부분 성공 처리 없음
**위치**: `useWorkspaceClipboard.ts` - `paste` 함수
- **문제**: 일부 노드 생성이 실패해도 나머지는 계속 진행됨
- **영향**: 부분적으로만 붙여넣어진 상태가 될 수 있음
- **위치**: 라인 99-183

## 📊 우선순위별 권장 사항

### 즉시 수정 필요 (P0)
1. 타이머 메모리 누수 해결 (문제 #1, #5)
2. 썸네일 생성 뷰포트 복원 보장 (문제 #2)
3. 경쟁 조건 해결 (문제 #3)

### 단기 수정 권장 (P1)
4. Ref 객체 정리 로직 추가 (문제 #6)
5. 쿼리 무효화 중복 방지 (문제 #7)
6. 세션 스토리지 정리 (문제 #4)

### 중기 개선 권장 (P2)
7. 에러 핸들링 강화 (문제 #11, #14, #15)
8. 불필요한 업데이트 최적화 (문제 #10)
9. 이미지 로드 최적화 (문제 #8)

---

**분석 일시**: 2025-01-27
**분석 대상**: `StudioWorkspace.tsx`, `CustomNode.tsx`, `useWorkspaceClipboard.ts`

