import ComponentPreview from "../../_components/ComponentPreview";

export default function FollowButtonPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>FollowButton</h1>
        <p className="text-lg text-muted-foreground mt-2">
          팔로우/언팔로우 버튼
        </p>
      </div>

      <div>
        <h2>사용법</h2>
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto mt-4">
          <code>{`<FollowButton
  userId={user.id}
  initialState={{
    followers: user._count.followers,
    isFollowedByUser: false
  }}
/>`}</code>
        </pre>
      </div>

      <div>
        <h2>Props</h2>
        <div className="border rounded-lg overflow-hidden mt-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">userId</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">initialState</td>
                <td className="px-4 py-3 font-mono text-xs">FollowerInfo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>동작</h2>
        <ul className="space-y-2 mt-4">
          <li>클릭 시 팔로우/언팔로우 API 호출</li>
          <li>Optimistic Update (즉시 UI 반영)</li>
          <li>팔로우 중: &quot;Unfollow&quot; (회색)</li>
          <li>미팔로우: &quot;Follow&quot; (검정)</li>
        </ul>
      </div>
    </div>
  );
}

