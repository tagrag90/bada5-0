export default function TypographyPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>타이포그래피</h1>
        <p className="text-lg text-muted-foreground mt-2">
          프로젝트 폰트 정보
        </p>
      </div>

      <div>
        <h2>폰트</h2>
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="font-semibold mb-2">Pretendard Variable</h3>
            <p className="text-muted-foreground mb-3">한글</p>
            <p className="text-3xl">가나다라마바사</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Geist Sans</h3>
            <p className="text-muted-foreground mb-3">영문</p>
            <p className="text-3xl font-geist-sans">
              The quick brown fox
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Geist Mono</h3>
            <p className="text-muted-foreground mb-3">코드</p>
            <p className="text-2xl font-geist-mono">
              const name = &quot;Bada&quot;;
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2>폰트 크기 스케일</h2>
        <div className="border rounded-lg overflow-hidden mt-4">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Class</th>
                <th className="px-4 py-3 text-left font-semibold">크기</th>
                <th className="px-4 py-3 text-left font-semibold">예시</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-xs</td>
                <td className="px-4 py-3 text-sm">0.75rem (12px)</td>
                <td className="px-4 py-3 text-xs">작은 텍스트</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-sm</td>
                <td className="px-4 py-3 text-sm">0.875rem (14px)</td>
                <td className="px-4 py-3 text-sm">작은 텍스트</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-base</td>
                <td className="px-4 py-3 text-sm">1rem (16px)</td>
                <td className="px-4 py-3 text-base">기본 텍스트</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-lg</td>
                <td className="px-4 py-3 text-sm">1.125rem (18px)</td>
                <td className="px-4 py-3 text-lg">큰 텍스트</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-xl</td>
                <td className="px-4 py-3 text-sm">1.25rem (20px)</td>
                <td className="px-4 py-3 text-xl">제목</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-2xl</td>
                <td className="px-4 py-3 text-sm">1.5rem (24px)</td>
                <td className="px-4 py-3 text-2xl">중간 제목</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-3xl</td>
                <td className="px-4 py-3 text-sm">1.875rem (30px)</td>
                <td className="px-4 py-3 text-3xl">큰 제목</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">text-5xl</td>
                <td className="px-4 py-3 text-sm">3rem (48px)</td>
                <td className="px-4 py-3 text-5xl">페이지 제목</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>폰트 굵기</h2>
        <div className="space-y-3 mt-4">
          <p className="text-2xl font-normal">Font Normal (400)</p>
          <p className="text-2xl font-medium">Font Medium (500)</p>
          <p className="text-2xl font-semibold">Font Semibold (600)</p>
          <p className="text-2xl font-bold">Font Bold (700)</p>
        </div>
      </div>

      <div>
        <h2>사용 예시</h2>
        <div className="border rounded-lg p-6 bg-muted/30">
          <pre className="text-sm">
{`// Tailwind 클래스
<h1 className="text-5xl font-bold">페이지 제목</h1>
<h2 className="text-3xl font-semibold">섹션 제목</h2>
<p className="text-base text-muted-foreground">본문 텍스트</p>
<span className="text-sm">작은 텍스트</span>`}
          </pre>
        </div>
      </div>

    </div>
  );
}

