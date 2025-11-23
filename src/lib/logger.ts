/**
 * 개발 환경 전용 로깅 유틸리티
 * 프로덕션에서는 자동으로 제거되거나 최소화됨
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * 디버깅용 로그 (개발 환경에서만)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * 정보 로그 (개발 환경에서만)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * 경고 로그 (개발 환경에서만)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * 에러 로그 (프로덕션에서도 로깅 - 모니터링 필요)
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    // 프로덕션 환경에서도 콘솔에 출력 (Vercel 로그가 없을 경우 대비)
    if (!isDevelopment) {
      console.error('[PRODUCTION ERROR]', ...args);
    }
  },
};

