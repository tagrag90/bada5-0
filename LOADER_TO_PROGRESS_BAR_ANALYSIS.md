# 원형 로더 → 피그마 스타일 프로그레스 바로 변경 방안 분석

**작성일**: 2025-01-00  
**프로젝트**: Studio_bada (divetobada.com)  
**분석 대상**: 원형 로더(Loader2) → 피그마 스타일 프로그레스 바 전환

---

## 1. 현재 상태 분석

### 1.1 사용 중인 원형 로더

프로젝트 내에서 `Loader2` (lucide-react)와 `animate-spin` 클래스를 사용하는 원형 로더가 광범위하게 사용되고 있습니다.

#### 주요 사용 위치:

1. **LoadingButton 컴포넌트** (`src/components/LoadingButton.tsx`)
   - 버튼 내부 로딩 상태 표시
   - `Loader2` 아이콘 + `animate-spin` 사용
   - 사용처: 폼 제출, 데이터 저장 등

2. **페이지 로딩 컴포넌트**
   - `src/app/loading.tsx`
   - `src/app/(main)/loading.tsx`
   - Next.js Suspense 경계에서 사용

3. **RefreshIndicator** (`src/components/RefreshIndicator.tsx`)
   - `RefreshCw` 아이콘 사용
   - 피드 새로고침 상태 표시

4. **SSO 인증 페이지** (`src/app/(main)/auth/sso/page.tsx`)
   - 전체 화면 로딩 표시

5. **파일 업로드 진행률** (`src/components/posts/editor/PostEditor.tsx`)
   - **현재 혼합 사용**: `Loader2` 아이콘 + 프로그레스 바 함께 표시
   - `uploadProgress` 상태로 진행률 추적 중

6. **기타 컴포넌트들** (16개 파일)
   - `WhoToFollowSlot`, `PostEditor`, `AddToNodeDialog`, `CommentInput`
   - `FollowListModal`, `FeedRightSidebar`, `VesselIntegration` 등
   - 주로 Suspense fallback이나 데이터 로딩 중 표시

### 1.2 현재 프로그레스 바 상태

프로젝트에 이미 `@radix-ui/react-progress` 기반의 `Progress` 컴포넌트가 존재합니다:
- 위치: `src/components/ui/progress.tsx`
- 현재 사용: `PostEditor`에서 파일 업로드 진행률 표시에만 사용
- 스타일: 기본 shadcn/ui 스타일 (h-4, rounded-full)

---

## 2. 피그마 스타일 프로그레스 바 개요

### 2.1 피그마 스타일 특징

피그마(Figma)의 로딩 프로그레스 바는 다음과 같은 특징을 가집니다:

1. **상단 고정형 프로그레스 바**
   - 화면 최상단에 얇은 바(2-4px 높이)
   - 전체 화면 너비를 차지
   - 부드러운 애니메이션 효과

2. **무한 로딩 표시**
   - 진행률을 알 수 없을 때: 부드러운 슬라이딩 애니메이션
   - 진행률을 알 수 있을 때: 실제 진행률 표시

3. **시각적 특징**
   - 얇고 미니멀한 디자인
   - 부드러운 그라데이션 또는 단색
   - `ease-in-out` 또는 `ease` 트랜지션

### 2.2 디자인 예시

```
┌─────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← 상단 고정 (2-4px)
├─────────────────────────────────────────┤
│                                         │
│         페이지 콘텐츠                    │
│                                         │
```

---

## 3. 변경 방안

### 3.1 전략: 단계적 마이그레이션

#### Phase 1: 새로운 피그마 스타일 프로그레스 바 컴포넌트 생성

**새 컴포넌트**: `FigmaProgressBar` 또는 `TopProgressBar`

**위치**: `src/components/ui/figma-progress-bar.tsx`

**특징**:
- 화면 최상단에 고정 (`fixed top-0`)
- 얇은 높이 (2-4px)
- 전체 화면 너비
- 무한 로딩 모드 (indeterminate) 지원
- 유한 로딩 모드 (progress) 지원

#### Phase 2: 사용 케이스별 분류 및 적용

**A. 진행률을 알 수 있는 경우 (Determinate)**
- 파일 업로드 (`PostEditor`)
- 이미 프로그레스 바 사용 중 → 스타일만 개선

