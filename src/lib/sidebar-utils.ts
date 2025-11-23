/**
 * 사이드바 표시 로직을 통합 관리하는 유틸리티 함수들
 * 
 * 근본 원칙:
 * - 스튜디오 관련 페이지에서 selectedStudioId가 있으면 사이드바 표시
 * - 단일 소스에서 판단하여 일관성 유지
 */

/**
 * 스튜디오 관련 페이지인지 확인
 */
export function isStudioRelatedPage(pathname: string | null): boolean {
  if (!pathname) return false;
  
  // 스튜디오 관련 경로 패턴
  const studioPatterns = [
    /^\/studios\/[^/]+$/,                    // /studios/[studioId]
    /^\/studios\/[^/]+\/workspace$/,        // /studios/[studioId]/workspace
    /^\/studios\/[^/]+\/workspace\/[^/]+$/,  // /studios/[studioId]/workspace/[fileId]
    /^\/studios\/[^/]+\/settings/,           // /studios/[studioId]/settings
  ];
  
  return studioPatterns.some(pattern => pattern.test(pathname));
}

/**
 * 워크스페이스 파일 페이지인지 확인 (특별 처리 필요)
 */
export function isWorkspaceFilePage(pathname: string | null): boolean {
  if (!pathname) return false;
  return /^\/studios\/[^/]+\/workspace\/[^/]+$/.test(pathname);
}

/**
 * 사이드바에 콘텐츠 블록을 표시할지 결정
 * 
 * @param sidebarType - 현재 사이드바 타입
 * @param pathname - 현재 경로
 * @param discordData - 디스코드 사이드바 데이터
 * @returns 사이드바 콘텐츠 블록 표시 여부
 */
export function shouldShowSidebarContent(
  sidebarType: string,
  pathname: string | null,
  discordData: { selectedStudioId?: string | null; fileId?: string | null } | null
): boolean {
  // 설정 페이지는 항상 표시
  if (pathname?.startsWith('/settings')) return true;
  
  // 독스 페이지는 항상 표시
  if (sidebarType === 'docs') return true;
  
  // 스튜디오/디스코드 사이드바인 경우
  if (sidebarType === 'studio' || sidebarType === 'discord') {
    // 스튜디오 관련 페이지이고 selectedStudioId가 있으면 표시
    if (isStudioRelatedPage(pathname) && discordData?.selectedStudioId) {
      return true;
    }
  }
  
  return false;
}

/**
 * 사이드바 우측 칼럼(채널 목록)을 표시할지 결정
 * 
 * @param pathname - 현재 경로
 * @param discordData - 디스코드 사이드바 데이터
 * @returns 우측 칼럼 표시 여부
 */
export function shouldShowRightColumn(
  pathname: string | null,
  discordData: { selectedStudioId?: string | null; fileId?: string | null } | null
): boolean {
  // 설정 페이지는 항상 표시
  if (pathname?.startsWith('/settings')) return true;
  
  // 스튜디오 관련 페이지이고 selectedStudioId가 있으면 표시
  if (isStudioRelatedPage(pathname) && discordData?.selectedStudioId) {
    return true;
  }
  
  return false;
}

