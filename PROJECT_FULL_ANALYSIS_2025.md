# Divetobada 프로젝트 전체 분석 보고서

**작성일**: 2025-01-16  
**프로젝트**: Divetobada (divetobada.com)  
**분석 목적**: 원활한 작업을 위한 프로젝트 구조 및 현황 파악

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [주요 기능](#4-주요-기능)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [API 구조](#6-api-구조)
7. [컴포넌트 구조](#7-컴포넌트-구조)
8. [라우팅 구조](#8-라우팅-구조)
9. [상태 관리](#9-상태-관리)
10. [현재 개발 상태](#10-현재-개발-상태)
11. [주요 파일 및 설정](#11-주요-파일-및-설정)
12. [개발 환경](#12-개발-환경)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개
**Divetobada**는 크리에이터와 팬을 직접 연결하는 엔터테인먼트 플랫폼입니다. 소속사 없이도 크리에이터가 주도권을 가지고 활동하며 팬들과 소통할 수 있는 공간을 제공합니다.

### 1.2 핵심 가치
- 크리에이터 자율성
- 직접적인 팬-크리에이터 소통
- 확장 가능한 워크스페이스 시스템
- SDK를 통한 커스터마이징

### 1.3 프로젝트 정보
- **도메인**: divetobada.com
- **배포 플랫폼**: Vercel
- **데이터베이스**: PostgreSQL (Prisma ORM)
- **프레임워크**: Next.js 15.1.2 (App Router)

---

## 2. 기술 스택

### 2.1 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 15.1.2 | 프레임워크 (App Router) |
| React | 18.3.1 | UI 라이브러리 |
| TypeScript | ^5 | 프로그래밍 언어 |
| Tailwind CSS | ^3.4.1 | 스타일링 |
| Radix UI | - | UI 컴포넌트 (shadcn/ui 기반) |
| React Query | 5.90.5 | 서버 상태 관리 |
| Tiptap | ^2.4.0 | 리치 텍스트 에디터 |
| React Flow | ^11.11.4 | 화이트보드/워크스페이스 |
| Lucide React | ^0.402.0 | 아이콘 라이브러리 |

### 2.2 백엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | - | 런타임 |
| PostgreSQL | - | 데이터베이스 |
| Prisma | ^5.16.1 | ORM |
| Lucia Auth | ^3.2.0 | 인증 시스템 |
| Arctic | ^1.9.1 | OAuth (Google) |
| Zod | ^3.23.8 | 유효성 검사 |
| Vercel Blob | ^2.0.0 | 파일 스토리지 |

### 2.3 인프라 및 기타
- **배포**: Vercel
- **푸시 알림**: APN (Apple Push Notification)
- **실시간 채팅**: Stream Chat (stream-chat-react)
- **이미지 최적화**: Next.js Image Optimization
- **분석**: Vercel Analytics & Speed Insights

---

## 3. 프로젝트 구조

### 3.1 디렉토리 구조
```
junseo-bada/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   ├── (main)/            # 메인 애플리케이션
│   │   ├── api/               # API 라우트
│   │   ├── docs/              # 문서 페이지
│   │   └── layout.tsx         # 루트 레이아웃
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── layout/            # 레이아웃 컴포넌트
│   │   ├── posts/             # 게시물 관련 컴포넌트
│   │   ├── workspace/         # 워크스페이스 컴포넌트
│   │   └── ui/                # 기본 UI 컴포넌트
│   ├── lib/                   # 유틸리티 및 설정
│   ├── hooks/                 # 커스텀 훅
│   └── assets/                # 정적 자산
├── prisma/                    # Prisma 스키마 및 마이그레이션
├── public/                    # 공개 정적 파일
├── scripts/                   # 유틸리티 스크립트
└── [설정 파일들]
```

### 3.2 주요 디렉토리 설명

#### `src/app/(main)/`
메인 애플리케이션 페이지들:
- `page.tsx`: 홈 피드
- `explore/`: 탐색 페이지
- `search/`: 검색 페이지
- `users/[username]/`: 사용자 프로필
- `studios/`: 스튜디오 관련 페이지
- `settings/`: 사용자 설정
- `notifications/`: 알림 페이지
- `bookmarks/`: 북마크 페이지

#### `src/app/api/`
API 엔드포인트:
- `posts/`: 게시물 CRUD
- `users/`: 사용자 정보
- `studios/`: 스튜디오 관리
- `auth/`: 인증 관련
- `notifications/`: 알림
- `search/`: 검색

#### `src/components/`
재사용 가능한 컴포넌트:
- `layout/`: 사이드바, 헤더 등 레이아웃 컴포넌트
- `posts/`: 게시물 관련 컴포넌트
- `workspace/`: 워크스페이스 노드 컴포넌트
- `ui/`: 기본 UI 컴포넌트 (shadcn/ui)

---

## 4. 주요 기능

### 4.1 인증 시스템
- ✅ 이메일/비밀번호 회원가입 및 로그인
- ✅ Google OAuth 로그인
- ✅ 세션 관리 (Lucia Auth)
- ✅ SSO 통합 (Login with Divetobada)

### 4.2 소셜 미디어 기능
- ✅ 게시물 작성/수정/삭제
- ✅ 리치 텍스트 에디터 (Tiptap)
- ✅ 이미지/비디오 업로드 (Vercel Blob)
- ✅ 링크 미리보기 (OG 태그)
- ✅ 댓글 시스템
- ✅ 좋아요/북마크/리포스트
- ✅ 팔로우/언팔로우
- ✅ 실시간 알림 시스템
- ✅ 검색 기능 (해시태그 지원)

### 4.3 스튜디오 시스템
- ✅ 스튜디오 생성 및 관리
- ✅ 멤버 관리 (OWNER, ADMIN, MODERATOR, MEMBER)
- ✅ 구독 시스템
- ✅ 스튜디오별 게시물 관리
- ✅ 캘린더/일정 관리 (StudioCalendar)
- ✅ 노트 관리 (StudioNotes)
- ✅ 워크스페이스 (화이트보드)

### 4.4 워크스페이스 노드 시스템
**현재 상태: Phase 1 완료**

- ✅ React Flow 기반 화이트보드
- ✅ 노드 타입: PLANNING, NOTE, SCHEDULE, RESOURCE, POST, PHOTO
- ✅ 노드 연결 (Edge)
- ✅ 파일 시스템 (WorkspaceFile)
- ✅ 노드 편집 및 삭제
- ✅ 드래그 앤 드롭
- ✅ 이모지 추가 기능
- 🔄 향후: SDK 기반 커스텀 노드 (Phase 4)
- 🔄 향후: 자동화 시스템 (Phase 3)

### 4.5 베타 기능
- ✅ 티켓팅 시스템 (Event, Ticket)
- ✅ 멤버십 결제 시스템 (구조만 존재)
- ✅ 크리에이터 대시보드

### 4.6 문서 시스템
- ✅ 독스 페이지 (`/docs`)
- ✅ 컴포넌트 문서화
- ✅ API 레퍼런스
- ✅ 브랜드 가이드

---

## 5. 데이터베이스 스키마

### 5.1 주요 모델

#### 사용자 및 인증
- **User**: 사용자 정보 (username, displayName, email, avatarUrl, bio, skills)
- **Session**: 세션 정보 (Lucia Auth)
- **Follow**: 팔로우 관계

#### 소셜 미디어
- **Post**: 게시물 (title, content, userId, studioId, linkPreviews)
- **Media**: 미디어 파일 (type: IMAGE/VIDEO, url)
- **Comment**: 댓글
- **Like**: 좋아요
- **Bookmark**: 북마크
- **Notification**: 알림 (LIKE, FOLLOW, COMMENT)

#### 스튜디오 시스템
- **Studio**: 스튜디오 (name, slug, description, type: PERSONAL/TEAM)
- **StudioMember**: 스튜디오 멤버 (role: OWNER/ADMIN/MODERATOR/MEMBER)
- **StudioSubscription**: 스튜디오 구독
- **StudioItem**: 스튜디오 아이템 (NOTE, EVENT, TASK)

#### 워크스페이스 시스템
- **ProjectNode**: 워크스페이스 노드
  - 위치: x, y, width, height
  - 타입: PLANNING, NOTE, SCHEDULE, RESOURCE, POST, PHOTO, TRIGGER, ACTION, CONDITION, LOOP, TRANSFORM, CUSTOM
  - 실행 관련: isExecutable, executionType, codeFileUrl, codeLanguage, pluginId
  - 포트: inputPorts, outputPorts (JSON)
  - 상태: status (IDLE, RUNNING, SUCCESS, ERROR)
- **NodeEdge**: 노드 연결선 (fromId, toId, fromPort, toPort)
- **WorkspaceFile**: 워크스페이스 파일 (파일 단위로 노드 그룹화)

#### 티켓팅 시스템
- **Event**: 이벤트 (title, description, slug, location, startDate, endDate, status)
- **TicketType**: 티켓 타입 (name, totalCount, issuedCount, price)
- **Ticket**: 티켓 (qrCode, qrSignature, status: VALID/USED/CANCELLED/EXPIRED)

### 5.2 주요 관계
```
User 1:N Post
User 1:N Studio (ownedStudios)
Studio 1:N ProjectNode
Studio 1:N WorkspaceFile
ProjectNode N:M NodeEdge
WorkspaceFile 1:N ProjectNode
WorkspaceFile 1:N NodeEdge
```

---

## 6. API 구조

### 6.1 인증 API
- `POST /api/auth/callback/google` - Google OAuth 콜백

### 6.2 게시물 API
- `GET /api/posts/for-you` - 전체 피드
- `GET /api/posts/following` - 팔로잉 피드
- `GET /api/posts/public` - 공개 게시물
- `GET /api/posts/[postId]` - 게시물 상세
- `POST /api/posts` - 게시물 생성
- `PATCH /api/posts/[postId]` - 게시물 수정
- `DELETE /api/posts/[postId]` - 게시물 삭제
- `POST /api/posts/[postId]/likes` - 좋아요
- `POST /api/posts/[postId]/bookmark` - 북마크
- `GET /api/posts/[postId]/comments` - 댓글 조회
- `POST /api/posts/[postId]/comments` - 댓글 작성

### 6.3 사용자 API
- `GET /api/users/me` - 현재 사용자 정보
- `GET /api/users/all` - 모든 사용자
- `GET /api/users/username/[username]` - 사용자명으로 조회
- `GET /api/users/[userId]/posts` - 사용자 게시물
- `GET /api/users/[userId]/followers` - 팔로워 목록
- `GET /api/users/[userId]/following` - 팔로잉 목록

### 6.4 스튜디오 API
- `GET /api/studios` - 스튜디오 목록
- `GET /api/studios/public` - 공개 스튜디오
- `GET /api/studios/[studioId]` - 스튜디오 상세
- `POST /api/studios` - 스튜디오 생성
- `PATCH /api/studios/[studioId]` - 스튜디오 수정
- `DELETE /api/studios/[studioId]` - 스튜디오 삭제
- `POST /api/studios/[studioId]/subscribe` - 구독
- `GET /api/studios/[studioId]/subscription-status` - 구독 상태
- `GET /api/studios/[studioId]/members` - 멤버 목록
- `GET /api/studios/[studioId]/posts` - 스튜디오 게시물
- `POST /api/studios/reorder` - 스튜디오 순서 변경

### 6.5 워크스페이스 API
- `GET /api/studios/[studioId]/nodes` - 노드 조회
- `POST /api/studios/[studioId]/nodes` - 노드 생성
- `PATCH /api/studios/[studioId]/nodes/[nodeId]` - 노드 수정
- `DELETE /api/studios/[studioId]/nodes/[nodeId]` - 노드 삭제
- `PATCH /api/studios/[studioId]/nodes/batch` - 노드 일괄 업데이트
- `GET /api/studios/[studioId]/edges` - 연결선 조회
- `POST /api/studios/[studioId]/edges` - 연결선 생성
- `DELETE /api/studios/[studioId]/edges/[edgeId]` - 연결선 삭제
- `GET /api/studios/[studioId]/files` - 파일 조회
- `POST /api/studios/[studioId]/files` - 파일 생성
- `PATCH /api/studios/[studioId]/files/[fileId]` - 파일 수정
- `DELETE /api/studios/[studioId]/files/[fileId]` - 파일 삭제

### 6.6 기타 API
- `GET /api/search` - 검색
- `GET /api/notifications` - 알림 조회
- `POST /api/notifications/mark-as-read` - 알림 읽음 처리
- `GET /api/notifications/unread-count` - 읽지 않은 알림 수
- `POST /api/upload` - 파일 업로드
- `POST /api/upload-resource` - 리소스 업로드
- `GET /api/link-preview` - 링크 미리보기
- `GET /api/youtube/latest` - 최신 YouTube 영상
- `GET /api/youtube/stats` - YouTube 통계

---

## 7. 컴포넌트 구조

### 7.1 레이아웃 컴포넌트
**위치**: `src/components/layout/`

- `LeftSidebarArea`: 좌측 사이드바 영역 (가변 너비: 80px 또는 400px)
- `RightSidebarArea`: 우측 사이드바 영역 (고정 너비: 320px)
- `ServerList`: 서버 리스트 (항상 표시, 80px)
- `DiscordStyleSidebar`: 디스코드 스타일 사이드바 (스튜디오 채널 목록)
- `DocsNavSidebar`: 독스 네비게이션
- `StudioNavSidebar`: 스튜디오 네비게이션
- `IntegratedHeader`: 통합 헤더
- `SidebarContext`: 사이드바 상태 관리 (Context API)

### 7.2 피드 컴포넌트
**위치**: `src/app/(main)/`, `src/components/posts/`

- `MainContent`: 메인 콘텐츠 영역
- `ForYouFeed`: 전체 피드
- `FollowingFeed`: 팔로잉 피드
- `Post`: 게시물 컴포넌트
- `BlogPostCard`: 블로그 스타일 게시물 카드
- `PostEditor`: 게시물 에디터 (Tiptap)
- `CommentInput`: 댓글 입력
- `Comments`: 댓글 목록

### 7.3 스튜디오 컴포넌트
**위치**: `src/app/(main)/studios/[studioId]/`, `src/components/`

- `StudioProfileCard`: 스튜디오 프로필 카드
- `StudioWorkspace`: 워크스페이스 화이트보드
- `StudioCalendar`: 캘린더 뷰
- `StudioNotes`: 노트 관리
- `StudioPosts`: 스튜디오 게시물

### 7.4 워크스페이스 컴포넌트
**위치**: `src/components/workspace/`

- `CustomNode`: 커스텀 노드 컴포넌트 (React Flow)
- `EditNodeDialog`: 노드 편집 다이얼로그
- `NodeSidebar`: 노드 편집 사이드바
- `WorkspaceFileHeader`: 파일 헤더
- `WorkspaceNodeAddBlock`: 노드 추가 블록

### 7.5 UI 컴포넌트
**위치**: `src/components/ui/`

shadcn/ui 기반 컴포넌트:
- `Button`, `Card`, `Input`, `Textarea`
- `Dialog`, `Dropdown`, `Tabs`
- `Avatar`, `Badge`, `Toast`
- `Progress`, `Skeleton`
- `Alert`, `Tooltip`

---

## 8. 라우팅 구조

### 8.1 공개 라우트
- `/` - 홈 피드
- `/explore` - 탐색
- `/search` - 검색
- `/posts/[postId]` - 게시물 상세
- `/users/[username]` - 사용자 프로필
- `/studios` - 스튜디오 목록
- `/studios/[studioId]` - 스튜디오 메인
- `/docs` - 문서

### 8.2 인증 필요 라우트
- `/settings` - 사용자 설정
  - `/settings/profile` - 프로필 설정
  - `/settings/account` - 계정 설정
  - `/settings/security` - 보안 설정
  - `/settings/notifications` - 알림 설정
  - `/settings/devices` - 기기 관리
- `/notifications` - 알림 페이지
- `/bookmarks` - 북마크 페이지
- `/messages` - 메시지 페이지
- `/studios/[studioId]/settings` - 스튜디오 설정
- `/studios/[studioId]/workspace` - 워크스페이스 대시보드
- `/studios/[studioId]/workspace/[fileId]` - 워크스페이스 파일 (화이트보드)

### 8.3 인증 라우트
- `/login` - 로그인
- `/signup` - 회원가입
- `/auth/sso` - SSO 로그인

---

## 9. 상태 관리

### 9.1 React Query
**용도**: 서버 상태 관리, 캐싱, 동기화

주요 사용:
- 게시물 피드 (무한 스크롤)
- 사용자 정보
- 스튜디오 데이터
- 알림 상태
- Optimistic Updates (좋아요, 팔로우 등)

### 9.2 Context API
- `SidebarContext`: 사이드바 열림/닫힘 상태
- `SessionProvider`: 세션 정보 (사용자 정보)

### 9.3 로컬 상태
- `useState`, `useEffect`: 컴포넌트 로컬 상태
- `react-hook-form`: 폼 상태 관리

---

## 10. 현재 개발 상태

### 10.1 완료된 기능 ✅
1. **인증 시스템**: 이메일/비밀번호, Google OAuth, SSO
2. **소셜 미디어**: 게시물, 댓글, 좋아요, 북마크, 팔로우
3. **스튜디오 시스템**: 생성, 관리, 멤버, 구독
4. **워크스페이스 Phase 1**: 기본 노드 시스템, 화이트보드 UI
5. **티켓팅 시스템**: 이벤트, 티켓 생성 및 관리
6. **문서 시스템**: 독스 페이지, 컴포넌트 문서화

### 10.2 진행 중인 기능 🔄
- 워크스페이스 Phase 2: 데이터 흐름 시스템 (포트 시스템)
- 워크스페이스 Phase 3: 자동화 시스템 (트리거/액션 노드)

### 10.3 계획된 기능 📋
- 워크스페이스 Phase 4: SDK 시스템 (커스텀 노드 개발)
- 워크스페이스 Phase 5: 플러그인 마켓플레이스
- 멤버십 결제 시스템 완성
- 크리에이터 대시보드 확장

---

## 11. 주요 파일 및 설정

### 11.1 설정 파일
- `package.json`: 의존성 및 스크립트
- `next.config.mjs`: Next.js 설정 (이미지 최적화, 리라이트 등)
- `tsconfig.json`: TypeScript 설정
- `tailwind.config.ts`: Tailwind CSS 설정
- `prisma/schema.prisma`: 데이터베이스 스키마
- `vercel.json`: Vercel 배포 설정 (Cron 작업 포함)

### 11.2 핵심 라이브러리 파일
- `src/auth.ts`: Lucia Auth 설정
- `src/lib/prisma.ts`: Prisma Client 싱글톤
- `src/lib/types.ts`: 타입 정의 및 Prisma Select 헬퍼
- `src/lib/ky.ts`: HTTP 클라이언트 설정
- `src/lib/validation.ts`: Zod 스키마

### 11.3 주요 컴포넌트 파일
- `src/app/layout.tsx`: 루트 레이아웃
- `src/app/(main)/layout.tsx`: 메인 레이아웃
- `src/app/(main)/page.tsx`: 홈 페이지
- `src/components/layout/SidebarContext.tsx`: 사이드바 상태 관리

---

## 12. 개발 환경

### 12.1 필수 환경 변수
```env
# 데이터베이스
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# 인증
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_BASE_URL=

# 파일 스토리지
BLOB_READ_WRITE_TOKEN=

# 기타
NODE_ENV=development
```

### 12.2 개발 서버 실행
```bash
npm install          # 의존성 설치
npx prisma generate  # Prisma Client 생성
npx prisma migrate dev  # 마이그레이션 실행
npm run dev          # 개발 서버 시작 (localhost:3000)
```

### 12.3 주요 스크립트
- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버
- `npm run lint`: ESLint 실행
- `npm run postinstall`: Prisma Client 자동 생성

### 12.4 백업 및 복구
- `scripts/backup.sh`: 데이터베이스 백업
- `scripts/restore.sh`: 데이터베이스 복구
- `scripts/backup-verify.sh`: 백업 검증

---

## 13. 디자인 시스템

### 13.1 디자인 원칙
- **divetobada.com 디자인 언어 준수**
- 검정색 테두리 (2px)
- 둥근 모서리 (rounded-lg)
- 호버 효과
- 그림자 효과

### 13.2 폰트
- **Pretendard Variable**: 기본 폰트
- **Geist Sans**: 보조 폰트
- **Geist Mono**: 모노스페이스 폰트

### 13.3 색상 시스템
Tailwind CSS 기반 HSL 색상 시스템:
- `background`, `foreground`
- `primary`, `secondary`
- `muted`, `accent`
- `destructive`
- `border`, `input`, `ring`

### 13.4 아이콘
- **Lucide React**: 기본 아이콘 라이브러리
- 아이콘 사용 최소화 원칙

---

## 14. 보안 고려사항

### 14.1 인증 및 권한
- Lucia Auth를 통한 세션 관리
- Prisma를 통한 데이터베이스 접근 제어
- API 라우트에서 권한 검증

### 14.2 파일 업로드
- Vercel Blob을 통한 안전한 파일 스토리지
- 이미지 최적화 및 리사이징
- 업로드 파일 정리 (Cron 작업)

### 14.3 데이터베이스
- Prisma를 통한 타입 안전성
- SQL Injection 방지
- Cascade Delete로 데이터 무결성 유지

---

## 15. 성능 최적화

### 15.1 이미지 최적화
- Next.js Image 컴포넌트 사용
- AVIF/WebP 포맷 지원
- 리모트 이미지 패턴 설정

### 15.2 데이터 페칭
- React Query 캐싱
- Server Components 활용
- 무한 스크롤 (Infinite Query)

### 15.3 번들 최적화
- 동적 임포트
- 코드 스플리팅
- Tree Shaking

---

## 16. 향후 계획

### 16.1 단기 계획
1. 워크스페이스 Phase 2 완료 (포트 시스템)
2. 워크스페이스 Phase 3 시작 (자동화 시스템)
3. 성능 최적화 및 버그 수정

### 16.2 중기 계획
1. SDK 시스템 구축 (Phase 4)
2. 플러그인 마켓플레이스 (Phase 5)
3. 멤버십 결제 시스템 완성

### 16.3 장기 계획
1. 모바일 앱 개발
2. AI 기능 통합
3. 글로벌 확장

---

## 17. 참고 문서

- `PROJECT_ANALYSIS.md`: 프로젝트 분석 문서 (2025-01-15)
- `WORKSPACE_NODE_SYSTEM_DESIGN.md`: 워크스페이스 노드 시스템 설계 문서
- `WORKSPACE_PROGRESS.md`: 워크스페이스 진행 상황
- `AI_SETUP.md`: AI 개발 환경 설정 가이드

---

## 18. 주의사항

### 18.1 개발 규칙
1. **절대 임의로 기능 추가 금지**: 명시적 지시 없이 기능 추가/수정 금지
2. **방향 제시 후 실행**: 코드 수정 전 방향 제시 및 허가 필요
3. **기술 스택 준수**: TypeScript, Next.js, Prisma, Tailwind CSS 등 프로젝트 기술 스택 유지
4. **기존 기능 보존**: 기능 추가/삭제 시 기존 기능 유지 필수
5. **디자인 일관성**: divetobada.com 디자인 언어 준수

### 18.2 작업 프로세스
1. 분석 → 방향 제시 → 허가 → 실행
2. 작은 단위로 테스트
3. 실제 결과 확인 (HTTP 200만으로는 부족)
4. 정직한 보고 (에러나 불확실성 솔직히 보고)

---

**© 2025 Studio_bada. All Rights Reserved.**

---

**이 보고서는 프로젝트의 전체적인 구조와 현황을 파악하기 위해 작성되었습니다.**
**원활한 작업을 위해 이 문서를 참고하여 진행하시기 바랍니다.**

