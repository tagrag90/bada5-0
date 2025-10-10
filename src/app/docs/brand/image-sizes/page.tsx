import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Sizes - Studio_bada Docs",
  description: "Studio_bada 이미지 사이즈 가이드라인",
};

export default function ImageSizesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">이미지 사이즈 가이드라인</h1>
        <p className="text-muted-foreground">
          각 컴포넌트별 최적의 이미지 사이즈와 비율을 안내합니다. 모든 이미지는 자동으로 최적화되어 표시됩니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 스튜디오 아바타 */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">스튜디오 아바타</h3>
          <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">512×512</div>
              <div className="text-sm text-muted-foreground mt-1">1:1 비율</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 사이즈:</span>
              <span className="font-medium">512×512px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">비율:</span>
              <span className="font-medium">1:1 (정사각형)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최대 파일 크기:</span>
              <span className="font-medium">2MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">형식:</span>
              <span className="font-medium">WEBP (자동 변환)</span>
            </div>
          </div>
        </div>

        {/* 스튜디오 배너 */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">스튜디오 배너</h3>
          <div className="aspect-[21/9] bg-muted rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">1200×630</div>
              <div className="text-sm text-muted-foreground mt-1">21:9 비율</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 사이즈:</span>
              <span className="font-medium">1200×630px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">비율:</span>
              <span className="font-medium">21:9 (와이드)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최대 파일 크기:</span>
              <span className="font-medium">4MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">형식:</span>
              <span className="font-medium">WEBP (자동 변환)</span>
            </div>
          </div>
        </div>

        {/* 개인 유저 아바타 */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">개인 유저 아바타</h3>
          <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">1024×1024</div>
              <div className="text-sm text-muted-foreground mt-1">1:1 비율</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 사이즈:</span>
              <span className="font-medium">1024×1024px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">비율:</span>
              <span className="font-medium">1:1 (정사각형)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최대 파일 크기:</span>
              <span className="font-medium">2MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">형식:</span>
              <span className="font-medium">WEBP (자동 변환)</span>
            </div>
          </div>
        </div>

        {/* 게시물 이미지 */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">게시물 이미지</h3>
          <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">가변</div>
              <div className="text-sm text-muted-foreground mt-1">16:9 권장</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 사이즈:</span>
              <span className="font-medium">가변 (최적화)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 비율:</span>
              <span className="font-medium">16:9 (와이드)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최대 파일 크기:</span>
              <span className="font-medium">8MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">표시 방식:</span>
              <span className="font-medium">object-contain</span>
            </div>
          </div>
        </div>

        {/* 게시물 영상 */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">게시물 영상</h3>
          <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">가변</div>
              <div className="text-sm text-muted-foreground mt-1">16:9 권장</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 사이즈:</span>
              <span className="font-medium">가변 (최적화)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">권장 비율:</span>
              <span className="font-medium">16:9 (와이드)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최대 파일 크기:</span>
              <span className="font-medium">32MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">코덱 지원:</span>
              <span className="font-medium">MP4, WebM</span>
            </div>
          </div>
        </div>

        {/* 크롭 가이드라인 */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">크롭 가이드라인</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">아바타: 1:1 정사각형 크롭</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">배너: 21:9 와이드 크롭</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">게시물: 원본 비율 유지</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>중요:</strong> 모든 이미지는 업로드 시 자동으로 최적화되어 저장됩니다.
              크롭은 사용자 편의를 위해 제공되며, 필수는 아닙니다.
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-3">기술적 세부사항</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>이미지 최적화:</strong> Next.js Image 컴포넌트와 WebP 변환으로 자동 최적화
          </div>
          <div>
            <strong>반응형 표시:</strong> 다양한 디바이스 크기에 맞춰 자동 조정
          </div>
          <div>
            <strong>저장소:</strong> UploadThing을 통한 클라우드 저장 및 CDN 배포
          </div>
          <div>
            <strong>보안:</strong> 파일 형식 검증 및 크기 제한으로 안전한 업로드 보장
          </div>
        </div>
      </div>
    </div>
  );
}
