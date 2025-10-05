"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo.png";

export default function LoginButtonWidget() {
  const [params, setParams] = useState({
    redirect: 'http://localhost:5173/sso',
    theme: 'light',
    service: 'external'
  });

  useEffect(() => {
    // 클라이언트에서만 URL 파라미터 읽기
    const searchParams = new URLSearchParams(window.location.search);
    setParams({
      redirect: searchParams.get('redirect') || 'http://localhost:5173/sso',
      theme: searchParams.get('theme') || 'light',
      service: searchParams.get('service') || 'external'
    });
  }, []);

  const handleLogin = () => {
    // 부모 창을 Divetobada 로그인 페이지로 리다이렉트
    const loginUrl = `${window.location.origin}/auth/sso?service=${params.service}&redirect=${encodeURIComponent(params.redirect)}`;
    
    if (window.parent !== window) {
      // iframe 내부에서 실행 중
      window.parent.location.href = loginUrl;
    } else {
      // 직접 페이지로 접근
      window.location.href = loginUrl;
    }
  };

  return (
    <div className={`p-3 ${params.theme === 'dark' ? 'dark' : ''}`}>
      <Button
        onClick={handleLogin}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg transition-all hover:scale-[1.02]"
        size="lg"
      >
        <div className="relative w-5 h-5">
          <Image
            src={Logo}
            alt="Divetobada"
            fill
            className="object-contain"
          />
        </div>
        Login with Divetobada
      </Button>
    </div>
  );
}

