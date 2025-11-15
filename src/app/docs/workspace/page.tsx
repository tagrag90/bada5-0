import Link from "next/link";
import ComponentPreview from "../_components/ComponentPreview";
import { FileText, Calendar, Share2, FileImage, Image as ImageIcon } from "lucide-react";

// 노드 타입별 아이콘
const nodeTypeIcons: Record<string, any> = {
  PLANNING: FileText,
  NOTE: FileText,
  SCHEDULE: Calendar,
  RESOURCE: Share2,
  POST: FileImage,
  PHOTO: ImageIcon,
};

// 노드 타입별 라벨
const nodeTypeLabels: Record<string, string> = {
  PLANNING: "기획",
  NOTE: "메모",
  SCHEDULE: "캘린더",
  RESOURCE: "드라이브",
  POST: "게시물",
  PHOTO: "사진",
};

// 노드 목업 컴포넌트
function NodePreview({ 
  type, 
  label, 
  emoji, 
  content, 
  borderColor = "#000000" 
}: { 
  type: string; 
  label: string; 
  emoji?: string; 
  content?: string; 
  borderColor?: string;
}) {
  const Icon = nodeTypeIcons[type] || FileText;
  
  return (
    <div 
      className="bg-white rounded-lg p-4 relative"
      style={{ 
        border: `2px solid ${borderColor}`,
        borderRadius: "8px",
        minWidth: "300px",
        maxWidth: "400px",
      }}
    >
      {/* 연결점 시뮬레이션 */}
      <div 
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white"
        style={{ borderColor: borderColor }}
      />
      <div 
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white"
        style={{ borderColor: borderColor }}
      />
      
      {/* 노드 내용 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          {emoji && <span className="text-base">{emoji}</span>}
          <Icon className="w-4 h-4 mt-0.5" />
          <div className="font-semibold text-sm text-black break-words flex-1">
            {label}
          </div>
        </div>
        {content && (
          <div className="text-xs text-gray-600 whitespace-pre-line break-words">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>워크스페이스</h1>
        <p className="text-lg text-muted-foreground mt-2">
          React Flow 기반의 노드 기반 화이트보드 시스템
        </p>
      </div>

      <div>
        <h2>개요</h2>
        <p className="text-muted-foreground mt-2">
          노드는 워크스페이스에서 정보를 표현하고 연결하는 기본 단위입니다. 각 노드는 타입에 따라 다른 형태와 기능을 가집니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 드래그 앤 드롭으로 자유롭게 배치</li>
          <li>• 노드 간 연결선으로 관계 표현</li>
          <li>• 노드 타입별 특화된 UI 및 기능</li>
          <li>• 실시간 편집 및 저장</li>
        </ul>
      </div>

      <div>
        <h2>노드 타입</h2>
        <p className="text-sm text-muted-foreground mb-6">
          워크스페이스에서 사용할 수 있는 노드 타입들입니다.
        </p>

        {/* PLANNING 노드 */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">PLANNING (기획)</h3>
          <ComponentPreview
            component={
              <NodePreview
                type="PLANNING"
                label="프로젝트 기획"
                emoji="📋"
                content="프로젝트의 전체적인 기획과 아이디어를 기록합니다."
                borderColor="#9333EA"
              />
            }
            code={`노드 타입: PLANNING
제목: 프로젝트 기획
이모지: 📋
테두리 색상: 보라색 (#9333EA)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>용도:</strong> 프로젝트 기획 및 아이디어를 기록하는 노드
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 제목과 내용 편집</li>
              <li>• 이모지 추가 가능</li>
              <li>• 다른 노드와 연결 가능</li>
              <li>• 보라색 테두리로 강조 표시</li>
            </ul>
          </div>
        </div>

        {/* NOTE 노드 */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">NOTE (메모)</h3>
          <ComponentPreview
            component={
              <NodePreview
                type="NOTE"
                label="일반 메모"
                emoji="📝"
                content="리치 텍스트 에디터를 지원하며 HTML 콘텐츠를 렌더링할 수 있습니다.\n\n여러 줄의 텍스트를 작성할 수 있으며, 이모지도 추가할 수 있습니다."
                borderColor="#000000"
              />
            }
            code={`노드 타입: NOTE
제목: 일반 메모
이모지: 📝
테두리 색상: 검정색 (#000000)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>용도:</strong> 일반적인 메모 및 텍스트 노드
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 리치 텍스트 에디터 지원</li>
              <li>• HTML 콘텐츠 렌더링</li>
              <li>• 이모지 추가 가능</li>
              <li>• 무제한 텍스트 입력</li>
            </ul>
          </div>
        </div>

        {/* SCHEDULE 노드 */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">SCHEDULE (캘린더)</h3>
          <ComponentPreview
            component={
              <NodePreview
                type="SCHEDULE"
                label="프로젝트 마감일"
                emoji="📅"
                content="시작일: 2025-01-15\n종료일: 2025-01-30\n타입: 마감기한"
                borderColor="#3B82F6"
              />
            }
            code={`노드 타입: SCHEDULE
제목: 프로젝트 마감일
이모지: 📅
시작일: 2025-01-15
종료일: 2025-01-30
테두리 색상: 파란색 (#3B82F6)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>용도:</strong> 일정 및 이벤트 정보를 표시하는 노드
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 시작일/종료일 설정</li>
              <li>• 이벤트 타입 표시 (일정/행사/마감기한)</li>
              <li>• 설명 추가 가능</li>
              <li>• 캘린더 뷰와 연동</li>
            </ul>
          </div>
        </div>

        {/* RESOURCE 노드 */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">RESOURCE (드라이브)</h3>
          <ComponentPreview
            component={
              <NodePreview
                type="RESOURCE"
                label="프로젝트 자료"
                emoji="📁"
                content="• design-guide.pdf\n• wireframe.fig\n• assets.zip"
                borderColor="#10B981"
              />
            }
            code={`노드 타입: RESOURCE
제목: 프로젝트 자료
이모지: 📁
파일: design-guide.pdf, wireframe.fig, assets.zip
테두리 색상: 초록색 (#10B981)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>용도:</strong> 파일 및 자료를 공유하는 노드
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 다중 파일 업로드</li>
              <li>• 파일 목록 표시</li>
              <li>• 파일 다운로드 기능</li>
              <li>• 최대 3개 파일 미리보기</li>
            </ul>
          </div>
        </div>

        {/* POST 노드 */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">POST (게시물)</h3>
          <ComponentPreview
            component={
              <NodePreview
                type="POST"
                label="프로젝트 업데이트"
                emoji="📄"
                content="작성자: @username\n게시일: 2025-01-15\n\n프로젝트 진행 상황을 공유합니다..."
                borderColor="#F59E0B"
              />
            }
            code={`노드 타입: POST
제목: 프로젝트 업데이트
이모지: 📄
게시물 ID: [postId]
테두리 색상: 주황색 (#F59E0B)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>용도:</strong> 스튜디오 게시물을 워크스페이스에 임베드하는 노드
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 게시물 ID로 연결</li>
              <li>• 작성자 정보 표시</li>
              <li>• 게시물 내용 미리보기</li>
              <li>• 이미지 썸네일 표시</li>
              <li>• 원본 게시물 링크</li>
            </ul>
          </div>
        </div>

        {/* PHOTO 노드 */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">PHOTO (사진)</h3>
          <ComponentPreview
            component={
              <div className="bg-white rounded-lg p-4 relative" style={{ border: "2px solid #EC4899", borderRadius: "8px", minWidth: "300px", maxWidth: "400px" }}>
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: "#EC4899" }} />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: "#EC4899" }} />
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-base">🖼️</span>
                    <ImageIcon className="w-4 h-4 mt-0.5" />
                    <div className="font-semibold text-sm text-black flex-1">디자인 컨셉</div>
                  </div>
                  <div className="mt-2 w-full h-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    이미지 미리보기
                  </div>
                </div>
              </div>
            }
            code={`노드 타입: PHOTO
제목: 디자인 컨셉
이모지: 🖼️
이미지 URL: [imageUrl]
테두리 색상: 핑크색 (#EC4899)`}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>용도:</strong> 이미지를 직접 표시하는 노드
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 이미지 업로드</li>
              <li>• 이미지 크기에 맞춰 자동 크기 조절</li>
              <li>• 비율 유지</li>
              <li>• 리사이즈 핸들 제공</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2>노드 작업</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">추가</h3>
            <p className="text-sm text-muted-foreground">사이드바의 노드 추가 버튼을 클릭하여 새 노드를 생성합니다.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">편집</h3>
            <p className="text-sm text-muted-foreground">노드를 클릭하거나 편집 버튼을 눌러 내용을 수정합니다.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">연결</h3>
            <p className="text-sm text-muted-foreground">노드의 연결점을 드래그하여 다른 노드와 연결합니다.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">삭제</h3>
            <p className="text-sm text-muted-foreground">노드를 삭제합니다. 연결된 연결선도 함께 제거됩니다.</p>
          </div>
        </div>
      </div>

      <div>
        <h2>파일 시스템</h2>
        <p className="text-muted-foreground mt-2">
          워크스페이스 파일을 통해 노드를 그룹화할 수 있습니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 파일별로 노드 분리</li>
          <li>• 파일 생성/수정/삭제</li>
          <li>• 파일 헤더 (제목, 설명)</li>
          <li>• 파일 간 노드 이동</li>
        </ul>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm">
          💡 실제 노드 컴포넌트의 동작을 확인하고 싶으시다면 <Link href="/docs-old/node-examples" className="text-primary underline">노드 예제 페이지</Link>를 방문하세요.
        </p>
      </div>
    </div>
  );
}
