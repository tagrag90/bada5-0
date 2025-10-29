import Link from "next/link";

export default function DocsHome() {
  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold mb-3">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Dive to Bada 프로젝트 문서
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">최근 업데이트</h2>
        <div className="space-y-4">
          {/* 터미널 창 스타일 */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            {/* 터미널 헤더 */}
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-300 text-sm font-mono ml-2">divetobada.com</span>
              </div>
              <div className="text-slate-400 text-xs font-mono">bash</div>
            </div>

            {/* 터미널 콘텐츠 */}
            <div className="p-4 font-mono text-sm">
              {/* 업데이트 목록 */}
              <div className="space-y-3 text-slate-200">
                {/* 코스모스 기능 제거됨 */}

                <div className="flex items-start justify-between">
                  <span className="flex-1">사소한요소수정25.10.10.</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.10</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="flex-1">바다사이드바제작및팔로워확인기능구현25.10.10.</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.10</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="flex-1">독스수정및잔잔바리정리 25.10.8.</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.8</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="flex-1">Update SSO widget to use production URLs</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.6</span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="flex-1">Update .gitignore to exclude sample files</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">시작하기</h2>
        <div className="space-y-3">
          <Link href="/docs/getting-started" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              빠른 시작 →
            </div>
            <p className="text-sm text-muted-foreground">회원가입 및 기본 사용법</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">컴포넌트</h2>
        <div className="space-y-3">
          <Link href="/docs/components/button" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              Button →
            </div>
            <p className="text-sm text-muted-foreground">버튼 컴포넌트</p>
          </Link>
          <Link href="/docs/components/card" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              Card →
            </div>
            <p className="text-sm text-muted-foreground">카드 컴포넌트</p>
          </Link>
          <Link href="/docs/components/input" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              Input →
            </div>
            <p className="text-sm text-muted-foreground">입력 필드</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">브랜드</h2>
        <div className="space-y-3">
          <Link href="/docs/brand/logo" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              로고 →
            </div>
            <p className="text-sm text-muted-foreground">로고 파일 다운로드</p>
          </Link>
          <Link href="/docs/brand/colors" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              색상 →
            </div>
            <p className="text-sm text-muted-foreground">브랜드 색상 팔레트</p>
          </Link>
          <Link href="/docs/brand/typography" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              타이포그래피 →
            </div>
            <p className="text-sm text-muted-foreground">폰트 정보</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">기능</h2>
        <div className="space-y-3">
          <Link href="/docs/studio" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              스튜디오 →
            </div>
            <p className="text-sm text-muted-foreground">크리에이터 블로그 공간</p>
          </Link>
          <Link href="/docs/sso" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              SSO 통합 →
            </div>
            <p className="text-sm text-muted-foreground">Login with Divetobada</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">실험실</h2>
        <div className="space-y-3">
          <Link href="/docs/lab" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              실험실 홈 →
            </div>
            <p className="text-sm text-muted-foreground">개발 중인 베타 기능들</p>
          </Link>
          <Link href="/docs/lab/ticketing" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              티켓팅 시스템 →
            </div>
            <p className="text-sm text-muted-foreground">이벤트 티켓 발급</p>
          </Link>
          <Link href="/docs/lab/membership" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              멤버십 결제 →
            </div>
            <p className="text-sm text-muted-foreground">크리에이터 구독 시스템</p>
          </Link>
          <Link href="/docs/lab/dashboard" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              크리에이터 대시보드 →
            </div>
            <p className="text-sm text-muted-foreground">콘텐츠 관리 도구</p>
          </Link>
          <Link href="/docs/lab/subscriptions" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              구독 관리 →
            </div>
            <p className="text-sm text-muted-foreground">사용자 구독 현황</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

