// APNs 설정 파일
// 실제 배포 시에는 환경 변수로 관리해야 합니다

export const APNS_CONFIG = {
  // Apple Developer Console에서 생성한 실제 값들
  keyId: process.env.APNS_KEY_ID || 'VZ2A986DF8', // 실제 Key ID
  teamId: process.env.APNS_TEAM_ID || '395U64X6M7', // 실제 Team ID
  bundleId: process.env.APNS_BUNDLE_ID || 'Swift.DiveToBada-iOS',
  
  // APNs 키 파일 경로 (실제로는 서버에 업로드 필요)
  keyFile: process.env.APNS_KEY_FILE || 'AuthKey_VZ2A986DF8.p8',
  
  // 개발 환경에서는 false, 프로덕션에서는 true
  production: process.env.APNS_PRODUCTION === 'true',
  
  // APNs 서버 URL
  server: process.env.APNS_PRODUCTION === 'true' 
    ? 'api.push.apple.com'
    : 'api.development.push.apple.com'
};

// JWT 토큰 생성을 위한 설정
export const JWT_CONFIG = {
  algorithm: 'ES256' as const,
  issuer: APNS_CONFIG.teamId,
  issuedAt: Math.floor(Date.now() / 1000),
  expiresIn: '1h'
};
