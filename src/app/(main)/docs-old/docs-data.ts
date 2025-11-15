export const docsInfo = {
  serviceName: "Divetobada",
  version: "2.0",
  lastUpdated: "2025년 1월 15일",
};

// ============= 1. 프로젝트 개요 =============
export const projectOverview = {
  title: "프로젝트 개요",
  description: "Divetobada는 크리에이터와 팬을 직접 연결하는 엔터테인먼트 플랫폼입니다.",
  vision: {
    title: "비전",
    description: "소속사 없이도 주도권을 가지고 활동하며 팬들과 매끄럽게 소통할 수 있는 공간을 제공합니다.",
    values: [
      "크리에이터 자율성",
      "직접적인 팬-크리에이터 소통",
      "확장 가능한 워크스페이스 시스템",
      "SDK를 통한 커스터마이징"
    ]
  },
  techStack: {
    title: "기술 스택",
    frontend: [
      { name: "Next.js", version: "15.1.2", description: "App Router 기반 프레임워크" },
      { name: "React", version: "18.3.1", description: "UI 라이브러리" },
      { name: "TypeScript", description: "타입 안정성" },
      { name: "Tailwind CSS", description: "유틸리티 퍼스트 스타일링" },
      { name: "React Query", version: "5.90.5", description: "서버 상태 관리" },
      { name: "Tiptap", description: "리치 텍스트 에디터" },
      { name: "React Flow", version: "11.11.4", description: "화이트보드 라이브러리" }
    ],
    backend: [
      { name: "PostgreSQL", description: "관계형 데이터베이스" },
      { name: "Prisma", version: "5.16.1", description: "ORM" },
      { name: "Lucia Auth", version: "3.2.0", description: "인증 시스템" },
      { name: "Arctic", description: "OAuth 라이브러리" },
      { name: "Zod", description: "스키마 검증" }
    ],
    infrastructure: [
      { name: "Vercel", description: "배포 플랫폼" },
      { name: "Vercel Blob", description: "파일 스토리지" }
    ]
  }
};

// ============= 2. 시작하기 =============
export const gettingStarted = {
  title: "시작하기",
  description: "Divetobada를 시작하는 방법을 안내합니다.",
  steps: [
    {
      title: "회원가입",
      description: "이메일과 비밀번호로 간단하게 가입할 수 있습니다.",
      items: [
        "우측 상단 '회원가입' 버튼 클릭",
        "이메일, 사용자명, 비밀번호 입력",
        "이메일 인증 (선택사항)",
        "프로필 설정 완료"
      ],
      alternative: "Google 계정으로 간편 가입 가능"
    },
    {
      title: "프로필 꾸미기",
      description: "나만의 개성있는 프로필을 만들어보세요.",
      items: [
        "프로필 이미지 업로드",
        "자기소개 작성",
        "관심사 및 스킬 태그 추가",
        "소셜 링크 연결"
      ]
    },
    {
      title: "첫 게시물 작성",
      description: "여러분의 창작물과 이야기를 팬들과 공유해보세요.",
      items: [
        "홈 피드에서 '글쓰기' 버튼 클릭",
        "텍스트, 이미지, 링크 추가",
        "해시태그로 주제 분류",
        "게시 버튼으로 공유"
      ]
    },
    {
      title: "스튜디오 생성",
      description: "크리에이터를 위한 전문 공간을 만들어보세요.",
      items: [
        "좌측 사이드바에서 '스튜디오 생성' 클릭",
        "스튜디오 이름과 슬러그 입력",
        "설명과 타입 선택",
        "생성 완료 후 콘텐츠 발행 시작"
      ]
    }
  ]
};

