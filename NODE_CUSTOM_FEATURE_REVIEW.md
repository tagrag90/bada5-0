# 노드 커스텀 기능 검토 및 구현 방향

**작성일**: 2025-01-XX  
**프로젝트**: Studio_bada Workspace Node System  
**검토자**: AI Assistant  

---

## 📋 현재 상태

### ✅ 완료된 기능
- 기본 노드 시스템 (Phase 1)
- 노드 타입: IDEA, PLANNING, NOTE, SCHEDULE, RESULT, RESOURCE
- 화이트보드 (React Flow)
- 노드 생성/수정/삭제
- 노드 연결 (연결선)
- 노드 편집 사이드바

### 📊 데이터베이스 구조
- `ProjectNode.content`: JSON 타입 (데이터 저장 가능)
- `ProjectNode.config`: JSON 타입 (UI 설정 저장 가능)
- `ProjectNode.inputPorts`: JSON 타입 (입력 포트 정의 가능)
- `ProjectNode.outputPorts`: JSON 타입 (출력 포트 정의 가능)

---

## 🔍 제시된 기능 검토

### 1. 필요 노드 타입

#### ✅ 1.1 메모 노드
**현재 상태**: `NOTE` 타입 존재, 타이틀과 내용(content) 분리 가능

**요구사항**:
- 타이틀과 상세내용 분리

**구현 방향**:
- ✅ **현재 구조로 충분**: `title` 필드와 `content` 필드로 분리 가능
- **추가 필요**: NodeSidebar에서 메모 타입일 때 상세내용 에디터 강화

**구현 난이도**: 🟢 낮음 (이미 구조 존재)

---

#### 🔄 1.2 일정 관리 노드
**현재 상태**: `SCHEDULE` 타입 존재, 기본 기능만

**요구사항**:
- 캘린더 날짜 선택
- 이벤트 종류 선택 (단순 행사, 일정, 마감기한 있는 활동 등)
- 리마인드 알람 (몇 시간 전)
- 알람 보낼 대상자 (이메일 전송)

**구현 방향**:
- `content` 필드에 JSON 구조로 저장:
  ```json
  {
    "eventType": "SCHEDULE" | "EVENT" | "DEADLINE",
    "startDate": "2025-01-XX",
    "endDate": "2025-01-XX",
    "reminderHours": [24, 12, 6],  // 몇 시간 전 알람
    "recipients": ["user1@example.com", "user2@example.com"],
    "description": "상세 설명"
  }
  ```
- **필요 작업**:
  1. NodeSidebar에 SCHEDULE 타입 전용 편집 UI 추가
     - 날짜 선택기 (react-datepicker 또는 date input)
     - 이벤트 종류 라디오 버튼
     - 리마인드 알람 설정 (체크박스 + 시간 입력)
     - 대상자 선택 (스튜디오 멤버 목록)
  2. 백그라운드 작업 (Cron Job)
     - Vercel Cron 또는 서버리스 함수로 알람 전송
     - 이메일 전송 API (Nodemailer 또는 Resend)
  3. 알람 스케줄 저장
     - 별도 테이블 생성 고려: `ScheduleReminder` 모델
     - 또는 `content` JSON 내에 저장

**구현 난이도**: 🟡 중간 (UI + 백그라운드 작업 필요)

---

#### 🆕 1.3 음악 노드
**현재 상태**: 존재하지 않음

**요구사항**:
- 일할 때 음악 들으라고 음악 기능

**구현 방향**:
- **새 NodeType 추가**: `MUSIC`
- `content` 필드에 음악 정보 저장:
  ```json
  {
    "platform": "YOUTUBE" | "SPOTIFY" | "SOUNDCLOUD",
    "url": "https://...",
    "playlist": [...],
    "autoplay": false
  }
  ```
- **필요 작업**:
  1. Prisma 스키마에 `MUSIC` 타입 추가
  2. nodeConfig에 MUSIC 타입 및 아이콘 추가
  3. CustomNode에서 MUSIC 타입일 때 음악 플레이어 렌더링
     - YouTube embed 또는 Spotify embed
     - 또는 HTML5 audio/video 태그
  4. NodeSidebar에 음악 URL 입력 UI 추가

**구현 난이도**: 🟢 낮음~🟡 중간 (플랫폼별 임베드 처리)

---

#### 🔄 1.4 자료 공유 노드
**현재 상태**: `RESOURCE` 타입 존재, 기본 기능만

**요구사항**:
- 드래그 드롭 파일 업로드
- 스튜디오 멤버 다운로드 가능
- 용량 클 경우 자동 압축
- 파일 형태로 주고받음

**구현 방향**:
- **현재 프로젝트**: Uploadthing 사용 중 ✅
- `content` 필드에 파일 정보 저장:
  ```json
  {
    "files": [
      {
        "id": "file-id",
        "url": "https://...",
        "name": "file.pdf",
        "size": 123456,
        "type": "application/pdf",
        "uploadedAt": "2025-01-XX",
        "uploadedBy": "user-id",
        "compressed": false,
        "compressedUrl": null
      }
    ]
  }
  ```
