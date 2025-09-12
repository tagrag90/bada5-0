"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";

export default function NotFound() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 바다 로고 */}
        <div className="flex justify-center mb-4">
          <Image
            src={Logo}
            alt="Bada Logo"
            width={80}
            height={80}
            className="opacity-80"
          />
        </div>

        {/* 404 디자인 */}
        <div className="relative">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            404
          </div>
        </div>

        {/* 메인 메시지 */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            아.. 여기쯤이였는데... 이상하네
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            분명 우리가 항해 중 경로 실수를 했나봅니다.
            <br />
            당장 찾을 수 없으니 대안을 찾아보죠
          </p>
        </div>


        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild variant="default" size="lg" className="min-w-[140px]">
            <Link href="/">
              홈으로 가기
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[140px]">
            <Link href="javascript:history.back()">
              이전으로
            </Link>
          </Button>
        </div>


        {/* 재미있는 메시지 */}
        <div className="text-sm text-muted-foreground">
          <p className="italic">
            &ldquo;창의성은 길을 잃는 법을 아는 것이다&rdquo; - Picasso
          </p>
        </div>
      </div>
    </div>
  );
}