// ============= 3. 아키텍처 가이드 =============
export const architectureGuide = {
  title: "아키텍처 가이드",
  description: "Divetobada의 구조와 설계 원칙을 설명합니다.",
  layout: {
    title: "레이아웃 시스템",
    description: "가변 사이드바를 가진 3-컬럼 레이아웃 구조입니다.",
    structure: {
      left: {
        name: "LeftSidebarArea",
        width: "가변 (80px 또는 400px)",
        components: [
          "ServerList (항상 표시, 80px)",
          "콘텐츠 블록 (조건부 표시, 320px)",
          "- Docs: 독스 네비게이션",
          "- Discord: 스튜디오 채널 목록",
          "- None: 콘텐츠 없음"
        ]
      },
      center: {
        name: "MainContent",
        width: "가변 (사이드바 너비에 따라 자동 조절)",
        maxWidth: "3xl (768px)",
        alignment: "중앙 정렬",
        features: [
          "CSS 변수를 통한 동적 너비 계산",
          "반응형 디자인 지원",
          "모바일 최적화"
        ]
      },
      right: {
        name: "RightSidebarArea",
        width: "고정 (320px)",
        components: [
          "홈: 크리에이터 추천, 브랜드 사이드바",
          "스튜디오: 스튜디오 정보",
          "접기/펼치기 기능 (양쪽 동시 제어)"
        ]
      }
    },
    cssVariables: [
      {
        name: "--left-sidebar-width",
        description: "좌측 사이드바 너비",
        values: ["80px", "400px"],
        default: "80px"
      },
      {
        name: "--right-sidebar-width",
        description: "우측 사이드바 너비",
        values: ["320px"],
        default: "320px"
      }
    ]
  },
  sidebar: {
    title: "사이드바 시스템",
    description: "페이지별로 동적으로 변경되는 사이드바 시스템입니다.",
    types: [
      {
        type: "none",
        description: "사이드바 없음",
        width: "0px",
        useCase: "일부 특수 페이지"
      },
      {
        type: "docs",
        description: "독스 페이지 사이드바",
        width: "400px",
        content: "독스 네비게이션 메뉴"
      },
      {
        type: "discord",
        description: "스튜디오 디스코드 스타일 사이드바",
        width: "80px 또는 400px",
        content: "서버 리스트 + 스튜디오 채널 목록",
        dynamic: "콘텐츠 블록 유무에 따라 너비 변경"
      }
    ],
    collapse: {
      description: "양쪽 사이드바를 동시에 접고 펼칠 수 있습니다.",
      trigger: "우측 사이드바 우측 상단 버튼",
      behavior: "상하로 접히며 높이 60px로 축소"
    }
  },
  routing: {
    title: "라우팅 구조",
    description: "Next.js App Router 기반의 파일 시스템 라우팅입니다.",
    structure: [
      {
        path: "/",
        description: "홈 피드 (전체/팔로잉)",
        components: ["MainContent", "ForYouFeed", "FollowingFeed"]
      },
      {
        path: "/studios/[studioId]",
        description: "스튜디오 메인 페이지",
        components: ["StudioProfileCard", "StudioDetailContent"],
        tabs: ["workspace", "posts", "calendar", "notes"]
      },
      {
        path: "/studios/[studioId]/workspace",
        description: "워크스페이스 대시보드",
        components: ["WorkspaceDashboard"]
      },
      {
        path: "/studios/[studioId]/workspace/[fileId]",
        description: "화이트보드 파일 페이지",
        components: ["StudioWorkspace", "WorkspaceFileHeader", "WorkspaceNodeAddBlock"]
      },
      {
        path: "/studios/[studioId]/settings",
        description: "스튜디오 설정",
        tabs: ["general", "members"]
      },
      {
        path: "/docs-old",
        description: "독스 페이지",
        sidebar: "docs"
      }
    ]
  }
};

