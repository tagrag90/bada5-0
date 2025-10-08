export default function SocialPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>소셜 미디어</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Dive to Bada 공식 소셜 미디어 채널
        </p>
      </div>

      <div>
        <h2>YouTube</h2>
        <div className="mt-4">
          <a 
            href="https://www.youtube.com/@Divetobada1105" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @Divetobada1105
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            크리에이터 콘텐츠, 튜토리얼, 플랫폼 업데이트
          </p>
        </div>
      </div>

      <div>
        <h2>Instagram</h2>
        <div className="mt-4">
          <a 
            href="https://www.instagram.com/divetobada_insta/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @divetobada_insta
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            비하인드 스토리, 크리에이터 소식, 일상
          </p>
        </div>
      </div>

      <div>
        <h2>X (Twitter)</h2>
        <div className="mt-4">
          <a 
            href="https://x.com/divetobada_twt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @divetobada_twt
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            실시간 소식, 공지사항, 커뮤니티 소통
          </p>
        </div>
      </div>

      <div>
        <h2>Threads</h2>
        <div className="mt-4">
          <a 
            href="https://www.threads.net/@divetobada_insta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @divetobada_insta
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            텍스트 기반 소통, 크리에이터와 대화
          </p>
        </div>
      </div>

      <div>
        <h2>파트너 서비스</h2>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Vessel</h3>
          <a 
            href="https://www.vessel.today" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            vessel.today
          </a>
          <p className="text-sm text-muted-foreground mt-2">
            Dive to Bada SSO 연동 서비스
          </p>
        </div>
      </div>

      <div>
        <h2>브랜드 가이드라인</h2>
        <ul className="space-y-2 mt-4">
          <li>유튜브: @Divetobada1105</li>
          <li>인스타그램: @divetobada_insta</li>
          <li>X (Twitter): @divetobada_twt</li>
          <li>Threads: @divetobada_insta</li>
          <li>해시태그: #DivetoBada #다이브투바다</li>
          <li>브랜드 컬러: 민트 (#00DD89), 블랙 (#1A1A1A)</li>
        </ul>
      </div>
    </div>
  );
}
