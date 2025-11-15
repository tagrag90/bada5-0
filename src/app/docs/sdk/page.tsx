export default function SDKPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>SDK 가이드</h1>
        <p className="text-lg text-muted-foreground mt-2">
          SDK를 통한 커스텀 노드 개발
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm">
          ⚠️ <strong>현재 상태:</strong> 개발 예정 (Phase 4+)
        </p>
      </div>

      <div>
        <h2>SDK 개요</h2>
        <p className="text-muted-foreground mt-2">
          SDK를 통해 커스텀 노드를 개발하면, 워크스페이스에서 자체 제작한 노드를 사용할 수 있습니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 자신의 비즈니스 로직에 맞는 노드 개발</li>
          <li>• 외부 서비스와의 통합</li>
          <li>• 고급 자동화 기능 구현</li>
          <li>• 커뮤니티와 노드 공유</li>
        </ul>
      </div>

      <div>
        <h2>시작하기</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">1. SDK 설치</h3>
            <pre className="p-3 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto mt-2">
              <code>npm install @divetobada/sdk</code>
            </pre>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">2. 노드 컴포넌트 작성</h3>
            <pre className="p-3 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto mt-2">
              <code>{`import { NodeComponent, NodeProps } from '@divetobada/sdk';

export default function MyCustomNode({ data, id }: NodeProps) {
  return (
    <div className="custom-node">
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  );
}`}</code>
            </pre>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">3. 노드 등록</h3>
            <pre className="p-3 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto mt-2">
              <code>{`import { registerNode } from '@divetobada/sdk';
import MyCustomNode from './MyCustomNode';

registerNode({
  type: 'MY_CUSTOM_TYPE',
  label: '내 커스텀 노드',
  icon: 'CustomIcon',
  component: MyCustomNode,
  defaultWidth: 300,
  defaultHeight: 200
});`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div>
        <h2>노드 인터페이스</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          커스텀 노드는 다음 인터페이스를 구현해야 합니다.
        </p>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <code className="text-sm font-mono text-primary">data: CustomNodeData</code>
            <p className="text-xs text-muted-foreground mt-1">노드의 데이터 객체 (필수)</p>
          </div>
          <div className="p-4 border rounded-lg">
            <code className="text-sm font-mono text-primary">id: string</code>
            <p className="text-xs text-muted-foreground mt-1">노드의 고유 ID (필수)</p>
          </div>
          <div className="p-4 border rounded-lg">
            <code className="text-sm font-mono text-primary">selected: boolean</code>
            <p className="text-xs text-muted-foreground mt-1">노드가 선택되었는지 여부 (선택)</p>
          </div>
        </div>
      </div>

      <div>
        <h2>모범 사례</h2>
        <ul className="space-y-2 mt-4">
          <li>• 노드의 크기는 콘텐츠에 맞게 자동 조절되도록 설계하세요</li>
          <li>• 연결점(Handle)은 노드의 좌우에 배치하세요</li>
          <li>• 편집 및 삭제 기능은 호버 시에만 표시하세요</li>
          <li>• 노드 데이터는 JSON 형식으로 저장됩니다</li>
          <li>• 성능을 위해 불필요한 리렌더링을 방지하세요</li>
        </ul>
      </div>

      <div>
        <h2>향후 기능</h2>
        <ul className="space-y-2 mt-4">
          <li>🚀 노드 마켓플레이스 (커뮤니티 노드 공유)</li>
          <li>🚀 노드 실행 기능 (자동화 워크플로우)</li>
          <li>🚀 노드 간 데이터 전달</li>
          <li>🚀 노드 그룹화 및 템플릿 기능</li>
        </ul>
      </div>
    </div>
  );
}

