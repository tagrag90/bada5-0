import { Button } from "@/components/ui/button";
import ComponentPreview from "../../_components/ComponentPreview";

export default function ButtonPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>Button</h1>
        <p className="text-lg text-muted-foreground mt-2">
          버튼 컴포넌트
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={<Button>Click me</Button>}
          code={`<Button>Click me</Button>`}
        />
      </div>

      <div>
        <h2>Variants</h2>
        <ComponentPreview
          component={
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          }
          code={`<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
        />
      </div>

      <div>
        <h2>Sizes</h2>
        <ComponentPreview
          component={
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          }
          code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}
        />
      </div>


      <div>
        <h2>Disabled</h2>
        <ComponentPreview
          component={
            <div className="flex gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled</Button>
            </div>
          }
          code={`<Button disabled>Disabled</Button>
<Button variant="outline" disabled>Disabled</Button>`}
        />
      </div>

      <div>
        <h2>Props</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Default</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">&quot;default&quot;</td>
                <td className="px-4 py-3 text-muted-foreground">
                  버튼 스타일: default, secondary, destructive, outline, ghost, link
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">&quot;default&quot;</td>
                <td className="px-4 py-3 text-muted-foreground">
                  버튼 크기: sm, default, lg, icon
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-muted-foreground">
                  버튼 비활성화 여부
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">asChild</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-muted-foreground">
                  Slot으로 렌더링 (Link 등과 함께 사용)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>사용 예시</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Link와 함께 사용</h3>
            <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto">
              <code>{`import Link from "next/link";

<Button asChild>
  <Link href="/dashboard">
    Go to Dashboard
  </Link>
</Button>`}</code>
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}