- **필요 작업**:
  1. NodeSidebar에 파일 업로드 UI 추가
     - 드래그 앤 드롭 영역 (@dnd-kit 사용)
     - Uploadthing 컴포넌트 통합
  2. 파일 압축 로직
     - 백엔드 API: `/api/studios/[studioId]/nodes/[nodeId]/compress`
     - 큰 파일 감지 (예: 10MB 이상)
     - zip 파일 생성 (adm-zip 또는 jszip)
     - Uploadthing에 업로드 후 URL 저장
  3. 다운로드 버튼
     - CustomNode에 파일 목록 표시
     - 다운로드 버튼 (각 파일별 또는 전체 압축)
  4. 권한 체크
     - 스튜디오 멤버만 다운로드 가능

**구현 난이도**: 🟡 중간 (파일 처리 + 압축 로직)

---

#### 🔄 1.5 게시물 노드
**현재 상태**: 게시물과 노드 연결 없음

**요구사항**:
- 메모 대용으로 기존 게시물 노드로 사용
- 게시물 더보기 버튼에서 노드로 추가 기능

**구현 방향**:
- **새 NodeType 추가**: `POST` (또는 기존 노드 활용)
- `content` 필드에 게시물 ID 저장:
  ```json
  {
    "postId": "post-id",
    "studioId": "studio-id"
  }
  ```
- **필요 작업**:
  1. Prisma 스키마에 `POST` 타입 추가 (선택)
     - 또는 `RESULT` 타입으로 활용 가능
  2. PostMoreButton에 "노드로 추가" 옵션 추가
     - 드롭다운 메뉴에 추가
     - 클릭 시 모달: "어떤 스튜디오의 워크스페이스에 추가할지 선택"
     - 또는 현재 스튜디오에만 추가
  3. API: `POST /api/studios/[studioId]/nodes` 
     - 게시물 정보로 노드 생성
  4. CustomNode에서 POST 타입일 때
     - 게시물 미리보기 표시
     - 클릭 시 게시물 상세 페이지로 이동

**구현 난이도**: 🟡 중간 (게시물과 노드 연결)

---

#### 🔄 1.6 결과정리 노드
**현재 상태**: `RESULT` 타입 존재

**요구사항**:
- 결과 정리 및 회고
- 이미지 추가
- 소셜미디어 링크 추가

**구현 방향**:
- `content` 필드에 구조화된 데이터 저장:
  ```json
  {
    "summary": "결과 요약",
    "reflection": "회고 내용",
    "images": [
      {
        "url": "https://...",
        "caption": "이미지 설명"
      }
    ],
    "socialLinks": [
      {
        "platform": "INSTAGRAM" | "TWITTER" | "YOUTUBE",
        "url": "https://...",
        "title": "링크 제목"
      }
    ]
  }
  ```
- **필요 작업**:
  1. NodeSidebar에 RESULT 타입 전용 편집 UI 추가
     - 리치 텍스트 에디터 (Tiptap 활용 가능)
     - 이미지 업로드 (Uploadthing)
     - 소셜미디어 링크 추가 (URL 입력 + 플랫폼 자동 감지)
  2. CustomNode에서 RESULT 타입일 때
     - 이미지 갤러리 표시
     - 소셜미디어 링크 버튼 표시
  3. 이미지 및 링크 미리보기

**구현 난이도**: 🟡 중간 (UI 구성)

---

## 🔧 추가 노드 기능

### 2.1 노드 연결점 추가
**현재 상태**: 좌우측 각 1개씩 연결점 존재

**요구사항**:
- 사이드바에서 연결점 추가하기 버튼

**구현 방향**:
- `inputPorts`와 `outputPorts` JSON 필드 활용
- **필요 작업**:
  1. NodeSidebar에 "연결점 관리" 섹션 추가
     - 입력 연결점 추가/삭제
     - 출력 연결점 추가/삭제
     - 연결점 이름 설정
  2. CustomNode에서 동적 연결점 렌더링
     - `inputPorts`/`outputPorts` 배열 기반으로 Handle 생성
     - 포지션 자동 계산 (상하 분산)
  3. API 업데이트
     - 연결점 추가/삭제 시 `inputPorts`/`outputPorts` 업데이트

**구현 난이도**: 🟡 중간 (동적 연결점 처리)

---

### 2.2 노드 활성화 뱃지
**현재 상태**: 연결점 기본 스타일만

**요구사항**:
- 활성화된 노드는 연결점 보라색 테두리

**구현 방향**:
- `config` 필드에 `isActive` 플래그 저장
- **필요 작업**:
  1. CustomNode에서 `isActive` 상태 확인
  2. Handle 스타일 조건부 적용:
     ```tsx
     border: isActive ? '2px solid #9333ea' : '2px solid #000'
     ```
  3. 활성화 토글 버튼 (노드 우측 상단)

**구현 난이도**: 🟢 낮음

---

### 2.3 사용자 지정
**현재 상태**: `authorId` 필드 존재 (작성자만)

**요구사항**:
- 노드 별 해당 멤버 지정

