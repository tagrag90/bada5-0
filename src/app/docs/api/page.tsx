export default function APIPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>API 레퍼런스</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Divetobada API 엔드포인트 문서
        </p>
      </div>

      <div>
        <h2>기본 정보</h2>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-mono text-sm">Base URL: https://divetobada.com/api</p>
        </div>
        <p className="text-muted-foreground mt-4">
          대부분의 API는 인증이 필요합니다. 쿠키 기반 세션 인증을 사용합니다.
        </p>
      </div>

      <div>
        <h2>게시물 API</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">GET</code>
              <code className="text-sm font-mono">/posts/for-you</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">전체 피드 조회</p>
            <p className="text-xs text-muted-foreground">파라미터: cursor (optional)</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">GET</code>
              <code className="text-sm font-mono">/posts/following</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">팔로잉 피드 조회</p>
            <p className="text-xs text-muted-foreground">파라미터: cursor (optional)</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">POST</code>
              <code className="text-sm font-mono">/posts</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">게시물 생성</p>
            <p className="text-xs text-muted-foreground">Body: title (optional), content, attachments (optional)</p>
          </div>
        </div>
      </div>

      <div>
        <h2>스튜디오 API</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">GET</code>
              <code className="text-sm font-mono">/studios</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground">내 스튜디오 목록 조회</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">POST</code>
              <code className="text-sm font-mono">/studios</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">스튜디오 생성</p>
            <p className="text-xs text-muted-foreground">Body: name, slug, description (optional)</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">GET</code>
              <code className="text-sm font-mono">/studios/[studioId]/nodes</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">노드 목록 조회</p>
            <p className="text-xs text-muted-foreground">파라미터: fileId (optional), type (optional)</p>
          </div>
        </div>
      </div>

      <div>
        <h2>사용자 API</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">GET</code>
              <code className="text-sm font-mono">/users/me</code>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">인증 필요</span>
            </div>
            <p className="text-sm text-muted-foreground">현재 사용자 정보 조회</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <code className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">GET</code>
              <code className="text-sm font-mono">/users/[userId]/followers</code>
            </div>
            <p className="text-sm text-muted-foreground">팔로워 목록 조회</p>
          </div>
        </div>
      </div>
    </div>
  );
}

