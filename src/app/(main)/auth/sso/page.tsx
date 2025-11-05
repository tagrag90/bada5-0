"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../../SessionProvider";
import LoadingAnimation from "@/components/ui/loading-animation";

/**
 * 외부 서비스에서 Divetobada로 SSO 로그인 요청 처리
 * 
 * Flow:
 * 1. 외부 서비스에서 /auth/sso?service=vessel&redirect=URL로 이동
 * 2. 로그인 안되어 있으면 -> /login으로 리다이렉트
 * 3. 로그인 되어 있으면 -> SSO 토큰 생성 후 redirect URL로 이동
 */
export default function SSOAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();

  const service = searchParams.get('service') || 'external';
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    const handleSSO = async () => {
      // 로그인 확인
      if (!user) {
        // 로그인 안되어 있으면 로그인 페이지로
        // 로그인 후 다시 이 페이지로 돌아오도록 설정
        const returnUrl = `/auth/sso?service=${service}&redirect=${encodeURIComponent(redirectUrl || '')}`;
        router.push(`/login?return=${encodeURIComponent(returnUrl)}`);
        return;
      }

      // 리다이렉트 URL 없으면 홈으로
      if (!redirectUrl) {
        router.push('/');
        return;
      }

      try {
        // SSO 토큰 발급
        const response = await fetch(`/api/sso/${service}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('SSO 토큰 발급 실패');
        }

        const data = await response.json();

        if (data.success && data.token) {
          // 외부 서비스로 리다이렉트 (토큰 포함)
          const separator = redirectUrl.includes('?') ? '&' : '?';
          const finalUrl = `${redirectUrl}${separator}token=${data.token}`;
          
          // 외부 URL로 이동
          window.location.href = finalUrl;
        } else {
          throw new Error('잘못된 응답');
        }
      } catch (error) {
        console.error('SSO Error:', error);
        // 에러 발생 시 홈으로
        router.push('/');
      }
    };

    handleSSO();
  }, [user, service, redirectUrl, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <LoadingAnimation />
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">
          {user ? '연결 중...' : '로그인이 필요합니다'}
        </h2>
        <p className="text-muted-foreground">
          {user 
            ? `${service}로 안전하게 이동하고 있습니다`
            : '잠시 후 로그인 페이지로 이동합니다'
          }
        </p>
      </div>
    </div>
  );
}