**B. 진행률을 알 수 없는 경우 (Indeterminate)**
- 페이지 로딩 (`loading.tsx`)
- 버튼 로딩 (`LoadingButton`)
- API 호출 대기
- 데이터 페칭 중

**C. 특수 케이스 (유지 또는 별도 처리)**
- `RefreshIndicator`: 현재 디자인 적합, 유지 가능
- `SSO 인증 페이지`: 전체 화면 로딩, 별도 처리 고려

### 3.2 구현 방안

#### 옵션 1: 전역 상단 프로그레스 바 (추천)

**장점**:
- 피그마 스타일과 가장 유사
- 일관된 UX 제공
- 구현이 단순

**구현**:
```typescript
// src/components/ui/figma-progress-bar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function FigmaProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100">
      <div className="h-full bg-blue-600 animate-progress" />
    </div>
  );
}
```

**적용**:
- `src/app/layout.tsx`에 추가
- 모든 페이지 로딩에 자동 적용

#### 옵션 2: 컴포넌트별 프로그레스 바

**장점**:
- 더 세밀한 제어 가능
- 컴포넌트별로 다른 스타일 적용 가능

**단점**:
- 각 컴포넌트에 개별 적용 필요
- 일관성 유지가 어려움

#### 옵션 3: 하이브리드 접근 (최종 추천)

**구조**:
1. **전역 상단 프로그레스 바**: 페이지 네비게이션, 전체 로딩
2. **컴포넌트별 프로그레스 바**: 파일 업로드, 특정 작업 진행률
3. **기존 원형 로더 유지**: 버튼 내부, 작은 인라인 로딩

---

## 4. 영향 받는 컴포넌트 목록

### 4.1 즉시 변경 필요 (원형 로더 → 프로그레스 바)

| 컴포넌트 | 현재 상태 | 변경 방안 |
|---------|---------|----------|
| `src/app/loading.tsx` | `Loader2` | → 전역 상단 프로그레스 바 |
| `src/app/(main)/loading.tsx` | `Loader2` | → 전역 상단 프로그레스 바 |
| `src/app/(main)/auth/sso/page.tsx` | `Loader2` | → 상단 프로그레스 바 + 메시지 |

### 4.2 점진적 변경 (기존 유지 → 점진적 교체)

| 컴포넌트 | 현재 상태 | 변경 방안 |
|---------|---------|----------|
| `LoadingButton` | `Loader2` + 텍스트 | → 버튼 내부 프로그레스 바 (선택적) |
| `PostEditor` | `Loader2` + 프로그레스 바 | → 프로그레스 바만 사용 (Loader2 제거) |
| `WhoToFollowSlot` | `Loader2` (Suspense) | → 전역 프로그레스 바 적용 |
| `AddToNodeDialog` | `Loader2` | → 전역 프로그레스 바 또는 유지 |

### 4.3 유지 (원형 로더 그대로)

| 컴포넌트 | 현재 상태 | 유지 이유 |
|---------|---------|----------|
| `RefreshIndicator` | `RefreshCw` | 현재 디자인 적합, 별도 인디케이터 |
| 작은 인라인 로딩 | `Loader2` | 버튼 내부 등 작은 공간 |

---

## 5. 기술적 구현 세부사항

### 5.1 필요한 컴포넌트

#### 1. `FigmaProgressBar` 컴포넌트

```typescript
// src/components/ui/figma-progress-bar.tsx
"use client";

import { cn } from "@/lib/utils";

interface FigmaProgressBarProps {
  value?: number; // 0-100, undefined면 무한 로딩
  className?: string;
  variant?: "top" | "inline"; // top: 상단 고정, inline: 컴포넌트 내부
}

export function FigmaProgressBar({
  value,
  className,
  variant = "top",
}: FigmaProgressBarProps) {
  const isIndeterminate = value === undefined;

  return (
    <div
      className={cn(
        variant === "top"
          ? "fixed top-0 left-0 right-0 z-[9999] h-1"
          : "relative w-full h-1",
        "bg-gray-100 overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-blue-600 transition-all duration-300 ease-out",
          isIndeterminate
            ? "animate-progress-indeterminate w-1/3"
            : "w-full"
        )}
        style={
          !isIndeterminate
            ? { transform: `translateX(-${100 - (value || 0)}%)` }
            : undefined
        }
      />
    </div>
  );
}
```

