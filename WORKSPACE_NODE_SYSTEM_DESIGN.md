# 노드 기반 화이트보드 + SDK + 자동화 시스템 설계 문서

**작성일**: 2025-01-XX  
**프로젝트**: Studio_bada Workspace Node System  
**목표**: 레일웨이/블렌더 지오메트리 노드 스타일의 확장 가능한 워크스페이스 시스템

---

## 목표 및 비전

1. **노드 기반 화이트보드**: 아이디어부터 완성까지 시각적 워크플로우
2. **SDK 기반 확장**: AI 생성 코드 파일로 커스텀 노드 생성
3. **자동화 시스템**: 스크래치/블록 코딩 스타일의 자동화 워크플로우

---

## 1. 데이터베이스 스키마

### 1.1 ProjectNode 모델

```prisma
model ProjectNode {
  id          String        @id @default(cuid())
  studioId    String
  studio      Studio        @relation(fields: [studioId], references: [id], onDelete: Cascade)
  
  // 노드 위치 및 크기
  x           Float         
  y           Float         
  width       Float         @default(300)
  height      Float         @default(200)
  
  // 노드 타입 및 실행 가능 여부
  type        NodeType      
  title       String
  content     String?       // JSON (데이터 또는 설정)
  
  // 실행 관련 필드 (SDK/자동화용)
  isExecutable Boolean      @default(false)  // 실행 가능한 노드인지
  executionType ExecutionType? // CODE, WORKFLOW, SDK_PLUGIN
  codeFileUrl  String?      // AI 생성 코드 파일 URL (Vercel Blob)
  codeLanguage String?      // js, ts, python 등
  pluginId     String?      // SDK 플러그인 ID
  
  // 입출력 포트 정의 (스크래치/블록 코딩 스타일)
  inputPorts   Json?        // [{ id, name, type, required }]
  outputPorts  Json?        // [{ id, name, type }]
  
  // 노드 상태 및 실행
  status       NodeStatus   @default(IDLE) // IDLE, RUNNING, SUCCESS, ERROR
  lastExecutionResult Json? // 마지막 실행 결과
  lastExecutedAt DateTime?
  
  // 연결 관계
  fromEdges    NodeEdge[]   @relation("FromNode")
  toEdges      NodeEdge[]   @relation("ToNode")
  
  // 메타데이터
  color        String?
  isCollapsed  Boolean      @default(false)
  config       Json?        // 노드별 설정 (UI 설정 등)
  
  authorId     String
  author       User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  @@map("project_nodes")
}
```

### 1.2 NodeEdge 모델

```prisma
model NodeEdge {
  id          String      @id @default(cuid())
  studioId    String
  fromId      String
  fromNode    ProjectNode @relation("FromNode", fields: [fromId], references: [id], onDelete: Cascade)
  toId        String
  toNode      ProjectNode @relation("ToNode", fields: [toId], references: [id], onDelete: Cascade)
  
  // 데이터 흐름 정의
  fromPort    String?     // 연결 시작 포트 ID
  toPort      String?     // 연결 끝 포트 ID
  
  type        EdgeType    @default(ARROW)
  label       String?
  color       String?
  
  createdAt   DateTime    @default(now())
  
  @@unique([fromId, toId, fromPort, toPort]) // 같은 포트 중복 연결 방지
  @@map("node_edges")
}
```

### 1.3 NodePlugin 모델 (SDK 플러그인)

```prisma
model NodePlugin {
  id            String      @id @default(cuid())
  studioId      String?     // 특정 Studio 전용 또는 null이면 공용
  studio        Studio?     @relation(fields: [studioId], references: [id], onDelete: Cascade)
  
  name          String
  description   String?
  version       String      @default("1.0.0")
  
  // 플러그인 코드/파일
  codeFileUrl   String      // 플러그인 코드 파일 URL
  codeLanguage  String      // js, ts 등
  manifest      Json        // { inputs, outputs, config, icon, category }
  
  // 플러그인 노드 타입 정의
  nodeType      String      // 커스텀 노드 타입 식별자
  
  isPublic      Boolean     @default(false) // 공용 플러그인인지
  isVerified    Boolean     @default(false) // 검증된 플러그인인지
  
  authorId      String
  author        User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  nodes         ProjectNode[] // 이 플러그인을 사용하는 노드들
  
  @@map("node_plugins")
}
```

### 1.4 WorkflowExecution 모델