// ============= 4. 인증 시스템 =============
export const authenticationGuide = {
  title: "인증 시스템",
  description: "Lucia Auth 기반의 인증 시스템입니다.",
  methods: [
    {
      name: "이메일/비밀번호",
      description: "전통적인 이메일과 비밀번호를 사용한 인증",
      endpoint: "/api/auth/login",
      features: [
        "Argon2 해싱",
        "세션 쿠키 관리",
        "자동 로그인 유지"
      ]
    },
    {
      name: "Google OAuth",
      description: "Google 계정을 통한 간편 로그인",
      endpoint: "/api/auth/callback/google",
      features: [
        "PKCE 보안",
        "자동 계정 생성",
        "TestFlight 지원"
      ]
    }
  ],
  session: {
    description: "Lucia를 통한 세션 관리",
    features: [
      "서버 사이드 세션 검증",
      "쿠키 기반 인증",
      "자동 만료 관리"
    ]
  },
  sso: {
    title: "SSO 통합",
    description: "Login with Divetobada를 통한 외부 서비스 인증",
    benefits: [
      "하나의 Divetobada 계정으로 모든 Team Bada 서비스 접근",
      "이메일 기반 자동 계정 매칭 및 생성",
      "안전한 JWT 기반 인증 (5분 유효)",
      "Google Login처럼 간편한 통합"
    ],
    implementation: {
      step1: {
        title: "1. 외부 서비스 백엔드에 SSO 엔드포인트 추가",
        code: `// Express 예시
app.post("/sso/divetobada", async (req, res) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, SHARED_SSO_SECRET);
  
  // 이메일로 계정 찾기 또는 생성
  let user = await User.findOne({ email: decoded.email });
  if (!user) {
    user = await createUser(decoded);
  }
  
  return res.json({ access_token: generateToken(user) });
});`
      },
      step2: {
        title: "2. 프론트엔드에 SSO 처리 페이지 추가",
        code: `// /sso 페이지
const token = searchParams.get('token');
axios.post('/sso/divetobada', { token })
  .then(({ data }) => {
    saveSession(data);
    redirect('/dashboard');
  });`
      },
      step3: {
        title: "3. 로그인 페이지에 위젯 추가",
        code: `<iframe 
  src="https://divetobada.com/api/widget/login-button?redirect=YOUR_SSO_URL&service=YOUR_SERVICE_NAME"
  width="100%" 
  height="60"
  frameborder="0"
  scrolling="no"
  style="border: none;"
></iframe>`
      }
    },
    notes: [
      "⚠️ SHARED_SSO_SECRET는 Divetobada와 동일한 값을 사용해야 합니다",
      "⚠️ YOUR_SSO_URL은 토큰을 받을 엔드포인트 (예: http://yoursite.com/sso)",
      "⚠️ YOUR_SERVICE_NAME은 서비스 식별자 (예: vessel, soundcamp 등)",
      "💡 프로덕션에서는 https://divetobada.com 사용"
    ]
  }
};

// ============= 5. 소셜 기능 =============
export const socialFeatures = {
  title: "소셜 기능",
  description: "게시물, 댓글, 팔로우 등 소셜 미디어 핵심 기능입니다.",
  posts: {
    title: "게시물",
    description: "텍스트, 이미지, 링크를 포함한 리치 콘텐츠 게시물",
    features: [
      "리치 텍스트 에디터 (Tiptap)",
      "이미지/비디오 업로드 (최대 10개)",
      "링크 미리보기 자동 생성",
      "해시태그 지원",
      "멘션 (@username)",
      "게시물 수정/삭제"
    ],
    api: {
      create: "POST /api/posts",
      get: "GET /api/posts/[postId]",
      update: "PATCH /api/posts/[postId]",
      delete: "DELETE /api/posts/[postId]"
    }
  },
  comments: {
    title: "댓글",
    description: "게시물에 대한 댓글 시스템",
    features: [
      "댓글 작성/수정/삭제",
      "댓글 알림",
      "무한 댓글 스레드"
    ],
    api: {
      create: "POST /api/posts/[postId]/comments",
      get: "GET /api/posts/[postId]/comments"
    }
  },
  interactions: {
    title: "상호작용",
    description: "좋아요, 북마크, 리포스트 기능",
    features: [
      "좋아요 (Like)",
      "북마크 (Bookmark)",
      "리포스트 (Repost)",
      "실시간 카운트 업데이트"
    ],
    api: {
      like: "POST /api/posts/[postId]/likes",
      bookmark: "POST /api/posts/[postId]/bookmark"
    }
  },
  follow: {
    title: "팔로우 시스템",
    description: "사용자 간 팔로우 관계",
    features: [
      "팔로우/언팔로우",
      "팔로워/팔로잉 목록",
      "팔로우 알림"
    ],
    api: {
      follow: "POST /api/users/[userId]/follow",
      followers: "GET /api/users/[userId]/followers",
      following: "GET /api/users/[userId]/following"
    }
  },
  feed: {
    title: "피드 시스템",
    description: "게시물 피드 및 추천 시스템",
    types: [
      {
        name: "전체 (For You)",
        description: "추천 알고리즘 기반 게시물",
        endpoint: "GET /api/posts/for-you"
      },
      {
        name: "팔로잉",
        description: "팔로우한 사용자의 게시물",
        endpoint: "GET /api/posts/following",
        requiresAuth: true
      },
      {
        name: "공개",
        description: "비로그인 사용자를 위한 공개 게시물",
        endpoint: "GET /api/posts/public"
      }
    ]
  }
};

