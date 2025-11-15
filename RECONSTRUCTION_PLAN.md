# 워크스페이스 파일 시스템 재구축 계획

**작성일**: 2025-01-16  
**목적**: 소실된 작업물을 안전하게 재구축  
**원칙**: 기존 프로젝트 손상 방지, 단계별 구현, 각 단계마다 검증

---

## 📋 소실된 작업물 목록

### 1. 데이터베이스 스키마
- ❌ `WorkspaceFile` 모델 (추정)
- ❌ `ProjectNode.fileId` 필드 (추정)
- ❌ `NodeEdge.fileId` 필드 (추정)
- ❌ `Studio.files` 관계 (추정)

### 2. API Routes
- ❌ `src/app/api/studios/[studioId]/files/route.ts` (GET, POST)
- ❌ `src/app/api/studios/[studioId]/files/[fileId]/route.ts` (GET, PATCH, DELETE)
- ❌ `src/app/api/studios/[studioId]/nodes/route.ts`의 `fileId` 필터링 로직
- ❌ `src/app/api/studios/[studioId]/edges/route.ts`의 `fileId` 필터링 로직

### 3. Pages
- ❌ `src/app/(main)/studios/[studioId]/workspace/page.tsx` (대시보드)
- ❌ `src/app/(main)/studios/[studioId]/workspace/[fileId]/page.tsx` (파일별 화이트보드)
- ❌ `src/app/(main)/studios/[studioId]/workspace/[fileId]/WorkspaceFileHeader.tsx` (파일 헤더)

### 4. 컴포넌트 수정사항
- ❌ `StudioWorkspace.tsx`의 `fileId` prop 및 연동 로직
- ❌ `StudioDetailContent.tsx`의 워크스페이스 리다이렉트 로직
- ❌ 기타 관련 컴포넌트 수정사항

---

## 🔍 이전 구축 과정에서 발생한 문제점

### 1. UI 손상 문제
- **문제**: 작업 중 UI가 조각조각 손상됨
- **원인**: 
  - 기존 코드를 충분히 이해하지 않고 수정
  - 반응형 디자인 무시
  - 인덴트/구조 문제로 인한 렌더링 오류
- **재발 방지**: 
  - 기존 코드 구조 완전 이해 후 수정
  - 작은 단위로 나누어 수정
  - 각 수정 후 빌드/렌더링 확인

### 2. 에러 다발 문제
- **문제**: 화이트보드 진입 시 에러 다발
- **원인**:
  - `isWorkspaceFilePage` 계산 로직 문제
  - `nodeTypes` 정의 불완전
  - `onNodeClick` 핸들러 누락
- **재발 방지**:
  - 모든 의존성 배열 정확히 설정
  - 필수 핸들러 모두 구현
  - 타입 안정성 확보

### 3. 기존 기능 손상
- **문제**: 기존 기능이 작동하지 않음
- **원인**:
  - 기존 코드를 과도하게 수정
  - 조건부 렌더링 로직 변경
  - 라우팅 로직 변경
- **재발 방지**:
  - 기존 코드는 최소한만 수정
  - 새로운 기능은 별도 파일로 구현
  - 기존 기능 테스트 유지

---

## 🛡️ 안전한 재구축 방안

### 원칙
1. **기존 프로젝트 손상 절대 방지**
2. **단계별 구현 및 검증**
3. **각 단계마다 백업 및 커밋**
4. **기존 기능 보존 우선**

### 단계별 구현 계획

#### Phase 1: 데이터베이스 스키마 (가장 안전)
**목표**: `WorkspaceFile` 모델 추가 및 관계 설정

**절차**:
1. 현재 스키마 백업
2. `WorkspaceFile` 모델 추가 (nullable 관계로 시작)
3. `ProjectNode.fileId` 추가 (nullable)
4. `NodeEdge.fileId` 추가 (nullable)
5. 마이그레이션 생성 및 검토
6. 로컬에서만 마이그레이션 실행
7. 빌드/타입 체크 확인

**검증**:
- ✅ Prisma 스키마 문법 오류 없음
- ✅ 타입 체크 통과
- ✅ 빌드 성공

**위험도**: 🟢 낮음 (스키마만 추가, 기존 데이터 영향 없음)

---

#### Phase 2: API Routes (안전)
**목표**: 파일 관리 API 구현

**절차**:
1. `src/app/api/studios/[studioId]/files/route.ts` 생성
   - GET: 파일 목록 조회
   - POST: 파일 생성
2. `src/app/api/studios/[studioId]/files/[fileId]/route.ts` 생성
   - GET: 파일 상세 조회
   - PATCH: 파일 수정
   - DELETE: 파일 삭제
3. 기존 nodes/edges API에 `fileId` 필터링 추가 (기존 로직 보존)
4. 각 API 테스트
5. 빌드/타입 체크 확인

**검증**:
- ✅ API 엔드포인트 정상 작동
- ✅ 인증/권한 체크 정상
- ✅ 기존 API 영향 없음
- ✅ 빌드 성공

**위험도**: 🟡 중간 (새 API 추가, 기존 API 수정 최소화)

---

#### Phase 3: 워크스페이스 대시보드 페이지 (주의)
**목표**: 파일 목록을 보여주는 대시보드

**절차**:
1. `src/app/(main)/studios/[studioId]/workspace/page.tsx` 생성
   - 파일 목록 표시
   - 파일 생성 기능
   - 파일 클릭 시 파일 페이지로 이동
