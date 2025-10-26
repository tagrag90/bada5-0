import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // TestFlight 파라미터 확인
  const isTestFlight = req.nextUrl.searchParams.get('testflight') === 'true';

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

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
