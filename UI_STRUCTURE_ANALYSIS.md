# UI 구조 분석 및 개선 방향

**작성일**: 2025-01-16  
**목적**: 페이지별 호출 및 노출 혼란 최소화를 위한 구조적 개선  
**원칙**: 백엔드/스키마 변경 없이 UI 레벨에서만 개선

---

## 🔍 현재 문제점 분석

### 1. 조건부 렌더링의 복잡성

**현재 구조의 문제점**:

#### A. 사이드바 표시 조건이 여러 곳에 분산
- `DiscordStyleSidebar.tsx`: `pathname`, `selectedChannel`, `isWorkspaceFilePage`, `isTablet` 등으로 조건부 렌더링
- `LeftSidebar.tsx`: `sidebarType`, `isWorkspacePage`, `isSettingsPage` 등으로 조건부 렌더링
- 각 페이지 컴포넌트: `setDiscordSidebar` 호출로 사이드바 상태 관리

#### B. 상태 관리의 불일치
- Context (`discordData.selectedChannel`)와 실제 pathname이 동기화되지 않을 수 있음
- 각 페이지에서 개별적으로 `setDiscordSidebar` 호출
- 조건이 복잡하고 중복됨

#### C. 페이지별 개별 설정
- `StudioDetailContent.tsx`: `setDiscordSidebar` 호출
- `WorkspaceDashboard`: `setDiscordSidebar` 호출
- `WorkspaceFilePage`: `setDiscordSidebar` 호출
- 각각 다른 로직으로 사이드바 설정

---

## 🎯 개선 방향

### 방향 1: 중앙화된 라우트 기반 렌더링 시스템

**핵심 아이디어**:
- pathname을 단일 소스로 사용
- Context는 pathname을 읽어서 자동으로 사이드바 상태 결정
- 각 페이지에서 `setDiscordSidebar` 호출 불필요

**장점**:
- 단일 소스의 진실 (pathname)
- 조건부 로직 중앙화
- 페이지별 개별 설정 불필요

**구현 방향**:
```typescript
// SidebarContext에서 pathname을 읽어서 자동으로 사이드바 상태 결정
const pathname = usePathname();
const sidebarConfig = useMemo(() => {
  // pathname 기반으로 사이드바 설정 자동 결정
  if (pathname?.includes('/workspace/')) {
    return { type: 'discord', showRightColumn: false, ... };
  }
  if (pathname?.includes('/studios/') && !pathname?.includes('/workspace')) {
    return { type: 'discord', showRightColumn: true, ... };
  }
  // ...
}, [pathname]);
```

---

### 방향 2: 레이아웃 기반 컴포넌트 구조

**핵심 아이디어**:
- 각 라우트 그룹별로 레이아웃 컴포넌트 생성
- 레이아웃에서 사이드바 렌더링 결정
- 페이지 컴포넌트는 콘텐츠만 담당

**장점**:
- 라우트 그룹별로 명확한 구조
- 조건부 로직이 레이아웃에 집중
- 페이지 컴포넌트 단순화

**구현 방향**:
```
studios/
  layout.tsx (스튜디오 공통 레이아웃)
  [studioId]/
    layout.tsx (스튜디오 상세 레이아웃)
    page.tsx (스튜디오 메인)
    workspace/
      layout.tsx (워크스페이스 레이아웃)
      page.tsx (대시보드)
      [fileId]/
        layout.tsx (파일 레이아웃)
        page.tsx (화이트보드)
```

---

### 방향 3: 통합된 사이드바 컴포넌트

**핵심 아이디어**:
- 하나의 통합 사이드바 컴포넌트
- 내부에서 pathname을 읽어서 자동으로 적절한 UI 표시
- 조건부 로직을 컴포넌트 내부로 캡슐화

**장점**:
- 사이드바 로직이 한 곳에 집중
- 외부에서 사이드바 상태 관리 불필요
- 조건 변경 시 한 곳만 수정

**구현 방향**:
```typescript
// UnifiedSidebar.tsx
export default function UnifiedSidebar() {
  const pathname = usePathname();
  
  // pathname 기반으로 자동 결정
  const config = useMemo(() => {
    // 복잡한 조건부 로직을 여기서 처리
  }, [pathname]);
  
  return (
    <div>
      {/* 서버 리스트 (항상 표시) */}
      <ServerList />
      
      {/* 우측 칼럼 (조건부) */}
      {config.showRightColumn && <RightColumn />}
    </div>
  );
}
```

