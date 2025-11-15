"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/app/(main)/SessionProvider";
import SearchField from "@/components/SearchField";
import Logo from "@/assets/logo.png";

interface IntegratedHeaderProps {
  unreadNotificationsCount: number;
}

export default function IntegratedHeader({
  unreadNotificationsCount,
}: IntegratedHeaderProps) {
  const { user } = useSession();

  if (!user) {
    // 로그인하지 않은 경우 간단한 헤더만 표시
    return (
      <div className="sticky top-0 z-50 pt-4 pb-2">
        {/* 호버된 헤더 박스 */}
        <div className="mx-auto flex max-w-fit flex-col items-center gap-3 px-4 py-3 bg-white border-2 border-black rounded-xl shadow-sm">
          {/* 첫 번째 줄 */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src={Logo}
                alt="logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <Link href="/login">
              <Button variant="outline" className="font-semibold">
                로그인
              </Button>
            </Link>
          </div>
          {/* 두 번째 줄: 검색 필드 */}
          <div className="w-full max-w-md">
            <SearchField />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 pt-4 pb-2">
      {/* 호버된 헤더 박스 - 상단 중앙 */}
      <div className="mx-auto flex max-w-fit flex-col items-center gap-3 px-4 py-3 bg-white border-2 border-black rounded-xl shadow-sm">
        {/* 첫 번째 줄: 로고 */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={Logo}
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
        </div>

        {/* 두 번째 줄: 검색 필드 */}
        <div className="w-full max-w-md">
          <SearchField />
        </div>
      </div>
    </div>
  );
}

