import UserCard from "@/components/UserCard";
import ComponentPreview from "../../_components/ComponentPreview";

export default function UserCardPage() {
  const mockUser = {
    id: "bada-lee-001",
    username: "bada_lee",
    displayName: "이바다",
    avatarUrl: null,
    bio: "크리에이터",
    skills: ["Adobe Premiere Pro", "Figma"],
    createdAt: new Date(),
    _count: {
      posts: 42,
      followers: 1234,
      following: 567,
    },
    followers: [],
    following: [],
  };

  return (
    <div className="space-y-12">
      <div>
        <h1>UserCard</h1>
        <p className="text-lg text-muted-foreground mt-2">
          사용자 프로필 카드
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={<UserCard user={mockUser} />}
          code={`<UserCard user={user} />`}
        />
      </div>

      <div>
        <h2>포함 정보</h2>
        <ul className="space-y-2 mt-4">
          <li>프로필 사진 (UserAvatar)</li>
          <li>이름, 사용자명</li>
          <li>자기소개</li>
          <li>게시물/팔로잉/팔로워 수</li>
          <li>최근 게시물 슬라이더</li>
          <li>팔로우 버튼</li>
        </ul>
      </div>
    </div>
  );
}

