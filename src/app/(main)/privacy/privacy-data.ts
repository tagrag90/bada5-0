// 개인정보처리방침 데이터 정의

export interface PrivacyDataItem {
  category: string;
  items: string[];
  purpose: string;
  retention: string;
  required: "필수" | "선택" | "자동생성";
}

export interface ThirdPartyService {
  name: string;
  purpose: string;
  dataShared: string[];
  website: string;
}

export interface ContactInfo {
  role: string;
  name: string;
  email: string;
  note?: string;
}

// 개인정보 수집 항목 데이터
export const privacyDataItems: PrivacyDataItem[] = [
  {
    category: "회원가입 정보",
    items: ["이메일 주소", "사용자명(아이디)", "비밀번호(암호화 저장)"],
    purpose: "서비스 이용, 본인 확인, 로그인 인증",
    retention: "회원 탈퇴 시까지",
    required: "필수"
  },
  {
    category: "OAuth 로그인 정보",
    items: ["Google ID", "Google 계정 이름", "Google 이메일"],
    purpose: "간편 로그인 서비스 제공",
    retention: "회원 탈퇴 시까지",
    required: "선택"
  },
  {
    category: "프로필 정보",
    items: ["프로필 사진", "표시명", "자기소개"],
    purpose: "프로필 표시, 사용자 식별",
    retention: "회원 탈퇴 시까지",
    required: "선택"
  },
  {
    category: "서비스 이용 정보",
    items: ["게시물 내용", "댓글", "좋아요", "북마크", "팔로우 관계"],
    purpose: "서비스 제공, 개인화된 콘텐츠 제공",
    retention: "회원 탈퇴 시까지 (단, 게시물은 사용자가 직접 삭제 시까지)",
    required: "자동생성"
  },
  {
    category: "파일 업로드 정보",
    items: ["업로드 이미지", "업로드 동영상", "파일 메타데이터"],
    purpose: "콘텐츠 저장 및 표시",
    retention: "파일 삭제 시까지",
    required: "선택"
  },
  {
    category: "시스템 정보",
    items: ["가입일시", "최종 접속일시", "세션 정보"],
    purpose: "서비스 운영, 보안 관리",
    retention: "회원 탈퇴 후 30일",
    required: "자동생성"
  }
];

// 제3자 서비스 연동 정보
export const thirdPartyServices: ThirdPartyService[] = [
  {
    name: "Vercel Blob",
    purpose: "파일 저장 및 CDN 서비스",
    dataShared: ["업로드 파일", "파일 메타데이터"],
    website: "https://vercel.com/docs/storage/vercel-blob"
  },
  {
    name: "Google OAuth",
    purpose: "소셜 로그인 서비스",
    dataShared: ["Google ID", "이름", "이메일"],
    website: "https://developers.google.com/identity"
  },
  {
    name: "Vercel",
    purpose: "웹사이트 호스팅 및 배포",
    dataShared: ["서비스 이용 로그", "접속 IP"],
    website: "https://vercel.com"
  }
];

// 연락처 정보
export const contactInfo: ContactInfo = {
  role: "개인정보 보호책임자",
  name: "박준서",
  email: "teambada1206@gmail.com",
  note: "문의는 이메일로만 접수됩니다"
};

// 구제기관 정보
export const remedyOrganizations = [
  {
    name: "개인정보 침해신고센터",
    website: "https://privacy.go.kr",
    phone: "국번없이 118"
  },
  {
    name: "개인정보 분쟁조정위원회", 
    website: "https://www.kopico.go.kr",
    phone: "1833-6972"
  },
  {
    name: "대검찰청 사이버범죄수사단",
    website: "https://www.spo.go.kr",
    phone: "02-3480-3573"
  },
  {
    name: "경찰청 사이버안전국",
    website: "https://cyberbureau.police.go.kr",
    phone: "182"
  }
];

// 정책 기본 정보
export const policyInfo = {
  serviceName: "Bada",
  companyName: "Studio_bada",
  effectiveDate: "2024년 12월 28일",
  lastUpdated: "2024년 12월 28일",
  version: "1.0"
};
