import UserAvatar from "@/components/UserAvatar";
import ComponentPreview from "../../_components/ComponentPreview";

export default function UserAvatarPage() {
  const mockUserId = "bada-lee-001";

  return (
    <div className="space-y-12">
      <div>
        <h1>UserAvatar</h1>
        <p className="text-lg text-muted-foreground mt-2">
          사용자 아바타 이미지
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={
            <UserAvatar 
              avatarUrl={null} 
              userId={mockUserId}
              size={80}
            />
          }
          code={`<UserAvatar 
  avatarUrl={null} 
  userId={user.id}
  size={80}
/>`}
        />
      </div>

      <div>
        <h2>Sizes</h2>
        <ComponentPreview
          component={
            <div className="flex items-center gap-4">
              <UserAvatar avatarUrl={null} userId={mockUserId} size={40} />
              <UserAvatar avatarUrl={null} userId={mockUserId} size={60} />
              <UserAvatar avatarUrl={null} userId={mockUserId} size={80} />
              <UserAvatar avatarUrl={null} userId={mockUserId} size={120} />
            </div>
          }
          code={`<UserAvatar size={40} />
<UserAvatar size={60} />
<UserAvatar size={80} />
<UserAvatar size={120} />`}
        />
      </div>

      <div>
        <h2>Props</h2>
        <div className="border rounded-lg overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">avatarUrl</td>
                <td className="px-4 py-3 font-mono text-xs">string | null</td>
                <td className="px-4 py-3">사용자 아바타 URL</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">userId</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3">기본 아바타 선택용 ID</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 font-mono text-xs">number</td>
                <td className="px-4 py-3">아바타 크기 (px)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3">추가 CSS 클래스</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

