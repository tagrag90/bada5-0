import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>시작하기</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Dive to Bada 사용 방법
        </p>
      </div>

      <div>
        <h2>회원가입</h2>
        <ol className="space-y-3 mt-4">
          <li>우측 상단 &apos;회원가입&apos; 클릭</li>
          <li>이메일, 사용자명, 비밀번호 입력</li>
          <li>프로필 설정 완료</li>
        </ol>
      </div>

      <div>
        <h2>주요 기능</h2>
        <ul className="space-y-2 mt-4">
          <li>게시물 작성 (텍스트, 이미지, 링크)</li>
          <li>해시태그, 댓글, 좋아요, 북마크</li>
          <li>팔로우/팔로잉</li>
          <li>실시간 알림</li>
          <li>스튜디오 (크리에이터 블로그)</li>
        </ul>
      </div>
    </div>
  );
}

