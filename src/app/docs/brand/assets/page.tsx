import { Button } from "@/components/ui/button";

export default function BrandAssetsPage() {
  const assets = [
    {
      title: "크리에이터 플랫폼 작동 개요",
      description: "Dive to Bada 프로젝트의 전체적인 기획과 개요",
      filename: "project-overview.pdf",
      url: "/brand-assets/project-overview.pdf",
      size: "6.7MB",
    },
    {
      title: "Mission and Vision", 
      description: "Studio_bada의 미션, 비전, 핵심 가치",
      filename: "mission-vision.pdf",
      url: "/brand-assets/mission-vision.pdf",
      size: "11.8MB",
    },
    {
      title: "What, Why, How and More",
      description: "프로젝트의 핵심 질문과 답변 프레임워크",
      filename: "what-why-how.pdf", 
      url: "/brand-assets/what-why-how.pdf",
      size: "16.2MB",
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1>브랜드 자산</h1>
        <p className="text-lg text-muted-foreground mt-2">
          PDF 문서 및 브랜드 가이드라인
        </p>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        {assets.map((asset) => (
          <div key={asset.filename} className="border rounded-lg overflow-hidden">
            {/* 정보 */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{asset.title}</h3>
              <p className="text-muted-foreground mb-4">
                {asset.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  <div>{asset.filename}</div>
                  <div className="text-xs">{asset.size}</div>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="flex gap-3">
                <a href={asset.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm">
                    👀 미리보기
                  </Button>
                </a>
                <a href={asset.url} download={asset.filename}>
                  <Button variant="outline" size="sm">
                    📄 다운로드
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2>사용 안내</h2>
        <ul className="space-y-2 mt-4 text-sm text-muted-foreground">
          <li>• PDF 미리보기는 브라우저에서 바로 확인 가능합니다</li>
          <li>• 다운로드 버튼으로 로컬에 저장할 수 있습니다</li>
          <li>• 모든 문서는 Studio_bada의 공식 브랜드 자산입니다</li>
        </ul>
      </div>
    </div>
  );
}
