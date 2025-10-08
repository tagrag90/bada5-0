export const docsInfo = {
  serviceName: "Divetobada",
  version: "1.0",
  lastUpdated: "2025년 10월 5일",
};

export const gettingStarted = [
  {
    title: "회원가입",
    description: "이메일과 비밀번호로 간단하게 가입할 수 있습니다.",
    steps: [
      "우측 상단 '회원가입' 버튼 클릭",
      "이메일, 사용자명, 비밀번호 입력",
      "이메일 인증 (선택사항)",
      "프로필 설정 완료"
    ]
  },
  {
    title: "프로필 꾸미기",
    description: "나만의 개성있는 프로필을 만들어보세요.",
    steps: [
      "프로필 이미지 업로드",
      "자기소개 작성",
      "관심사 및 스킬 태그 추가",
      "소셜 링크 연결"
    ]
  },
  {
    title: "첫 게시물 작성",
    description: "여러분의 창작물과 이야기를 팬들과 공유해보세요.",
    steps: [
      "홈 피드에서 '글쓰기' 버튼 클릭",
      "텍스트, 이미지, 링크 추가",
      "해시태그로 주제 분류",
      "게시 버튼으로 공유"
    ]
  }
];

export const studioGuide = {
  whatIsStudio: {
    title: "스튜디오란?",
    description: "스튜디오는 크리에이터를 위한 전문 공간입니다. 블로그 형식의 콘텐츠를 발행하고, 구독자와 소통할 수 있습니다.",
    features: [
      "📝 블로그 스타일 에디터",
      "👥 구독자 관리",
      "📊 콘텐츠 분석",
      "🎨 커스텀 브랜딩",
    ]
  },
  howToCreate: {
    title: "스튜디오 만들기",
    steps: [
      "좌측 메뉴에서 '스튜디오' 클릭",
      "'스튜디오 생성하기' 버튼 클릭",
      "스튜디오 이름과 슬러그(URL) 입력",
      "설명과 타입 선택",
      "생성 완료!"
    ]
  },
  posting: {
    title: "스튜디오에서 글쓰기",
    description: "Notion 스타일의 에디터로 전문적인 콘텐츠를 작성하세요.",
    features: [
      "제목과 본문 분리",
      "이미지 인라인 삽입",
      "드래그 앤 드롭으로 순서 변경",
      "링크 미리보기 자동 생성"
    ]
  }
};

export const features = [
  {
    icon: "✍️",
    title: "포스팅",
    description: "텍스트, 이미지, 링크를 자유롭게 조합해 게시물을 작성하세요.",
    tips: [
      "해시태그(#)로 주제 분류",
      "@멘션으로 다른 사용자 태그",
      "이미지는 최대 10장까지 업로드 가능"
    ]
  },
  {
    icon: "🔍",
    title: "탐색",
    description: "다양한 크리에이터와 창작 콘텐츠를 발견하세요.",
    tips: [
      "For You 피드에서 추천 콘텐츠 확인",
      "Following 피드에서 팔로우한 크리에이터의 글 보기",
      "검색으로 특정 주제나 크리에이터 찾기"
    ]
  },
  {
    icon: "💬",
    title: "소통",
    description: "좋아요, 댓글, 리포스트로 팬과 크리에이터가 직접 소통하세요.",
    tips: [
      "댓글로 생각 공유하고 피드백 받기",
      "북마크로 나중에 읽을 콘텐츠 저장",
      "알림에서 모든 소통 활동 확인"
    ]
  },
  {
    icon: "🎬",
    title: "스튜디오",
    description: "크리에이터로서 전문적인 콘텐츠를 발행하세요.",
    tips: [
      "블로그 스타일 에디터 활용",
      "구독자와의 깊이있는 소통",
      "콘텐츠 시리즈 관리"
    ]
  }
];

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
    question: "비공개 계정으로 설정할 수 있나요?",
    answer: "현재는 모든 계정이 공개 설정입니다. 향후 업데이트에서 비공개 기능이 추가될 예정입니다."
  },
  {
    question: "모바일 앱이 있나요?",
    answer: "현재는 웹 버전만 제공되며, 모바일 브라우저에서도 최적화되어 사용 가능합니다. 네이티브 앱은 개발 예정입니다."
  }
];

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

export const teamBadaServices = [
  {
    name: "Vessel",
    description: "Medium 스타일의 블로그 플랫폼 - 깊이있는 스토리를 공유하세요",
    url: "https://www.vessel.today/",
    badge: "블로그"
  }
];

export const experimentalFeatures = [
  {
    name: "티켓팅 시스템",
    description: "이벤트 티켓 발급",
    url: "/ticketing-demo",
    status: "베타"
  },
  {
    name: "멤버십 결제",
    description: "결제 시스템 데모",
    url: "/membership/payment/artist_jun",
    status: "베타"
  },
  {
    name: "크리에이터 대시보드",
    description: "창작자 관리 도구",
    url: "/creator/dashboard/membership",
    status: "베타"
  },
  {
    name: "내 구독 관리",
    description: "구독 현황 확인",
    url: "/user/subscriptions",
    status: "베타"
  }
];

export const officialChannel = {
  channelId: "UC9uSl4n2Zmz__HciYpWyASw",
  title: "Divetobada 공식 채널",
  description: "최신 소식과 튜토리얼을 확인하세요"
};

export const ssoIntegration = {
  title: "Login with Divetobada",
  description: "Divetobada 계정을 다른 서비스의 마스터 인증 시스템으로 사용하세요",
  benefits: [
    "하나의 Divetobada 계정으로 모든 Team Bada 서비스 접근",
    "이메일 기반 자동 계정 매칭 및 생성",
    "안전한 JWT 기반 인증 (5분 유효)",
    "Google Login처럼 간편한 통합"
  ],
  howItWorks: [
    "외부 서비스에서 'Login with Divetobada' 버튼 클릭",
    "Divetobada 로그인 페이지로 자동 이동",
    "로그인 완료 시 SSO 토큰 생성",
    "외부 서비스로 리다이렉트 및 자동 로그인"
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
  ],
  example: "현재 Vessel 블로그 플랫폼에서 성공적으로 작동 중"
};

