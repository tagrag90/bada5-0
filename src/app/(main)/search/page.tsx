import TrendsSidebar from "@/components/TrendsSidebar";
import SearchField from "@/components/SearchField";
import { Metadata } from "next";
import SearchResults from "./SearchResults";

interface PageProps {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: q ? `Search results for "${q}"` : "Search",
  };
}

export default function Page({ searchParams: { q } }: PageProps) {
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
          
          {/* 검색어 없을 때 안내 */}
          {!q && (
            <div className="border-t border-border pt-6 text-center">
              <p className="text-muted-foreground">
                검색어를 입력해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}
