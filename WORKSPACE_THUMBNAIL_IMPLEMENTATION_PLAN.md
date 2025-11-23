# 워크스페이스 파일 썸네일/프리뷰 구현 방안

## 현재 상황

### 데이터베이스
- `WorkspaceFile` 모델에 `thumbnailUrl` 필드 존재 (선택적)
- API에서 `thumbnailUrl`을 받을 수 있지만, UI에서 설정하는 기능 없음
- 현재는 `thumbnailUrl`이 없으면 `FileText` 아이콘만 표시

### 표시되는 정보
- 파일 이름 (`file.name`)
- 파일 설명 (`file.description`, 선택적)
- 노드 개수 (`file._count?.nodes`)
- 수정 날짜 (`file.updatedAt`)

---

## 구현 방안

### 방안 1: 자동 프리뷰 생성 (추천) ⭐

**개념**: 피그마처럼 화이트보드의 현재 상태를 자동으로 캡처하여 썸네일로 사용

**장점**:
- 사용자 개입 불필요
- 항상 최신 상태 반영
- 피그마와 유사한 UX

**구현 방법**:

#### 1-1. React Flow 캔버스 캡처
```typescript
// StudioWorkspace.tsx에 추가
const captureThumbnail = async () => {
  if (!reactFlowInstance) return;
  
  // React Flow의 viewport를 캔버스로 렌더링
  const nodesBounds = reactFlowInstance.getNodesBounds();
  const viewport = reactFlowInstance.getViewport();
  
  // html2canvas 또는 reactflow의 내장 기능 사용
  const canvas = await reactFlowInstance.toObject();
  // 또는 html2canvas로 DOM을 캡처
};
```

#### 1-2. 서버 사이드 캡처 (Puppeteer/Playwright)
```typescript
// API Route: /api/studios/[studioId]/files/[fileId]/thumbnail
// - 화이트보드 페이지를 렌더링
// - 스크린샷 캡처
// - Vercel Blob에 업로드
// - thumbnailUrl 업데이트
```

**필요한 라이브러리**:
- `html2canvas`: 클라이언트 사이드 캡처
- `puppeteer` 또는 `playwright`: 서버 사이드 캡처 (더 정확하지만 리소스 소모 큼)

**트리거 시점**:
- 파일 저장 시 자동 생성
- 주기적 업데이트 (예: 5분마다)
- 사용자가 "썸네일 업데이트" 버튼 클릭

---

### 방안 2: 수동 썸네일 업로드

**개념**: 사용자가 직접 이미지를 업로드하여 썸네일로 설정

**장점**:
- 구현 간단
- 사용자가 원하는 이미지 선택 가능

**단점**:
- 사용자 개입 필요
- 화이트보드 내용과 불일치 가능

**구현 방법**:
```typescript
// 파일 카드에 "썸네일 설정" 버튼 추가
// - 이미지 업로드 다이얼로그
// - /api/upload 엔드포인트 사용
// - /api/studios/[studioId]/files/[fileId] PATCH로 thumbnailUrl 업데이트
```

**UI 위치**:
- 파일 카드 호버 시 "썸네일 설정" 버튼 표시
- 또는 파일 편집 다이얼로그에 썸네일 업로드 섹션 추가

---

### 방안 3: 하이브리드 (자동 + 수동)

**개념**: 자동 프리뷰를 기본으로 하되, 사용자가 수동으로 변경 가능

**장점**:
- 자동화의 편리함 + 사용자 제어권
- 피그마와 유사한 동작

**구현**:
- 방안 1 + 방안 2 결합
- 기본값: 자동 프리뷰
- 사용자가 수동 업로드 시 자동 업데이트 중지

---

## 추천 구현 순서

### Phase 1: 수동 업로드 (빠른 구현)
1. 파일 카드에 썸네일 업로드 버튼 추가
2. 이미지 업로드 API 연동
3. 파일 업데이트 API에 썸네일 업로드 기능 추가
4. **예상 시간**: 2-3시간

### Phase 2: 자동 프리뷰 (장기)
1. React Flow 캔버스 캡처 기능 구현
2. 파일 저장 시 자동 썸네일 생성
3. 백그라운드 작업으로 주기적 업데이트
4. **예상 시간**: 1-2일

---

## 기술적 고려사항

### 클라이언트 사이드 캡처
- **html2canvas**: 간단하지만 정확도 낮음, 외부 리소스 로딩 문제
- **React Flow 내장 기능**: `reactFlowInstance.toObject()` 사용 가능
- **Canvas API**: 직접 구현 가능하지만 복잡

### 서버 사이드 캡처
- **Puppeteer/Playwright**: 정확하지만 리소스 소모 큼
- **Vercel Edge Functions**: 제한적 (Puppeteer 사용 불가)
- **별도 서버 필요**: Puppeteer 실행 환경

### 성능 최적화
- 썸네일 크기 제한 (예: 800x600px)
- 캐싱 전략 (변경 없으면 재생성 안 함)
- 비동기 처리 (백그라운드 작업)

---

## 데이터베이스 변경사항

현재 `WorkspaceFile` 모델에 `thumbnailUrl` 필드가 이미 있으므로 추가 변경 불필요.

---

## API 엔드포인트

### 기존 (이미 존재)
- `PATCH /api/studios/[studioId]/files/[fileId]` - 파일 업데이트 (thumbnailUrl 포함)

### 추가 필요 (자동 프리뷰용)
- `POST /api/studios/[studioId]/files/[fileId]/thumbnail` - 썸네일 생성/업데이트

---

## UI 변경사항

### 파일 카드
- 호버 시 "썸네일 설정" 버튼 표시 (수동 업로드)
- 또는 파일 편집 다이얼로그에 썸네일 섹션 추가

### 파일 편집
- 썸네일 미리보기
- 썸네일 업로드/삭제 기능
- "자동 프리뷰 사용" 토글 (하이브리드 방식)

---

## 결론

**즉시 구현 가능**: 방안 2 (수동 업로드)
**장기 목표**: 방안 3 (하이브리드)

가장 실용적인 접근은 먼저 수동 업로드를 구현하고, 이후 자동 프리뷰 기능을 추가하는 것입니다.