**구현 방향**:
- **옵션 1**: `config` 필드에 할당된 멤버 ID 배열 저장
  ```json
  {
    "assignedMembers": ["user-id-1", "user-id-2"]
  }
  ```
- **옵션 2**: 새로운 테이블 생성 (관계 테이블)
  ```prisma
  model NodeMember {
    id       String      @id @default(cuid())
    nodeId   String
    node     ProjectNode @relation(...)
    userId   String
    user     User        @relation(...)
    role     String      // "ASSIGNED", "VIEWER" 등
  }
  ```
- **필요 작업**:
  1. NodeSidebar에 "담당자 지정" UI 추가
     - 스튜디오 멤버 목록 (멀티 선택)
     - 체크박스로 선택
  2. CustomNode에서 담당자 아바타 표시
     - 노드 하단에 작은 아바타 아이콘들
  3. 필터링 기능 (향후)
     - "내가 담당한 노드만 보기"

**구현 난이도**: 🟡 중간 (관계 테이블 고려 시)

---

### 2.4 프로젝트 별 분류
**현재 상태**: 스튜디오 단위로만 관리

**요구사항**:
- 워크스페이스 페이지에서 프로젝트 파일 페이지 만들기
- 피그마처럼 프로젝트 대시보드
- 프로젝트 선택 시 프로젝트 별 화이트보드 표시

**구현 방향**:
- **새 모델 추가**: `WorkspaceProject`
  ```prisma
  model WorkspaceProject {
    id          String        @id @default(cuid())
    studioId    String
    studio      Studio        @relation(...)
    name        String
    description String?
    thumbnail   String?
    nodes       ProjectNode[] // 노드에 projectId 추가
    createdAt   DateTime      @default(now())
    updatedAt   DateTime      @updatedAt
  }
  ```
- `ProjectNode`에 `projectId` 필드 추가:
  ```prisma
  projectId    String?
  project      WorkspaceProject? @relation(...)
  ```
- **필요 작업**:
  1. 프로젝트 목록 페이지
     - `/studios/[studioId]/workspace/projects`
     - 프로젝트 카드 그리드 뷰
     - 프로젝트 생성/수정/삭제
  2. 프로젝트 대시보드
     - 프로젝트 선택 시 해당 프로젝트의 노드만 필터링
     - 프로젝트 통계 (노드 수, 완료율 등)
  3. 워크스페이스 UI 수정
     - 상단에 프로젝트 선택 드롭다운
     - 프로젝트 필터 적용

**구현 난이도**: 🔴 높음 (대규모 구조 변경)

---

## 📝 구현 우선순위 제안

### Phase 1: 기본 노드 기능 강화 (1-2주)
1. ✅ 메모 노드: 상세내용 에디터 강화 (낮음)
2. ✅ 음악 노드: 기본 음악 플레이어 추가 (낮음~중간)
3. ✅ 결과정리 노드: 이미지 및 링크 추가 (중간)
4. ✅ 노드 활성화 뱃지 (낮음)

### Phase 2: 고급 노드 기능 (2-3주)
5. ✅ 자료 공유 노드: 파일 업로드 및 다운로드 (중간)
6. ✅ 게시물 노드: 게시물 연결 기능 (중간)
7. ✅ 노드 연결점 추가 (중간)

### Phase 3: 협업 기능 (2-3주)
8. ✅ 사용자 지정 (중간)
9. ✅ 일정 관리 노드: 알람 시스템 (중간~높음)

### Phase 4: 프로젝트 관리 (3-4주)
10. ✅ 프로젝트 별 분류 (높음)

---

## ⚠️ 고려사항

### 1. 데이터 마이그레이션
- 노드 타입 추가 시 기존 데이터 영향 없음 (Enum 추가만)
- 프로젝트 기능 추가 시 마이그레이션 필요

### 2. 백그라운드 작업
- 일정 알람: Vercel Cron 또는 별도 서버 필요
- 파일 압축: 서버리스 함수로 처리 가능

### 3. 성능
- 프로젝트 필터링 시 쿼리 최적화 필요
- 파일 다운로드 시 CDN 활용 (Uploadthing 자체 CDN)

### 4. 보안
- 파일 다운로드 권한 체크
- 이메일 전송 시 스팸 방지

---

## ✅ 결론

제시하신 기능들은 대부분 **현재 구조에서 구현 가능**합니다.

**권장 접근**:
1. **단계적 구현**: Phase 1부터 순차적으로 진행
2. **기존 필드 활용**: `content` JSON 필드로 유연한 데이터 저장
3. **점진적 확장**: 먼저 간단한 기능부터, 복잡한 기능은 후순위

**즉시 시작 가능한 항목**:
- 메모 노드 강화
- 음악 노드 추가
- 노드 활성화 뱃지
- 결과정리 노드 강화

**추가 검토 필요한 항목**:
- 프로젝트 기능: 구조 변경이 큼 → 별도 계획 필요
- 일정 알람: 백그라운드 작업 인프라 확인 필요

---

**© 2025 Studio_bada. All Rights Reserved.**