```prisma
model WorkflowExecution {
  id            String      @id @default(cuid())
  studioId      String
  workflowId    String?     // 특정 워크플로우 ID (현재는 studio 단위)
  
  status        ExecutionStatus @default(RUNNING)
  startedAt     DateTime    @default(now())
  completedAt   DateTime?
  
  // 실행 결과
  results       Json?       // 각 노드별 실행 결과
  errors        Json?       // 에러 정보
  
  triggeredBy   String      // 실행한 사용자 ID
  triggerType   String      // MANUAL, SCHEDULE, EVENT 등
  
  @@map("workflow_executions")
}
```

### 1.5 Enum 정의

```prisma
enum NodeType {
  // 기본 노드 타입
  IDEA
  PLANNING
  NOTE
  SCHEDULE
  RESULT
  RESOURCE
  
  // 자동화 노드 타입
  TRIGGER       // 트리거 노드 (시작점)
  ACTION        // 액션 노드 (실행)
  CONDITION     // 조건 노드 (if/else)
  LOOP          // 반복 노드
  TRANSFORM     // 데이터 변환 노드
  
  // SDK 커스텀 타입
  CUSTOM        // SDK 플러그인으로 만들어진 노드
}

enum ExecutionType {
  CODE          // 직접 코드 실행
  WORKFLOW      // 워크플로우 실행
  SDK_PLUGIN    // SDK 플러그인 실행
}

enum NodeStatus {
  IDLE          // 대기
  RUNNING       // 실행 중
  SUCCESS       // 성공
  ERROR         // 에러
}

enum EdgeType {
  ARROW
  DASHED
  DOTTED
}

enum ExecutionStatus {
  RUNNING
  SUCCESS
  FAILED
  CANCELLED
}
```

### 1.6 Studio 모델 확장

```prisma
model Studio {
  // ... 기존 필드
  nodes         ProjectNode[]
  plugins       NodePlugin[]
  executions    WorkflowExecution[]
  // ... 나머지
}
```

---

## 2. 기술 스택

### 2.1 핵심 라이브러리

- **화이트보드**: `reactflow` 또는 `@xyflow/react` (최신 버전)
- **드래그 앤 드롭**: `@dnd-kit/core` (이미 설치됨)
- **코드 실행**: Node.js VM2 또는 isolated-vm (서버 사이드)

### 2.2 추가 필요 패키지

```bash
npm install reactflow  # 화이트보드 라이브러리
npm install zod       # 이미 설치됨, 스키마 검증용
```

---

## 3. UI/UX 구조

### 3.1 Studio 채널 추가

현재: `posts` / `calendar` / `notes`  
추가: `workspace` (화이트보드 탭)

### 3.2 화이트보드 인터페이스

```
┌─────────────────────────────────────────┐
│  [툴바] [+] [노드타입선택] [줌] [저장]   │
├─────────────────────────────────────────┤
│                                         │
│         [무한 캔버스 영역]                │
│                                         │
│    [노드1] ──→ [노드2]                   │
│     ↑                                    │
│    [노드3]                               │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 노드 타입별 UI

1. **아이디어 노드**: 빠른 메모, 색상 강조
2. **기획 노드**: 구조화된 폼, 체크리스트
3. **메모 노드**: 텍스트 에디터 (Tiptap 활용)
4. **일정관리 노드**: 날짜/시간 선택, 캘린더 연동
5. **결과물 노드**: 파일 첨부, 이미지/비디오 미리보기
6. **자료공유 노드**: 링크, 파일 목록

---

## 4. API 엔드포인트

### 4.1 노드 관리

- `GET /api/studios/[studioId]/nodes` - 모든 노드 조회
- `POST /api/studios/[studioId]/nodes` - 노드 생성
- `PATCH /api/studios/[studioId]/nodes/[nodeId]` - 노드 수정 (위치, 내용)
- `DELETE /api/studios/[studioId]/nodes/[nodeId]` - 노드 삭제
- `PATCH /api/studios/[studioId]/nodes/batch` - 여러 노드 위치 일괄 업데이트

### 4.2 연결선 관리

- `GET /api/studios/[studioId]/edges` - 모든 연결선 조회
- `POST /api/studios/[studioId]/edges` - 연결선 생성
- `DELETE /api/studios/[studioId]/edges/[edgeId]` - 연결선 삭제

### 4.3 노드 실행 (Phase 3+)

- `POST /api/studios/[studioId]/nodes/[nodeId]/execute` - 단일 노드 실행
- `POST /api/studios/[studioId]/workflows/execute` - 전체 워크플로우 실행
- `GET /api/studios/[studioId]/executions` - 실행 이력 조회

### 4.4 SDK 플러그인 (Phase 4+)

- `POST /api/studios/[studioId]/plugins` - 플러그인 등록
- `GET /api/plugins/public` - 공용 플러그인 조회
- `POST /api/plugins/[pluginId]/upload` - 코드 파일 업로드
- `POST /api/plugins/[pluginId]/validate` - 플러그인 검증

---

## 5. SDK 구조 (Phase 4)

### 5.1 SDK 패키지 구조

```
@studio-bada/sdk/
├── types/
│   ├── NodeDefinition.ts      // 노드 정의 타입
│   ├── Port.ts                // 입출력 포트 타입
│   ├── Execution.ts            // 실행 컨텍스트 타입
│   └── Plugin.ts               // 플러그인 매니페스트 타입
├── core/
│   ├── NodeBase.ts             // 기본 노드 클래스
│   ├── ExecutionEngine.ts       // 실행 엔진
│   └── WorkflowRunner.ts        // 워크플로우 실행기
├── utils/
│   ├── Sandbox.ts               // 코드 샌드박스 (보안)
│   └── Validator.ts             // 플러그인 검증
└── cli/
    └── build.ts                 // 플러그인 빌드 도구