// ============= 6. 스튜디오 시스템 =============
export const studioSystem = {
  title: "스튜디오 시스템",
  description: "크리에이터를 위한 전문 공간입니다.",
  overview: {
    title: "스튜디오란?",
    description: "스튜디오는 크리에이터가 콘텐츠를 발행하고 팬들과 소통하는 공간입니다.",
    features: [
      "블로그 스타일 콘텐츠 발행",
      "구독자 관리",
      "멤버 관리 (팀 스튜디오)",
      "워크스페이스 (화이트보드)",
      "캘린더/일정 관리",
      "노트 관리"
    ]
  },
  creation: {
    title: "스튜디오 생성",
    steps: [
      "좌측 사이드바에서 '스튜디오 생성' 클릭",
      "스튜디오 이름과 슬러그(URL) 입력",
      "설명과 타입 선택 (개인/팀)",
      "아바타 및 배너 이미지 업로드",
      "소셜 링크 연결",
      "생성 완료"
    ],
    api: "POST /api/studios"
  },
  management: {
    title: "스튜디오 관리",
    features: [
      "스튜디오 정보 수정",
      "멤버 초대 및 관리",
      "권한 설정 (OWNER, ADMIN, MODERATOR, MEMBER)",
      "구독자 관리",
      "공개/비공개 설정"
    ],
    api: {
      update: "PATCH /api/studios/[studioId]",
      members: "GET /api/studios/[studioId]/members",
      invite: "POST /api/studios/[studioId]/members"
    }
  },
  channels: {
    title: "스튜디오 채널",
    description: "스튜디오 내 다양한 콘텐츠 타입",
    types: [
      {
        name: "워크스페이스",
        description: "노드 기반 화이트보드",
        path: "/studios/[studioId]/workspace"
      },
      {
        name: "게시물",
        description: "스튜디오 게시물 목록",
        path: "/studios/[studioId]?tab=posts"
      },
      {
        name: "캘린더",
        description: "일정 및 이벤트 관리",
        path: "/studios/[studioId]?tab=calendar"
      },
      {
        name: "노트",
        description: "노트 관리",
        path: "/studios/[studioId]?tab=notes"
      }
    ]
  }
};

