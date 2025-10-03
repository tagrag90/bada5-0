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

  const storedState = cookies().get("state")?.value;
  const storedCodeVerifier = cookies().get("code_verifier")?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const googleUser = await kyInstance
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<{ id: string; name: string; email: string }>();

    const existingUser = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      // TestFlight 환경에서는 창을 닫고 부모 창에 메시지 전송
      const isTestFlightCallback = cookies().get("testflight")?.value === 'true';
      
      if (isTestFlightCallback) {
        // TestFlight 쿠키 정리
        cookies().delete("testflight");
        
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
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // TestFlight 환경에서는 창을 닫고 부모 창에 메시지 전송
    const isTestFlightCallback = cookies().get("testflight")?.value === 'true';
    
    if (isTestFlightCallback) {
      // TestFlight 쿠키 정리
      cookies().delete("testflight");
      
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
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
