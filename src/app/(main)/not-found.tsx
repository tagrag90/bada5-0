"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, ArrowLeft, Palette, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 디자인 */}
        <div className="relative">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            404
          </div>
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
            🎨
          </div>
        </div>

        {/* 메인 메시지 */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            크리에이터를 잃어버렸어요! 😅
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            요청하신 페이지를 찾을 수 없습니다.
            <br />
            하지만 새로운 아이디어를 찾을 수는 있어요!
          </p>
        </div>

        {/* 검색창 */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="크리에이터나 작품을 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 text-base"
              />
            </div>
            <Button type="submit" className="h-12 px-6">
              검색
            </Button>
          </form>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild variant="default" size="lg" className="min-w-[140px]">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              홈으로 가기
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[140px]">
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              이전으로
            </Link>
          </Button>
        </div>

        {/* 추천 섹션 */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            대신 이건 어떠세요?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild variant="ghost" className="h-auto p-4 flex-col gap-2 hover:bg-primary/10">
              <Link href="/explore">
                <Palette className="h-6 w-6 text-primary" />
                <span className="font-medium">작품 탐색</span>
                <span className="text-sm text-muted-foreground">새로운 영감을 찾아보세요</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" className="h-auto p-4 flex-col gap-2 hover:bg-primary/10">
              <Link href="/users">
                <Users className="h-6 w-6 text-primary" />
                <span className="font-medium">크리에이터</span>
                <span className="text-sm text-muted-foreground">다른 아티스트 만나기</span>
              </Link>
            </Button>
          </div>
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