// ============= 7. 워크스페이스 노드 시스템 =============
export const workspaceNodeSystem = {
  title: "워크스페이스 노드 시스템",
  description: "React Flow 기반의 노드 기반 화이트보드 시스템입니다.",
  overview: {
    title: "개요",
    description: "노드는 워크스페이스에서 정보를 표현하고 연결하는 기본 단위입니다.",
    features: [
      "드래그 앤 드롭으로 자유롭게 배치",
      "노드 간 연결선으로 관계 표현",
      "노드 타입별 특화된 UI 및 기능",
      "실시간 편집 및 저장",
      "파일 시스템 지원"
    ]
  },
  nodeTypes: [
    {
      type: "PLANNING",
      label: "기획",
      icon: "FileText",
      description: "프로젝트 기획 및 아이디어를 기록하는 노드",
      features: [
        "제목과 내용 편집",
        "이모지 추가 가능",
        "다른 노드와 연결 가능",
        "보라색 테두리로 강조 표시"
      ],
      useCase: "프로젝트 기획, 아이디어 정리"
    },
    {
      type: "NOTE",
      label: "메모",
      icon: "FileText",
      description: "일반적인 메모 및 텍스트 노드",
      features: [
        "리치 텍스트 에디터 지원",
        "HTML 콘텐츠 렌더링",
        "이모지 추가 가능",
        "무제한 텍스트 입력"
      ],
      useCase: "일반 메모, 문서 작성"
    },
    {
      type: "SCHEDULE",
      label: "캘린더",
      icon: "Calendar",
      description: "일정 및 이벤트 정보를 표시하는 노드",
      features: [
        "시작일/종료일 설정",
        "이벤트 타입 표시 (일정/행사/마감기한)",
        "설명 추가 가능",
        "캘린더 뷰와 연동"
      ],
      useCase: "일정 관리, 이벤트 계획"
    },
    {
      type: "RESOURCE",
      label: "드라이브",
      icon: "Share2",
      description: "파일 및 자료를 공유하는 노드",
      features: [
        "다중 파일 업로드",
        "파일 목록 표시",
        "파일 다운로드 기능",
        "최대 3개 파일 미리보기"
      ],
      useCase: "자료 공유, 파일 관리"
    },
    {
      type: "POST",
      label: "게시물",
      icon: "FileImage",
      description: "스튜디오 게시물을 워크스페이스에 임베드하는 노드",
      features: [
        "게시물 ID로 연결",
        "작성자 정보 표시",
        "게시물 내용 미리보기",
        "이미지 썸네일 표시",
        "원본 게시물 링크"
      ],
      useCase: "게시물 참조, 콘텐츠 연결"
    },
    {
      type: "PHOTO",
      label: "사진",
      icon: "Image",
      description: "이미지를 직접 표시하는 노드",
      features: [
        "이미지 업로드",
        "이미지 크기에 맞춰 자동 크기 조절",
        "비율 유지",
        "리사이즈 핸들 제공"
      ],
      useCase: "이미지 표시, 포트폴리오"
    }
  ],
  operations: [
    {
      operation: "추가",
      description: "사이드바의 노드 추가 버튼을 클릭하여 새 노드를 생성합니다.",
      steps: [
        "좌측 사이드바에서 노드 타입 선택",
        "화이트보드에 노드가 생성됨",
        "노드 클릭하여 내용 편집"
      ],
      api: "POST /api/studios/[studioId]/nodes"
    },
    {
      operation: "편집",
      description: "노드를 클릭하거나 편집 버튼을 눌러 내용을 수정합니다.",
      steps: [
        "노드에 마우스 오버 시 편집 버튼 표시",
        "편집 버튼 클릭",
        "사이드바에서 내용 수정",
        "저장 버튼으로 변경사항 저장"
      ],
      api: "PATCH /api/studios/[studioId]/nodes/[nodeId]"
    },
    {
      operation: "연결",
      description: "노드의 연결점을 드래그하여 다른 노드와 연결합니다.",
      steps: [
        "노드 우측 연결점에서 드래그 시작",
        "다른 노드의 좌측 연결점에 드롭",
        "연결선 생성됨",
        "연결선에 라벨 추가 가능"
      ],
      api: "POST /api/studios/[studioId]/edges"
    },
    {
      operation: "삭제",
      description: "노드를 삭제합니다. 연결된 연결선도 함께 제거됩니다.",
      steps: [
        "노드에 마우스 오버 시 삭제 버튼 표시",
        "삭제 버튼 클릭",
        "확인 대화상자에서 확인",
        "노드 및 관련 연결선 삭제됨"
      ],
      api: "DELETE /api/studios/[studioId]/nodes/[nodeId]"
    }
  ],
  files: {
    title: "파일 시스템",
    description: "워크스페이스 파일을 통해 노드를 그룹화할 수 있습니다.",
    features: [
      "파일별로 노드 분리",
      "파일 생성/수정/삭제",
      "파일 헤더 (제목, 설명)",
      "파일 간 노드 이동"
    ],
    api: {
      list: "GET /api/studios/[studioId]/files",
      create: "POST /api/studios/[studioId]/files",
      update: "PATCH /api/studios/[studioId]/files/[fileId]",
      delete: "DELETE /api/studios/[studioId]/files/[fileId]"
    }
  }
};