2. `StudioDetailContent.tsx` 수정 (최소한만)
   - workspace 탭 클릭 시 대시보드로 리다이렉트
3. 빌드/렌더링 확인

**검증**:
- ✅ 페이지 정상 렌더링
- ✅ 파일 목록 표시 정상
- ✅ 파일 생성 기능 정상
- ✅ 기존 페이지 영향 없음
- ✅ 빌드 성공

**위험도**: 🟡 중간 (새 페이지 추가, 기존 라우팅 최소 수정)

---

#### Phase 4: 파일별 화이트보드 페이지 (주의)
**목표**: 파일별 화이트보드 구현

**절차**:
1. `src/app/(main)/studios/[studioId]/workspace/[fileId]/page.tsx` 생성
   - 파일 헤더 포함
   - `StudioWorkspace`에 `fileId` 전달
2. `WorkspaceFileHeader.tsx` 생성
   - 파일 이름 표시/편집
   - 대시보드로 돌아가기 버튼
3. `StudioWorkspace.tsx` 수정 (최소한만)
   - `fileId` prop 추가
   - `fileId`를 API 호출에 포함
   - 기존 로직 보존 (fileId 없을 때도 작동)
4. 빌드/렌더링 확인

**검증**:
- ✅ 파일 페이지 정상 렌더링
- ✅ 파일 헤더 정상 작동
- ✅ 화이트보드에 파일별 노드 표시
- ✅ 기존 화이트보드 기능 영향 없음
- ✅ 빌드 성공

**위험도**: 🟠 높음 (기존 컴포넌트 수정 필요)

---

#### Phase 5: 사이드바 및 UI 조정 (매우 주의)
**목표**: 화이트보드 진입 시 사이드바 조정

**절차**:
1. `DiscordStyleSidebar.tsx` 수정 (최소한만)
   - 화이트보드 파일 페이지 감지
   - 우측 칼럼 숨김 로직 추가
2. `LeftSidebar.tsx` 수정 (최소한만)
   - 사이드바 너비 조정 로직
3. `WorkspaceFileHeader.tsx` 위치 조정
4. 빌드/렌더링 확인

**검증**:
- ✅ 사이드바 정상 작동
- ✅ 화이트보드 크기 정상 조정
- ✅ 파일 헤더 정상 표시
- ✅ 기존 사이드바 기능 영향 없음
- ✅ 빌드 성공

**위험도**: 🔴 매우 높음 (UI 전반에 영향)

---

## 🔒 안전장치

### 1. 각 Phase 전 필수 절차
```bash
# 1. Git 상태 확인
git status

# 2. 현재 상태 커밋 (작업 전)
git add .
git commit -m "백업: Phase X 시작 전"

# 3. 백업 브랜치 생성
git branch backup-phase-X-$(date +%Y%m%d_%H%M%S)
```

### 2. 각 Phase 후 필수 절차
```bash
# 1. 빌드 확인
npm run build

# 2. 타입 체크
npx tsc --noEmit

# 3. 린터 확인
npm run lint

# 4. Git 커밋 (성공 시)
git add .
git commit -m "feat: Phase X 완료 - [작업 내용]"
```

### 3. 문제 발생 시 대응
1. **즉시 중단**
2. **문제 파악**
3. **백업 브랜치로 복구**
4. **문제 해결 후 재시도**

### 4. 기존 기능 보존 원칙
- ✅ 기존 코드는 최소한만 수정
- ✅ 새로운 기능은 별도 파일로 구현
- ✅ 조건부 로직으로 기존 기능 보존
- ✅ 각 수정 후 기존 기능 테스트

---

## 📝 구현 시 주의사항

### 1. 코드 수정 원칙
- **기존 코드 보존**: 기존 로직은 그대로 유지
- **조건부 확장**: `fileId`가 있을 때만 새 로직 실행
- **하위 호환성**: `fileId` 없을 때도 기존처럼 작동

### 2. UI 수정 원칙
- **기존 스타일 유지**: 기존 디자인 시스템 준수
- **반응형 보존**: 기존 반응형 로직 유지
- **점진적 개선**: 작은 단위로 나누어 수정

### 3. 에러 방지 원칙
- **타입 안정성**: 모든 타입 명시
- **null 체크**: nullable 필드 항상 체크
- **에러 핸들링**: 모든 API 호출에 에러 처리

---

## ✅ 검증 체크리스트

각 Phase 완료 후 다음을 확인:

- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] 린터 에러 없음 (`npm run lint`)
- [ ] 기존 기능 정상 작동
- [ ] 새 기능 정상 작동
- [ ] UI 손상 없음
- [ ] 에러 없음
- [ ] Git 커밋 완료

---

## 🎯 최종 목표

1. ✅ 워크스페이스 파일 시스템 완전 구현
2. ✅ 기존 프로젝트 기능 100% 보존
3. ✅ UI 손상 없음
4. ✅ 에러 없음
5. ✅ 안정적인 동작

---

**이 계획서는 재구축 작업의 가이드라인입니다. 각 Phase는 반드시 순서대로 진행하며, 각 단계마다 검증을 완료한 후 다음 단계로 진행해야 합니다.**

---

**작성자**: AI Assistant  
**검토자**: Junseo Park  
**최종 업데이트**: 2025-01-16

