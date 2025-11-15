export default function ArchitecturePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>아키텍처 가이드</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Divetobada의 구조와 설계 원칙
        </p>
      </div>

      <div>
        <h2>레이아웃 시스템</h2>
        <p className="text-muted-foreground mt-2">
          Divetobada는 가변 사이드바를 가진 3-컬럼 레이아웃 구조입니다.
        </p>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <pre className="text-sm font-mono">
{`┌─────────────────────────────────────────┐
│         LeftSidebarArea (가변)          │
│  ┌─────────┬─────────────────────────┐ │
│  │ Server  │  Content Block          │ │
│  │ List    │  (Docs/Discord/None)    │ │
│  │ (80px)  │  (320px)                 │ │
│  └─────────┴─────────────────────────┘ │
├─────────────────────────────────────────┤
│         MainContent (가변 너비)         │
│         (중앙 정렬, 최대 3xl)           │
├─────────────────────────────────────────┤
│         RightSidebarArea (320px)        │
│         (페이지별 콘텐츠 블록)           │
└─────────────────────────────────────────┘`}
          </pre>
        </div>
      </div>

      <div>
        <h2>좌측 사이드바 (LeftSidebarArea)</h2>
        <ul className="space-y-2 mt-4">
          <li><strong>너비</strong>: 가변 (80px 또는 400px)</li>
          <li><strong>서버 리스트</strong>: 항상 표시 (80px)</li>
          <li><strong>콘텐츠 블록</strong>: 조건부 표시 (320px)
            <ul className="ml-4 mt-2 space-y-1">
              <li>Docs: 독스 네비게이션</li>
              <li>Discord: 스튜디오 채널 목록</li>
              <li>None: 콘텐츠 없음</li>
            </ul>
          </li>
        </ul>
      </div>

      <div>
        <h2>중앙 콘텐츠 (MainContent)</h2>
        <ul className="space-y-2 mt-4">
          <li><strong>너비</strong>: 가변 (사이드바 너비에 따라 자동 조절)</li>
          <li><strong>최대 너비</strong>: 3xl (768px)</li>
          <li><strong>정렬</strong>: 중앙 정렬</li>
          <li><strong>CSS 변수</strong>: <code>--left-sidebar-width</code>, <code>--right-sidebar-width</code></li>
        </ul>
      </div>

      <div>
        <h2>우측 사이드바 (RightSidebarArea)</h2>
        <ul className="space-y-2 mt-4">
          <li><strong>너비</strong>: 고정 (320px)</li>
          <li><strong>콘텐츠</strong>: 페이지별 블록
            <ul className="ml-4 mt-2 space-y-1">
              <li>홈: 크리에이터 추천, 브랜드 사이드바</li>
              <li>스튜디오: 스튜디오 정보</li>
            </ul>
          </li>
          <li><strong>접기/펼치기</strong>: 양쪽 사이드바 동시 제어</li>
        </ul>
      </div>

      <div>
        <h2>라우팅 구조</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Next.js App Router 기반의 파일 시스템 라우팅입니다.
        </p>
        <ul className="space-y-2">
          <li><code>/</code> - 홈 피드 (전체/팔로잉)</li>
          <li><code>/studios/[studioId]</code> - 스튜디오 메인 페이지</li>
          <li><code>/studios/[studioId]/workspace</code> - 워크스페이스 대시보드</li>
          <li><code>/studios/[studioId]/workspace/[fileId]</code> - 화이트보드 파일 페이지</li>
          <li><code>/studios/[studioId]/settings</code> - 스튜디오 설정</li>
          <li><code>/docs</code> - 독스 페이지</li>
        </ul>
      </div>

      <div>
        <h2>CSS 변수</h2>
        <div className="mt-4 space-y-2">
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded">--left-sidebar-width</code>
            <p className="text-sm text-muted-foreground mt-1">좌측 사이드바 너비 (80px 또는 400px)</p>
          </div>
          <div>
            <code className="bg-gray-100 px-2 py-1 rounded">--right-sidebar-width</code>
            <p className="text-sm text-muted-foreground mt-1">우측 사이드바 너비 (320px)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