// ============= 8. API 레퍼런스 =============
export const apiReference = {
  title: "API 레퍼런스",
  description: "Divetobada API 엔드포인트 문서입니다.",
  baseUrl: "https://divetobada.com/api",
  authentication: {
    description: "대부분의 API는 인증이 필요합니다. 쿠키 기반 세션 인증을 사용합니다.",
    headers: {
      "Content-Type": "application/json"
    }
  },
  endpoints: {
    posts: [
      {
        method: "GET",
        path: "/posts/for-you",
        description: "전체 피드 조회",
        auth: true,
        params: ["cursor (optional)"],
        response: "PostsPage"
      },
      {
        method: "GET",
        path: "/posts/following",
        description: "팔로잉 피드 조회",
        auth: true,
        params: ["cursor (optional)"],
        response: "PostsPage"
      },
      {
        method: "GET",
        path: "/posts/[postId]",
        description: "게시물 상세 조회",
        auth: false,
        response: "Post"
      },
      {
        method: "POST",
        path: "/posts",
        description: "게시물 생성",
        auth: true,
        body: ["title (optional)", "content", "attachments (optional)"],
        response: "Post"
      }
    ],
    studios: [
      {
        method: "GET",
        path: "/studios",
        description: "내 스튜디오 목록 조회",
        auth: true,
        response: "Studio[]"
      },
      {
        method: "POST",
        path: "/studios",
        description: "스튜디오 생성",
        auth: true,
        body: ["name", "slug", "description (optional)"],
        response: "Studio"
      },
      {
        method: "GET",
        path: "/studios/[studioId]",
        description: "스튜디오 상세 조회",
        auth: false,
        response: "Studio"
      },
      {
        method: "GET",
        path: "/studios/[studioId]/nodes",
        description: "노드 목록 조회",
        auth: true,
        params: ["fileId (optional)", "type (optional)"],
        response: "ProjectNode[]"
      },
      {
        method: "POST",
        path: "/studios/[studioId]/nodes",
        description: "노드 생성",
        auth: true,
        body: ["type", "title", "x", "y", "fileId (optional)"],
        response: "ProjectNode"
      }
    ],
    users: [
      {
        method: "GET",
        path: "/users/me",
        description: "현재 사용자 정보 조회",
        auth: true,
        response: "User"
      },
      {
        method: "GET",
        path: "/users/[userId]/followers",
        description: "팔로워 목록 조회",
        auth: false,
        response: "User[]"
      }
    ]
  }
};