#### 2. Tailwind CSS 애니메이션 추가

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        'progress-indeterminate': 'progress-indeterminate 1.5s ease-in-out infinite',
      },
    },
  },
}
```

#### 3. 전역 프로그레스 바 훅 (선택적)

```typescript
// src/hooks/useProgressBar.ts
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return isLoading;
}
```

---

## 6. 장단점 분석

### 6.1 장점

1. **일관된 UX**
   - 피그마와 유사한 현대적인 로딩 경험
   - 사용자에게 친숙한 인터페이스

2. **시각적 피드백 향상**
   - 진행률을 알 수 있는 경우 명확한 피드백
   - 무한 로딩 시에도 부드러운 애니메이션

3. **공간 효율성**
   - 원형 로더보다 화면 공간을 덜 차지
   - 상단 고정형은 콘텐츠를 가리지 않음

4. **접근성**
   - 스크린 리더에서 진행률 정보 제공 가능
   - ARIA 속성 추가 용이

### 6.2 단점

1. **기존 코드 변경 필요**
   - 16개 이상의 컴포넌트 수정 필요
   - 테스트 범위 확대

2. **디자인 일관성**
   - 모든 상황에 프로그레스 바가 적합하지 않을 수 있음
   - 작은 버튼 내부 등은 원형 로더가 더 적합할 수 있음

3. **성능 고려**
   - 전역 프로그레스 바는 모든 페이지에 렌더링
   - 무한 로딩 애니메이션은 지속적인 리플로우 발생 가능

4. **사용자 선호도**
   - 일부 사용자는 원형 로더를 선호할 수 있음

---

## 7. 구현 우선순위

### Phase 1: 기본 인프라 (높은 우선순위)
1. ✅ `FigmaProgressBar` 컴포넌트 생성
2. ✅ Tailwind 애니메이션 추가
3. ✅ 전역 레이아웃에 적용 (`src/app/layout.tsx`)

### Phase 2: 페이지 로딩 적용 (높은 우선순위)
1. ✅ `src/app/loading.tsx` 수정
2. ✅ `src/app/(main)/loading.tsx` 수정
3. ✅ `SSO 인증 페이지` 수정

### Phase 3: 파일 업로드 개선 (중간 우선순위)
1. ✅ `PostEditor`에서 `Loader2` 제거, 프로그레스 바만 사용
2. ✅ 업로드 진행률 표시 개선

### Phase 4: 기타 컴포넌트 (낮은 우선순위)
1. ⚠️ `LoadingButton` 선택적 적용 (버튼 내부는 원형 로더 유지 가능)
2. ⚠️ Suspense fallback 컴포넌트들 점진적 적용

---

## 8. 추천 방안

### 최종 추천: 하이브리드 접근법

1. **전역 상단 프로그레스 바**
   - 페이지 네비게이션, 전체 로딩
   - `src/app/layout.tsx`에 추가

2. **컴포넌트별 프로그레스 바**
   - 파일 업로드 등 진행률 알 수 있는 경우
   - 인라인 스타일로 표시

3. **원형 로더 유지**
   - 버튼 내부 작은 로딩
   - 인라인 작은 인디케이터
   - `RefreshIndicator` 등 특수 케이스

### 구현 예시

```typescript
// 전역 프로그레스 바 (상단 고정)
<FigmaProgressBar variant="top" />

// 컴포넌트별 프로그레스 바 (인라인)
<FigmaProgressBar variant="inline" value={uploadProgress} />

// 원형 로더 (작은 공간)
<Loader2 className="h-4 w-4 animate-spin" />
```

---

## 9. 다음 단계

1. **승인 후 구현 시작**
   - Phase 1부터 순차적 구현
   - 각 Phase별 테스트 및 검증

2. **디자인 검토**
   - 피그마 스타일 프로그레스 바 디자인 확인
   - 색상, 높이, 애니메이션 속도 조정

3. **사용자 테스트**
   - 변경 후 사용자 피드백 수집
   - 필요시 추가 조정

---

**작성자**: AI Assistant  
**Copyright**: © 2025 Studio_bada. All Rights Reserved.

