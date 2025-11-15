import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // TestFlight 파라미터 확인
  const isTestFlight = req.nextUrl.searchParams.get('testflight') === 'true';

  console.log("[Google OAuth Login] 로그인 시작:", {
    hasState: !!state,
    hasCodeVerifier: !!codeVerifier,
    isTestFlight,
    url: req.url,
    origin: req.headers.get("origin"),
  });

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  console.log("[Google OAuth Login] 인증 URL 생성 완료:", url.toString());

  const cookieStore = await cookies();

  cookieStore.set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookieStore.set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  console.log("[Google OAuth Login] 쿠키 설정 완료:", {
    stateSet: true,
    codeVerifierSet: true,
    isProduction: process.env.NODE_ENV === "production",
  });

  // TestFlight 정보를 쿠키에 저장
  if (isTestFlight) {
    cookieStore.set("testflight", "true", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
  }

  return Response.redirect(url);
}