// ============= 9. SDK 가이드 =============
export const sdkGuide = {
  title: "SDK를 통한 커스텀 노드 개발",
  description: "Divetobada SDK를 사용하여 자신만의 커스텀 노드를 만들고 워크스페이스에 통합할 수 있습니다.",
  overview: {
    title: "SDK 개요",
    description: "SDK를 통해 커스텀 노드를 개발하면, 워크스페이스에서 자체 제작한 노드를 사용할 수 있습니다.",
    benefits: [
      "자신의 비즈니스 로직에 맞는 노드 개발",
      "외부 서비스와의 통합",
      "고급 자동화 기능 구현",
      "커뮤니티와 노드 공유"
    ],
    status: "개발 예정 (Phase 4+)"
  },
  gettingStarted: {
    title: "시작하기",
    steps: [
      {
        step: 1,
        title: "SDK 설치",
        code: `npm install @divetobada/sdk`
      },
      {
        step: 2,
        title: "노드 컴포넌트 작성",
        code: `import { NodeComponent, NodeProps } from '@divetobada/sdk';

export default function MyCustomNode({ data, id }: NodeProps) {
  return (
    <div className="custom-node">
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  );
}`
      },
      {
        step: 3,
        title: "노드 등록",
        code: `import { registerNode } from '@divetobada/sdk';
import MyCustomNode from './MyCustomNode';

registerNode({
  type: 'MY_CUSTOM_TYPE',
  label: '내 커스텀 노드',
  icon: 'CustomIcon',
  component: MyCustomNode,
  defaultWidth: 300,
  defaultHeight: 200
});`
      },
      {
        step: 4,
        title: "워크스페이스에 통합",
        code: `// 스튜디오 설정에서 커스텀 노드 활성화
// 또는 API를 통해 노드 플러그인 등록`
      }
    ]
  },
  interface: {
    title: "노드 인터페이스",
    description: "커스텀 노드는 다음 인터페이스를 구현해야 합니다.",
    props: [
      {
        name: "data",
        type: "CustomNodeData",
        description: "노드의 데이터 객체",
        required: true
      },
      {
        name: "id",
        type: "string",
        description: "노드의 고유 ID",
        required: true
      },
      {
        name: "selected",
        type: "boolean",
        description: "노드가 선택되었는지 여부",
        required: false
      }
    ],
    methods: [
      {
        name: "onEdit",
        description: "노드 편집 시 호출되는 콜백",
        parameters: ["nodeId: string"]
      },
      {
        name: "onDelete",
        description: "노드 삭제 시 호출되는 콜백",
        parameters: ["nodeId: string"]
      }
    ]
  },
  examples: [
    {
      title: "간단한 텍스트 노드",
      description: "기본적인 텍스트 표시 노드 예제",
      code: `import { NodeComponent } from '@divetobada/sdk';

const SimpleTextNode: NodeComponent = ({ data }) => {
  return (
    <div className="p-4 border-2 border-black rounded-lg">
      <h3 className="font-bold">{data.title}</h3>
      <p className="text-sm text-gray-600">{data.content}</p>
    </div>
  );
};

export default SimpleTextNode;`
    },
    {
      title: "API 연동 노드",
      description: "외부 API와 연동하는 노드 예제",
      code: `import { NodeComponent } from '@divetobada/sdk';
import { useQuery } from '@tanstack/react-query';

const APINode: NodeComponent = ({ data, id }) => {
  const { data: apiData } = useQuery({
    queryKey: ['api-node', id],
    queryFn: async () => {
      const res = await fetch(data.apiUrl);
      return res.json();
    }
  });

  return (
    <div className="p-4 border-2 border-black rounded-lg">
      <h3 className="font-bold">{data.title}</h3>
      {apiData ? (
        <pre>{JSON.stringify(apiData, null, 2)}</pre>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default APINode;`
    }
  ],
  bestPractices: [
    "노드의 크기는 콘텐츠에 맞게 자동 조절되도록 설계하세요",
    "연결점(Handle)은 노드의 좌우에 배치하세요",
    "편집 및 삭제 기능은 호버 시에만 표시하세요",
    "노드 데이터는 JSON 형식으로 저장됩니다",
    "성능을 위해 불필요한 리렌더링을 방지하세요"
  ],
  futureFeatures: [
    "노드 마켓플레이스 (커뮤니티 노드 공유)",
    "노드 실행 기능 (자동화 워크플로우)",
    "노드 간 데이터 전달",
    "노드 그룹화 및 템플릿 기능"
  ]
};

