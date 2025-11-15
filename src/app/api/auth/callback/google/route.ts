import { google, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  // 디버깅: 요청 정보 로그
  console.log("[Google OAuth Callback] 요청 시작:", {
    hasCode: !!code,
    hasState: !!state,
    url: req.url,
    origin: req.headers.get("origin"),
    referer: req.headers.get("referer"),
  });

  const cookieStore = await cookies();
  const storedState = cookieStore.get("state")?.value;
  const storedCodeVerifier = cookieStore.get("code_verifier")?.value;

  // 디버깅: 쿠키 상태 로그
  console.log("[Google OAuth Callback] 쿠키 상태:", {
    hasStoredState: !!storedState,
    hasStoredCodeVerifier: !!storedCodeVerifier,
    stateMatch: state === storedState,
    allCookies: Array.from(cookieStore.getAll()).map((c) => ({
      name: c.name,
      hasValue: !!c.value,
    })),
  });

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    const errorDetails = {
      missingCode: !code,
      missingState: !state,
      missingStoredState: !storedState,
      missingStoredCodeVerifier: !storedCodeVerifier,
      stateMismatch: state !== storedState,
    };
    console.error("[Google OAuth Callback] 검증 실패:", errorDetails);
    
    // 개발 환경에서만 상세 에러 메시지 반환
    if (process.env.NODE_ENV === "development") {
      return new Response(
        JSON.stringify({ error: "OAuth 검증 실패", details: errorDetails }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(null, { status: 400 });
  }

  try {
    console.log("[Google OAuth Callback] 토큰 검증 시작");
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );
    console.log("[Google OAuth Callback] 토큰 검증 성공");

    console.log("[Google OAuth Callback] 사용자 정보 요청 시작");
    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<{ id: string; name: string; email: string }>();
    console.log("[Google OAuth Callback] 사용자 정보 획득:", {
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
    });

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      // TestFlight 환경에서는 창을 닫고 부모 창에 메시지 전송
      const isTestFlightCallback = cookieStore.get("testflight")?.value === 'true';
      
      if (isTestFlightCallback) {
        // TestFlight 쿠키 정리
        cookieStore.delete("testflight");
        
        return new Response(`
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>로그인 완료</title>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f5f5f5;
                  text-align: center;
                  padding: 20px;
                }
                .success-message {
                  background: white;
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  max-width: 400px;
                }
                .back-button {
                  background-color: #007AFF;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-size: 16px;
                  margin-top: 20px;
                  cursor: pointer;
                }
              </style>
            </head>
            <body>
              <div class="success-message">
                <h2>🎉 로그인 완료!</h2>
                <p>구글 로그인이 성공적으로 완료되었습니다.</p>
                <button class="back-button" onclick="goBack()">앱으로 돌아가기</button>
              </div>
              
              <script>
                function goBack() {
                  // 부모 창이 있으면 메시지 전송 후 창 닫기
                  if (window.opener) {
                    try {
                      // 현재 origin으로 메시지 전송 (보안 강화)
                      window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, window.location.origin);
                      window.close();
                    } catch (error) {
                      console.error('postMessage error:', error);
                      // 에러 발생 시 홈으로 이동
                      window.location.href = '/';
                    }
                  } else {
                    // 시뮬레이터나 같은 창에서 온 경우 뒤로가기 또는 홈으로
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      window.location.href = '/';
                    }
                  }
                }
                
                // 3초 후 자동으로 돌아가기
                setTimeout(() => {
                  goBack();
                }, 3000);
              </script>
            </body>
          </html>
        `, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    const username = slugify(googleUser.name) + "-" + userId.slice(0, 4);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: googleUser.name,
          googleId: googleUser.id,
          email: googleUser.email,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // TestFlight 환경에서는 창을 닫고 부모 창에 메시지 전송
    const isTestFlightCallback = cookieStore.get("testflight")?.value === 'true';

    if (isTestFlightCallback) {
      // TestFlight 쿠키 정리
      cookieStore.delete("testflight");
      
      return new Response(`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>회원가입 완료</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
                text-align: center;
                padding: 20px;
              }
              .success-message {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                max-width: 400px;
              }
              .back-button {
                background-color: #007AFF;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                margin-top: 20px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div class="success-message">
              <h2>🎉 회원가입 완료!</h2>
              <p>구글 계정으로 회원가입이 성공적으로 완료되었습니다.</p>
              <button class="back-button" onclick="goBack()">앱으로 돌아가기</button>
            </div>
            
            <script>
              function goBack() {
                // 부모 창이 있으면 메시지 전송 후 창 닫기
                if (window.opener) {
                  window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, '*');
                  window.close();
                } else {
                  // 시뮬레이터나 같은 창에서 온 경우 뒤로가기 또는 홈으로
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = '/';
                  }
                }
              }
              
              // 3초 후 자동으로 돌아가기
              setTimeout(() => {
                goBack();
              }, 3000);
            </script>
          </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error("[Google OAuth Callback] 에러 발생:", error);
    
    // 에러 상세 정보 로깅
    if (error instanceof Error) {
      console.error("[Google OAuth Callback] 에러 상세:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    if (error instanceof OAuth2RequestError) {
      console.error("[Google OAuth Callback] OAuth2RequestError:", {
        description: error.description,
        message: error.message,
      });
      
      // 개발 환경에서만 상세 에러 반환
      if (process.env.NODE_ENV === "development") {
        return new Response(
          JSON.stringify({
            error: "OAuth2RequestError",
            message: error.message,
            description: error.description,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(null, {
        status: 400,
      });
    }
    
    // 개발 환경에서만 상세 에러 반환
    if (process.env.NODE_ENV === "development") {
      return new Response(
        JSON.stringify({
          error: "서버 에러",
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(null, {
      status: 500,
    });
  }
}
