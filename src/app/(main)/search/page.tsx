import TrendingTopics from "@/components/TrendingTopics";
import SearchField from "@/components/SearchField";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SearchResults from "./SearchResults";

interface PageProps {
  searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search",
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0">
        <div className="rounded-2xl bg-card p-6">
          {/* 검색 제목과 입력필드 */}
          <div className="mb-6">
            <h1 className="text-left text-2xl font-bold mb-2">
              {q ? "검색 결과" : "Search"}
            </h1>
            <p className="text-left text-muted-foreground mb-5">
              {q ? "" : "찾아보기"}
            </p>
            <SearchField />
          </div>
          
          {/* 검색 결과 섹션 */}
          {q && (
            <div className="border-t border-border pt-6">
              <h2 className="line-clamp-2 break-all text-left text-xl font-semibold mb-6">
                &quot;{q}&quot;에 대한 검색 결과
              </h2>
              <SearchResults query={q} />
            </div>
          )}
          
          {/* 모바일 트렌드 섹션 - 검색어가 없을 때만 표시 */}
          {!q && (
            <div className="border-t border-border pt-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  검색어를 입력해주세요.
                </p>
              </div>
              
              {/* 모바일에서만 보이는 트렌드 */}
              <div className="block md:hidden">
                <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                  <TrendingTopics className="mt-6" />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
