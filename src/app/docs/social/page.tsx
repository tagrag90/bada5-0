export default function SocialPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>소셜 기능</h1>
        <p className="text-lg text-muted-foreground mt-2">
          게시물, 댓글, 팔로우 등 소셜 미디어 핵심 기능
        </p>
      </div>

      <div>
        <h2>게시물</h2>
        <p className="text-muted-foreground mt-2">
          텍스트, 이미지, 링크를 포함한 리치 콘텐츠 게시물입니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 리치 텍스트 에디터 (Tiptap)</li>
          <li>• 이미지/비디오 업로드 (최대 10개)</li>
          <li>• 링크 미리보기 자동 생성</li>
          <li>• 해시태그 지원</li>
          <li>• 멘션 (@username)</li>
          <li>• 게시물 수정/삭제</li>
        </ul>
      </div>

      <div>
        <h2>댓글</h2>
        <p className="text-muted-foreground mt-2">
          게시물에 대한 댓글 시스템입니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 댓글 작성/수정/삭제</li>
          <li>• 댓글 알림</li>
          <li>• 무한 댓글 스레드</li>
        </ul>
      </div>

      <div>
        <h2>상호작용</h2>
        <p className="text-muted-foreground mt-2">
          좋아요, 북마크, 리포스트 기능입니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 좋아요 (Like)</li>
          <li>• 북마크 (Bookmark)</li>
          <li>• 리포스트 (Repost)</li>
          <li>• 실시간 카운트 업데이트</li>
        </ul>
      </div>

      <div>
        <h2>팔로우 시스템</h2>
        <p className="text-muted-foreground mt-2">
          사용자 간 팔로우 관계입니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 팔로우/언팔로우</li>
          <li>• 팔로워/팔로잉 목록</li>
          <li>• 팔로우 알림</li>
        </ul>
      </div>

      <div>
        <h2>피드 시스템</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          게시물 피드 및 추천 시스템입니다.
        </p>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">전체 (For You)</h3>
            <p className="text-sm text-muted-foreground">추천 알고리즘 기반 게시물</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">팔로잉</h3>
            <p className="text-sm text-muted-foreground">팔로우한 사용자의 게시물 (인증 필요)</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">공개</h3>
            <p className="text-sm text-muted-foreground">비로그인 사용자를 위한 공개 게시물</p>
          </div>
        </div>
      </div>
    </div>
  );
}