// ============= 10. 베타 기능 =============
export const betaFeatures = {
  title: "베타 기능",
  description: "현재 개발 중이거나 실험적인 기능들입니다.",
  features: [
    {
      name: "티켓팅 시스템",
      description: "이벤트 티켓 발급 및 관리",
      status: "베타",
      url: "/ticketing-demo",
      features: [
        "이벤트 생성 및 관리",
        "티켓 타입 정의",
        "티켓 발급 및 검증"
      ]
    },
    {
      name: "멤버십 결제",
      description: "크리에이터 구독 결제 시스템",
      status: "베타",
      url: "/membership/payment",
      features: [
        "구독 플랜 설정",
        "결제 처리",
        "구독 관리"
      ]
    },
    {
      name: "크리에이터 대시보드",
      description: "크리에이터 전용 관리 도구",
      status: "베타",
      url: "/creator/dashboard/membership",
      features: [
        "구독자 통계",
        "수익 관리",
        "콘텐츠 분석"
      ]
    },
    {
      name: "구독 관리",
      description: "사용자 구독 현황 확인",
      status: "베타",
      url: "/user/subscriptions",
      features: [
        "구독 목록",
        "구독 취소",
        "결제 내역"
      ]
    }
  ],
  warning: "베타 기능은 변경되거나 제거될 수 있습니다. 프로덕션 환경에서의 사용은 권장하지 않습니다."
};

// ============= 11. FAQ =============
export const faq = [
  {
    question: "스튜디오와 일반 포스트의 차이는 무엇인가요?",
    answer: "일반 포스트는 SNS 스타일의 짧은 글이고, 스튜디오는 블로그 형식의 긴 콘텐츠를 위한 공간입니다. 스튜디오에서는 제목이 있고, Notion 스타일의 에디터를 사용할 수 있습니다."
  },
  {
    question: "여러 개의 스튜디오를 만들 수 있나요?",
    answer: "네, 하나의 계정으로 여러 스튜디오를 만들 수 있습니다. 각 스튜디오는 독립적인 브랜딩과 콘텐츠를 가질 수 있습니다."
  },
  {
    question: "게시물을 수정하거나 삭제할 수 있나요?",
    answer: "네, 본인이 작성한 게시물은 언제든 수정하거나 삭제할 수 있습니다. 게시물 우측 상단의 메뉴(⋮)를 클릭하세요."
  },
  {
    question: "이미지 업로드 용량 제한이 있나요?",
    answer: "개별 이미지는 최대 4MB까지 업로드 가능하며, 한 게시물당 최대 10개의 이미지를 첨부할 수 있습니다."
  },
  {
    question: "워크스페이스 노드는 어떻게 사용하나요?",
    answer: "스튜디오의 워크스페이스 탭에서 노드를 추가하고 연결하여 프로젝트를 시각적으로 관리할 수 있습니다. 각 노드는 타입에 따라 다른 기능을 제공합니다."
  },
  {
    question: "커스텀 노드를 만들 수 있나요?",
    answer: "현재는 개발 예정입니다. 향후 SDK를 통해 커스텀 노드를 개발하고 공유할 수 있을 예정입니다."
  }
];

// ============= 12. 커뮤니티 가이드라인 =============
export const communityGuidelines = [
  {
    title: "존중과 배려",
    rules: [
      "모든 사용자를 존중하고 배려하세요",
      "건설적인 비판은 환영하지만, 인신공격은 금지됩니다",
      "다양한 의견과 문화를 존중하세요"
    ]
  },
  {
    title: "콘텐츠 정책",
    rules: [
      "저작권을 침해하는 콘텐츠 금지",
      "폭력적, 선정적, 혐오 발언 금지",
      "스팸 및 광고성 게시물 금지",
      "허위 정보 유포 금지"
    ]
  },
  {
    title: "계정 보안",
    rules: [
      "계정 정보를 타인과 공유하지 마세요",
      "강력한 비밀번호를 사용하세요",
      "의심스러운 활동을 발견하면 즉시 신고하세요"
    ]
  }
];

// ============= 13. Team Bada 서비스 =============
export const teamBadaServices = [
  {
    name: "Vessel",
    description: "Medium 스타일의 블로그 플랫폼 - 깊이있는 스토리를 공유하세요",
    url: "https://www.vessel.today/",
    badge: "블로그"
  }
];

// ============= 14. 공식 채널 =============
export const officialChannel = {
  channelId: "UC9uSl4n2Zmz__HciYpWyASw",
  title: "Divetobada 공식 채널",
  description: "최신 소식과 튜토리얼을 확인하세요"
};

