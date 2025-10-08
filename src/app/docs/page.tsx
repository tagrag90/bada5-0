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
    </div>
  );
}

