import Link from "next/link";

export default function DocsHome() {
  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold mb-3">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Divetobada 프로젝트 문서
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
                <div className="flex items-start justify-between">
                  <span className="flex-1 text-green-400">독스 페이지 전면 개편 - 프로젝트 구조 및 아키텍처 가이드 추가</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.01.15</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="flex-1 text-green-400">게시물 표시 개선, 사이드바 WhoToFollow 추가, 화이트보드 크기 동적 조절</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.11.03</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="flex-1 text-green-400">🗑️ 코스모스 기능 완전 제거 + UI Lab 정리</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.29</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="flex-1">Next.js 15.1.2 + React 18.3.1 버전 고정 적용</span>
                  <span className="text-slate-400 shrink-0 ml-4">2025.10.29</span>
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
        <h2 className="text-2xl font-semibold mb-6">프로젝트 개요</h2>
        <div className="space-y-3">
          <Link href="/docs/architecture" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              아키텍처 가이드 →
            </div>
            <p className="text-sm text-muted-foreground">레이아웃, 사이드바, 라우팅 구조</p>
          </Link>
          <Link href="/docs/authentication" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              인증 시스템 →
            </div>
            <p className="text-sm text-muted-foreground">로그인, SSO, 세션 관리</p>
          </Link>
          <Link href="/docs/api" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              API 레퍼런스 →
            </div>
            <p className="text-sm text-muted-foreground">엔드포인트 문서 및 사용법</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">주요 기능</h2>
        <div className="space-y-3">
          <Link href="/docs/social" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              소셜 기능 →
            </div>
            <p className="text-sm text-muted-foreground">게시물, 댓글, 팔로우 시스템</p>
          </Link>
          <Link href="/docs/studio" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              스튜디오 →
            </div>
            <p className="text-sm text-muted-foreground">크리에이터 블로그 공간</p>
          </Link>
          <Link href="/docs/workspace" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              워크스페이스 →
            </div>
            <p className="text-sm text-muted-foreground">노드 기반 화이트보드 시스템</p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">컴포넌트</h2>
        <div className="space-y-3">
          <Link href="/docs/components" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              컴포넌트 개요 →
            </div>
            <p className="text-sm text-muted-foreground">재사용 가능한 UI 컴포넌트</p>
          </Link>
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
          <Link href="/docs/brand" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              브랜드 개요 →
            </div>
            <p className="text-sm text-muted-foreground">디자인 가이드라인 및 자산</p>
          </Link>
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
        <h2 className="text-2xl font-semibold mb-6">통합</h2>
        <div className="space-y-3">
          <Link href="/docs/sso" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              SSO 통합 →
            </div>
            <p className="text-sm text-muted-foreground">Login with Divetobada</p>
          </Link>
          <Link href="/docs/sdk" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              SDK 가이드 →
            </div>
            <p className="text-sm text-muted-foreground">커스텀 노드 개발 (개발 예정)</p>
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
        </div>
      </section>
    </div>
  );
}