---

## 📊 비교 분석

| 항목 | 현재 구조 | 방향 1 (중앙화) | 방향 2 (레이아웃) | 방향 3 (통합) |
|------|----------|----------------|------------------|--------------|
| 조건부 로직 위치 | 여러 곳 분산 | Context 중앙화 | 레이아웃에 집중 | 컴포넌트 내부 |
| 페이지별 설정 | 필요 | 불필요 | 불필요 | 불필요 |
| 단일 소스 | 없음 | pathname | 레이아웃 | pathname |
| 복잡도 | 높음 | 중간 | 낮음 | 낮음 |
| 유지보수성 | 낮음 | 중간 | 높음 | 높음 |

---

## 💡 권장 방향

### 방향 3: 통합된 사이드바 컴포넌트 (권장)

**이유**:
1. **가장 단순**: 조건부 로직이 한 곳에 집중
2. **자동화**: pathname 기반 자동 결정으로 수동 설정 불필요
3. **유지보수 용이**: 조건 변경 시 한 곳만 수정
4. **기존 구조 최소 변경**: 레이아웃 구조 변경 없이 컴포넌트만 통합

**구현 단계**:
1. `UnifiedSidebar.tsx` 생성 (pathname 기반 자동 결정)
2. `LeftSidebar.tsx`를 `UnifiedSidebar`로 교체
3. 각 페이지에서 `setDiscordSidebar` 호출 제거
4. Context는 읽기 전용으로 변경 (pathname 기반 자동 결정)

---

## 🚀 구체적 구현 계획

### Phase 1: 통합 사이드바 컴포넌트 생성

**목표**: pathname 기반으로 자동으로 사이드바 상태를 결정하는 컴포넌트 생성

**구현 내용**:
- `UnifiedSidebar.tsx` 생성
- pathname을 읽어서 자동으로 사이드바 설정 결정
- 서버 리스트 + 우측 칼럼을 하나의 컴포넌트로 통합

### Phase 2: 기존 사이드바 교체

**목표**: `LeftSidebar`와 `DiscordStyleSidebar`를 `UnifiedSidebar`로 교체

**구현 내용**:
- `LeftSidebar.tsx`를 `UnifiedSidebar`로 교체
- `DiscordStyleSidebar.tsx` 로직을 `UnifiedSidebar`로 통합
- 조건부 로직을 컴포넌트 내부로 이동

### Phase 3: 페이지별 설정 제거

**목표**: 각 페이지에서 `setDiscordSidebar` 호출 제거

**구현 내용**:
- `StudioDetailContent.tsx`에서 `setDiscordSidebar` 제거
- `WorkspaceDashboard`에서 `setDiscordSidebar` 제거
- `WorkspaceFilePage`에서 `setDiscordSidebar` 제거
- Context는 읽기 전용으로 변경

### Phase 4: 검증 및 정리

**목표**: 모든 페이지에서 사이드바가 정상 작동하는지 확인

**검증 항목**:
- [ ] 스튜디오 메인 페이지 (posts, calendar, notes)
- [ ] 워크스페이스 대시보드
- [ ] 워크스페이스 파일 페이지
- [ ] 설정 페이지
- [ ] 모바일/테블릿 반응형

---

## 📝 예상 효과

### 개선 전
- 각 페이지에서 `setDiscordSidebar` 호출 필요
- 조건부 로직이 여러 곳에 분산
- pathname과 Context 동기화 문제 가능
- 새로운 페이지 추가 시 사이드바 설정 필요

### 개선 후
- 페이지 컴포넌트는 콘텐츠만 담당
- 사이드바 로직이 한 곳에 집중
- pathname 기반 자동 결정으로 동기화 문제 없음
- 새로운 페이지 추가 시 자동으로 적절한 사이드바 표시

---

## ⚠️ 주의사항

1. **기존 기능 보존**: 모든 기존 기능이 정상 작동해야 함
2. **점진적 전환**: 한 번에 모든 것을 바꾸지 않고 단계적으로
3. **검증 필수**: 각 단계마다 모든 페이지에서 테스트
4. **백엔드 변경 없음**: UI 레벨에서만 변경

---

**이 분석은 UI 구조 개선을 위한 방향을 제시합니다. 구체적인 구현은 사용자 승인 후 진행합니다.**

---

**작성자**: AI Assistant  
**검토자**: Junseo Park  
**최종 업데이트**: 2025-01-16

