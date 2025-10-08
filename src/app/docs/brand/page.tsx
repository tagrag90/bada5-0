import Link from "next/link";

export default function BrandPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>브랜드</h1>
        <p className="text-lg text-muted-foreground mt-2">
          로고, 색상, 타이포그래피
        </p>
      </div>

      <div>
        <h2>브랜드 자산</h2>
        <div className="space-y-3 mt-4">
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
          <Link href="/docs/brand/assets" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              브랜드 자산 →
            </div>
            <p className="text-sm text-muted-foreground">PDF 문서 다운로드</p>
          </Link>
        </div>
      </div>

      <div>
        <h2>소셜 미디어</h2>
        <div className="space-y-3 mt-4">
          <a href="https://www.youtube.com/@Divetobada1105" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              유튜브 →
            </div>
            <p className="text-sm text-muted-foreground">@Divetobada1105</p>
          </a>
          <a href="https://www.instagram.com/divetobada_insta/" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              인스타그램 →
            </div>
            <p className="text-sm text-muted-foreground">@divetobada_insta</p>
          </a>
          <a href="https://x.com/divetobada_twt" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              X (Twitter) →
            </div>
            <p className="text-sm text-muted-foreground">@divetobada_twt</p>
          </a>
          <a href="https://www.threads.net/@divetobada_insta" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              Threads →
            </div>
            <p className="text-sm text-muted-foreground">@divetobada_insta</p>
          </a>
        </div>
      </div>

      <div>
        <h2>파트너 서비스</h2>
        <div className="space-y-3 mt-4">
          <a href="https://www.vessel.today" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="text-lg font-medium group-hover:text-primary transition-colors">
              Vessel →
            </div>
            <p className="text-sm text-muted-foreground">vessel.today</p>
          </a>
        </div>
      </div>
    </div>
  );
}