```

### 5.2 SDK 사용 예시

```typescript
// 예: 이미지 변환 노드 플러그인
import { defineNode, NodeBase, PortType } from '@studio-bada/sdk';

export default defineNode({
  id: 'image-resize',
  name: '이미지 리사이즈',
  description: '이미지 크기를 조정합니다',
  category: 'image',
  
  // 입출력 포트 정의
  inputs: [
    { id: 'image', name: '이미지', type: PortType.FILE, required: true },
    { id: 'width', name: '너비', type: PortType.NUMBER, default: 800 },
    { id: 'height', name: '높이', type: PortType.NUMBER, default: 600 }
  ],
  outputs: [
    { id: 'result', name: '결과', type: PortType.FILE }
  ],
  
  // 실행 함수
  async execute(context) {
    const image = context.inputs.image;
    const width = context.inputs.width;
    const height = context.inputs.height;
    
    // 실제 변환 로직
    const resized = await resizeImage(image, width, height);
    
    return {
      result: resized
    };
  }
});
```

---

## 6. 구현 단계

### Phase 1: 기본 노드 시스템 (1주)
1. ✅ Prisma 스키마 확장 (ProjectNode, NodeEdge)
2. ✅ 마이그레이션 실행
3. ✅ 기본 노드 타입 6개 (아이디어~자료공유)
4. ✅ 화이트보드 UI (reactflow)
5. ✅ 노드 CRUD API

### Phase 2: 데이터 흐름 시스템 (1주)
1. 포트 시스템 (입출력)
2. 연결선 데이터 전달
3. 노드 간 데이터 흐름 처리

### Phase 3: 기본 자동화 노드 (1주)
1. 내장 트리거/액션 노드 구현
2. 조건/제어 노드 구현
3. 기본 실행 엔진

### Phase 4: SDK 시스템 (2주)
1. SDK 패키지 구조 설계
2. 플러그인 매니페스트 시스템
3. 코드 파일 업로드/실행
4. 샌드박스 환경 구축

### Phase 5: 플러그인 마켓플레이스 (1주)
1. 공용 플러그인 조회
2. 플러그인 검증 시스템
3. 플러그인 설치 UI

### Phase 6: 최적화 및 안정화 (1주)
1. 성능 최적화
2. 에러 핸들링
3. 실행 모니터링/디버깅 도구

---

## 7. 보안 고려사항

1. **코드 실행 샌드박스**: VM2 또는 isolated-vm 사용
2. **파일 업로드**: 코드 파일만 허용, 바이러스 스캔
3. **플러그인 검증**: 매니페스트 검증, 권한 확인
4. **API 호출 제한**: 외부 API 호출 시 rate limiting

---

## 8. 참고 사례

- **Railway**: 노드 기반 배포 워크플로우
- **Blender Geometry Nodes**: 노드 기반 3D 모델링
- **Scratch**: 블록 코딩 인터페이스
- **Zapier/Make**: 자동화 워크플로우 빌더
- **Weavy AI**: AI 기반 자동화

---

**© 2025 Studio_bada. All Rights Reserved.**

