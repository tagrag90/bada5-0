import jwt from 'jsonwebtoken';

const SSO_SECRET = process.env.SHARED_SSO_SECRET || process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const SSO_EXPIRES_IN = '5m'; // 5분 유효

interface SSOUser {
  id: string;
  email: string | null;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface SSOTokenPayload {
  userId: string;
  email: string | null;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  issuer: string;
  timestamp: number;
}

/**
 * Vessel용 SSO 토큰 생성
 * @param user - Divetobada 사용자 정보
 * @returns JWT 토큰 문자열
 */
export function createVesselSSOToken(user: SSOUser): string {
  const payload: SSOTokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    issuer: 'divetobada',
    timestamp: Date.now(),
  };

  const token = jwt.sign(payload, SSO_SECRET, {
    expiresIn: SSO_EXPIRES_IN,
  });

  return token;
}

/**
 * SSO 토큰 검증 (나중에 Divetobada에서도 검증 필요시)
 * @param token - JWT 토큰
 * @returns 디코딩된 페이로드 또는 null
 */
export function verifyVesselSSOToken(token: string): SSOTokenPayload | null {
  try {
    const decoded = jwt.verify(token, SSO_SECRET) as SSOTokenPayload;
    
    // 발급자 확인
    if (decoded.issuer !== 'divetobada') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('SSO token verification failed:', error);
    return null;
  }
}

/**
 * Vessel SSO URL 생성
 * @param token - SSO 토큰
 * @param redirectPath - Vessel 내 리다이렉트 경로 (기본: /editor)
 * @returns 완성된 Vessel SSO URL
 */
export function getVesselSSOUrl(token: string, redirectPath: string = '/editor'): string {
  const vesselUrl = process.env.NEXT_PUBLIC_VESSEL_URL || 'https://vessel.today';
  return `${vesselUrl}/sso?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}`;
}

