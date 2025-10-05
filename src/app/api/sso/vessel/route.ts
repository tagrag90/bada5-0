import { validateRequest } from "@/auth";
import { createVesselSSOToken, getVesselSSOUrl } from "@/lib/sso";
import { NextRequest, NextResponse } from "next/server";

/**
 * Vessel SSO 토큰 발급 API
 * POST /api/sso/vessel
 * 
 * 인증된 사용자의 정보로 Vessel 접근용 SSO 토큰을 생성합니다.
 * 
 * Request Body (optional):
 * {
 *   redirectPath?: string  // Vessel 내 리다이렉트 경로 (기본: /editor)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   token: string,
 *   ssoUrl: string,
 *   expiresIn: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      );
    }

    // Request body에서 redirect 경로 가져오기 (선택사항)
    let redirectPath = '/editor';
    try {
      const body = await request.json();
      if (body.redirectPath) {
        redirectPath = body.redirectPath;
      }
    } catch {
      // body 없으면 기본값 사용
    }

    // SSO 토큰 생성
    const token = createVesselSSOToken({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    });

    // Vessel SSO URL 생성
    const ssoUrl = getVesselSSOUrl(token, redirectPath);

    return NextResponse.json({
      success: true,
      token,
      ssoUrl,
      expiresIn: 300, // 5분 (초 단위)
    });

  } catch (error) {
    console.error("Vessel SSO token generation error:", error);
    return NextResponse.json(
      { error: "SSO 토큰 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}

