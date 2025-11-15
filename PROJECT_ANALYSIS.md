# Divetobada 프로젝트 전체 분석

**작성일**: 2025-01-15  
**프로젝트**: Divetobada (divetobada.com)  
**목적**: 독스 전면 개편을 위한 프로젝트 구조 분석

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개
Divetobada는 크리에이터와 팬을 직접 연결하는 엔터테인먼트 플랫폼입니다. 소속사 없이도 주도권을 가지고 활동하며 팬들과 소통할 수 있는 공간을 제공합니다.

### 1.2 핵심 가치
- 크리에이터 자율성
- 직접적인 팬-크리에이터 소통
- 확장 가능한 워크스페이스 시스템
- SDK를 통한 커스터마이징

---

## 2. 기술 스택

### 2.1 프론트엔드
- **프레임워크**: Next.js 15.1.2 (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: React 18.3.1
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI (shadcn/ui 기반)
- **상태 관리**: React Query (@tanstack/react-query)
- **에디터**: Tiptap
- **화이트보드**: React Flow 11.11.4
- **아이콘**: Lucide React

### 2.2 백엔드
- **런타임**: Node.js
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma 5.16.1
- **인증**: Lucia Auth 3.2.0
- **OAuth**: Arctic (Google OAuth)
- **파일 스토리지**: Vercel Blob
- **유효성 검사**: Zod

### 2.3 인프라
- **배포**: Vercel
- **도메인**: divetobada.com
- **푸시 알림**: APN (Apple Push Notification)

---

## 3. 주요 기능

### 3.1 인증 시스템
- 이메일/비밀번호 회원가입 및 로그인
- Google OAuth 로그인
- 세션 관리 (Lucia)
- SSO 통합 (Login with Divetobada)

### 3.2 소셜 미디어 기능
- 게시물 작성/수정/삭제
- 리치 텍스트 에디터 (Tiptap)
- 이미지/비디오 업로드
- 링크 미리보기
- 댓글 시스템
- 좋아요/북마크/리포스트
- 팔로우/언팔로우
- 알림 시스템
- 검색 기능

### 3.3 스튜디오 시스템
- 스튜디오 생성 및 관리
- 멤버 관리 (OWNER, ADMIN, MODERATOR, MEMBER)
- 구독 시스템
- 스튜디오별 게시물 관리
- 캘린더/일정 관리
- 노트 관리
- 워크스페이스 (화이트보드)

### 3.4 워크스페이스 노드 시스템
- React Flow 기반 화이트보드
- 노드 타입: PLANNING, NOTE, SCHEDULE, RESOURCE, POST, PHOTO
- 노드 연결 (Edge)
- 파일 시스템 (WorkspaceFile)
- 노드 편집 및 삭제
- 드래그 앤 드롭
- 향후: SDK 기반 커스텀 노드

### 3.5 베타 기능
- 티켓팅 시스템 (Event, Ticket)
- 멤버십 결제 시스템
- 크리에이터 대시보드

---

## 4. 아키텍처 구조

### 4.1 레이아웃 시스템
```
┌─────────────────────────────────────────┐
│         LeftSidebarArea (가변)          │
│  ┌─────────┬─────────────────────────┐ │
│  │ Server  │  Content Block          │ │
│  │ List    │  (Docs/Discord/None)    │ │
│  │ (80px)  │  (320px)                 │ │
│  └─────────┴─────────────────────────┘ │
├─────────────────────────────────────────┤
│         MainContent (가변 너비)         │
│         (중앙 정렬, 최대 3xl)           │
├─────────────────────────────────────────┤
│         RightSidebarArea (320px)        │
│         (페이지별 콘텐츠 블록)           │
└─────────────────────────────────────────┘
```

### 4.2 사이드바 시스템
- **LeftSidebarArea**: 가변 너비 (80px 또는 400px)
  - 서버 리스트 (항상 표시, 80px)
  - 콘텐츠 블록 (조건부 표시, 320px)
    - Docs: 독스 네비게이션
    - Discord: 스튜디오 채널 목록
    - None: 콘텐츠 없음

- **RightSidebarArea**: 고정 너비 (320px)
  - 홈: 크리에이터 추천, 브랜드 사이드바
  - 스튜디오: 스튜디오 정보
  - 접기/펼치기 기능 (양쪽 동시 제어)

### 4.3 라우팅 구조
```
/                          # 홈 (피드)
/explore                   # 탐색
/search                    # 검색
/posts/[postId]           # 게시물 상세
/users/[username]         # 사용자 프로필
/studios                  # 스튜디오 목록
/studios/[studioId]      # 스튜디오 메인
/studios/[studioId]/workspace  # 워크스페이스 대시보드
/studios/[studioId]/workspace/[fileId]  # 화이트보드
/studios/[studioId]/settings  # 스튜디오 설정
/settings                 # 사용자 설정
/docs-old                 # 독스 (구)
/docs                     # 독스 (신)
```

### 4.4 API 구조
```
/api/posts/*              # 게시물 API
/api/users/*              # 사용자 API
/api/studios/*            # 스튜디오 API
/api/studios/[studioId]/nodes/*    # 노드 API
/api/studios/[studioId]/edges/*   # 연결선 API
/api/studios/[studioId]/files/*   # 파일 API
/api/auth/*               # 인증 API
/api/sso/*                # SSO API
/api/widget/*             # 위젯 API
```

---

## 5. 데이터베이스 스키마

### 5.1 주요 모델
- **User**: 사용자 정보
- **Post**: 게시물
- **Comment**: 댓글
- **Like**: 좋아요
- **Bookmark**: 북마크
- **Follow**: 팔로우 관계
- **Notification**: 알림
- **Studio**: 스튜디오
- **StudioMember**: 스튜디오 멤버
- **StudioSubscription**: 스튜디오 구독
- **ProjectNode**: 워크스페이스 노드
- **NodeEdge**: 노드 연결선
- **WorkspaceFile**: 워크스페이스 파일
- **Event**: 이벤트
- **Ticket**: 티켓

### 5.2 관계 구조
- User ↔ Post (1:N)
- User ↔ Studio (1:N, 소유)
- Studio ↔ ProjectNode (1:N)
- ProjectNode ↔ NodeEdge (N:M)
- Studio ↔ WorkspaceFile (1:N)

---

## 6. 컴포넌트 구조

### 6.1 레이아웃 컴포넌트
- `LeftSidebarArea`: 좌측 사이드바 영역
- `RightSidebarArea`: 우측 사이드바 영역
- `LeftSidebar`: 좌측 사이드바 콘텐츠
- `ServerList`: 서버 리스트
- `DiscordStyleSidebar`: 디스코드 스타일 사이드바
- `DocsNavSidebar`: 독스 네비게이션
- `SidebarContext`: 사이드바 상태 관리

### 6.2 피드 컴포넌트
- `MainContent`: 메인 콘텐츠 영역
- `ForYouFeed`: 전체 피드
- `FollowingFeed`: 팔로잉 피드
- `Post`: 게시물 컴포넌트
- `BlogPostCard`: 블로그 스타일 게시물 카드

### 6.3 스튜디오 컴포넌트
- `StudioProfileCard`: 스튜디오 프로필 카드
- `StudioWorkspace`: 워크스페이스 화이트보드
- `CustomNode`: 커스텀 노드 컴포넌트
- `NodeSidebar`: 노드 편집 사이드바
- `WorkspaceFileHeader`: 파일 헤더
- `WorkspaceNodeAddBlock`: 노드 추가 블록

### 6.4 UI 컴포넌트
- `Button`, `Card`, `Input`, `Textarea`
- `Dialog`, `Dropdown`, `Tabs`
- `Avatar`, `Badge`, `Toast`

---

## 7. 상태 관리

### 7.1 React Query
- 서버 상태 관리
- 캐싱 및 동기화
- 무한 스크롤
- Optimistic Updates

### 7.2 Context API
- `SidebarContext`: 사이드바 상태
- `SessionProvider`: 세션 정보

### 7.3 로컬 상태
- `useState`, `useEffect`
- 폼 상태 (react-hook-form)

---

## 8. 스타일링

### 8.1 Tailwind CSS
- 유틸리티 퍼스트 접근
- 커스텀 색상 및 스페이싱
- 반응형 디자인 (md, xl 브레이크포인트)

### 8.2 디자인 시스템
- divetobada.com 디자인 언어 준수
- 검정색 테두리 (2px)
- 둥근 모서리 (rounded-lg)
- 호버 효과
- 그림자 효과

---

## 9. 향후 계획

### 9.1 SDK 시스템
- 커스텀 노드 개발 SDK
- 노드 마켓플레이스
- 플러그인 시스템

### 9.2 자동화 시스템
- 워크플로우 실행
- 노드 실행 기능
- 데이터 전달

### 9.3 확장 기능
- 노드 그룹화
- 템플릿 시스템
- 협업 기능

---

## 10. 독스 개편 방향

### 10.1 구조 개편
1. **프로젝트 개요**: 소개, 기술 스택, 아키텍처
2. **시작하기**: 회원가입, 첫 게시물, 스튜디오 생성
3. **아키텍처 가이드**: 레이아웃, 사이드바, 라우팅
4. **인증 시스템**: 로그인, SSO, 세션 관리
5. **소셜 기능**: 게시물, 댓글, 팔로우
6. **스튜디오 시스템**: 생성, 관리, 멤버 관리
7. **워크스페이스**: 노드 시스템, 파일 관리
8. **API 레퍼런스**: 엔드포인트 문서
9. **SDK 가이드**: 커스텀 노드 개발
10. **베타 기능**: 티켓팅, 멤버십

### 10.2 개선 사항
- 실제 컴포넌트 예제 추가
- 코드 예제 보강
- API 문서화
- 아키텍처 다이어그램
- 베스트 프랙티스 가이드

