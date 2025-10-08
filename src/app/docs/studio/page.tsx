import Link from "next/link";

export default function StudioPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>스튜디오</h1>
        <p className="text-lg text-muted-foreground mt-2">
          크리에이터 블로그 공간
        </p>
      </div>

      <div>
        <h2>스튜디오 만들기</h2>
        <ol className="space-y-2 mt-4">
          <li>탐색 메뉴 클릭</li>
          <li>&apos;스튜디오 생성하기&apos; 버튼 클릭</li>
          <li>이름, 슬러그(URL) 입력</li>
          <li>타입 선택 (PERSONAL / TEAM)</li>
        </ol>
      </div>

      <div>
        <h2>일반 포스트 vs 스튜디오</h2>
        <ul className="space-y-2 mt-4">
          <li><strong>제목</strong>: 일반 포스트 없음 / 스튜디오 있음</li>
          <li><strong>에디터</strong>: 일반 포스트 기본 / 스튜디오 Notion 스타일</li>
          <li><strong>이미지</strong>: 일반 포스트 최대 10장 / 스튜디오 인라인 삽입</li>
        </ul>
      </div>
    </div>
  );
}

