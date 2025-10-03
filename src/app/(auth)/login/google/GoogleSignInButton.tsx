"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 구글 로그인 완료 메시지 리스너
    const handleMessage = (event: MessageEvent) => {
      // origin 검증 추가 (보안 강화)
      if (event.origin !== window.location.origin) {
        console.warn('Rejected postMessage from invalid origin:', event.origin);
        return;
      }

      if (event.data?.type === 'GOOGLE_LOGIN_SUCCESS') {
        setIsLoading(false);
        // 페이지 새로고침하여 로그인 상태 반영
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // 모바일 환경 감지 (iOS, Android + 시뮬레이터)
    const isMobile = typeof window !== 'undefined' && (
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) ||
      // iOS 시뮬레이터 감지 추가
      window.navigator.userAgent.includes('iPhone Simulator') ||
      window.navigator.userAgent.includes('iPad Simulator') ||
      // 앱 내 웹뷰 감지 (Safari가 없는 Mobile 환경)
      (window.navigator.userAgent.includes('Mobile/') && 
       !window.navigator.userAgent.includes('Safari/'))
    );

    // 디버깅용 로그
    console.log('Google Login Debug:', {
      userAgent: window.navigator.userAgent,
      isMobile: isMobile,
      hostname: window.location.hostname
    });

    if (isMobile) {
      // 모바일/시뮬레이터에서는 Safari로 이동할지 사용자에게 확인
      const userConfirm = confirm(
        '구글 로그인을 위해 Safari로 이동하시겠습니까?\n\n' +
        '로그인 완료 후 다시 앱으로 돌아와주세요.'
      );
      
      if (userConfirm) {
        // Safari로 구글 로그인 페이지 열기
        window.location.href = `${window.location.origin}/login/google?testflight=true`;
      } else {
        setIsLoading(false);
      }
    } else {
      // 데스크톱에서는 기존 방식 사용
      window.location.href = '/login/google';
    }
  };

  return (
    <Button
      variant="outline"
      className="bg-white text-black hover:bg-gray-100 hover:text-black disabled:opacity-50"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <div className="flex w-full items-center gap-2">
        <GoogleIcon />
        {isLoading ? 'Google 로그인 중...' : 'Sign in with Google'}
      </div>
    </Button>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 256 262"
    >
      <path
        fill="#4285f4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34a853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#fbbc05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
      />
      <path
        fill="#eb4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}
