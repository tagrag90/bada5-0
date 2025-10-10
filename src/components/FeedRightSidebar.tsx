import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import WhoToFollow from "./WhoToFollow";
import StudiosToExplore from "./StudiosToExplore";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import BrandSidebar from "./BrandSidebar";
import UserProfileButton from "./UserProfileButton";

interface FeedRightSidebarProps {
  className?: string;
}

// 우측 사이드바 주석처리 - 내용물이 DiscordStyleSidebar로 이동됨
/*
export default function FeedRightSidebar({ className }: FeedRightSidebarProps) {
  return (
    <div
      className={cn(
        "h-fit space-y-5",
        className,
      )}
    >
      {/* 프로필 버튼 - 상단 *//*}
      <UserProfileButton />

      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {/* 공지사항 *//*}
        <div className="relative group">
          <div
            className="relative space-y-3 rounded-2xl bg-black p-6 shadow-md transition-all duration-500 group-hover:scale-[1.03]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="logo"
                  width={20}
                  height={20}
                />
                <span className="text-sm font-bold text-white">Notice</span>
              </div>
            </div>

            <h2 className="text-sm font-medium text-white">
              Welcome to Divetobada! 크리에이터와 팬을 직접 연결하는 새로운 엔터테인먼트 플랫폼입니다.
            </h2>
          </div>
        </div>

        <WhoToFollow />
        <StudiosToExplore />

        {/* 브랜드 사이드바 - 하단 *//*}
        <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
          <BrandSidebar />

          <div className="flex flex-col gap-6">
            <div className="flex w-full justify-end">
              <div className="flex flex-col justify-end gap-1 text-xs text-gray-400">
                <div className="text-right">
                  Email : teambada1206@gmail.com(only)
                </div>
                <div className="text-right">서비스이용약관</div>
                <Link href="/privacy">
                  <div className="text-right hover:text-foreground transition-colors cursor-pointer">개인정보처리방침</div>
                </Link>
              </div>
            </div>
            <div className="flex w-full justify-end">
              <div className="flex flex-col justify-end gap-1 text-xs">
                <Link
                  href="https://www.vessel.today"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    Vessel
                  </div>
                </Link>

                <Link
                  href="https://www.instagram.com/team_masanbaseball/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    Baseball playlist
                  </div>
                </Link>

                <Link href="/nonexistent-page" className="block">
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    404 탐험하기
                  </div>
                </Link>

                <Link href="/docs" className="block">
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    Docs
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
*/

// 임시 빈 컴포넌트 반환 (주석처리된 상태)
export default function FeedRightSidebar({ className }: FeedRightSidebarProps) {
  return null;
}
