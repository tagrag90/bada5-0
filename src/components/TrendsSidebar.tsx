import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Link from "next/link";
import BrandSidebar from "./BrandSidebar";
import { Loader2 } from "lucide-react";

interface TrendsSidebarProps {
  className?: string;
}

export default async function TrendsSidebar({ className }: TrendsSidebarProps) {
  return (
    <div
      className={cn(
        "h-fit space-y-5",
        className,
      )}
    >
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {/* 브랜드 사이드바만 유지 */}
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

                {/* 404 탐험하기 버튼 */}
                <Link href="/nonexistent-page" className="block">
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    404 탐험하기
                  </div>
                </Link>

                {/* Docs 페이지 */}
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
