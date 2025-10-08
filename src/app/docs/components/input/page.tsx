import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComponentPreview from "../../_components/ComponentPreview";

export default function InputPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>Input</h1>
        <p className="text-lg text-muted-foreground mt-2">
          입력 필드
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={
            <Input placeholder="이메일을 입력하세요" className="w-[350px]" />
          }
          code={`<Input placeholder="이메일을 입력하세요" />`}
        />
      </div>

      <div>
        <h2>Label</h2>
        <ComponentPreview
          component={
            <div className="w-[350px] space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
          }
          code={`<div className="space-y-2">
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
</div>`}
        />
      </div>

      <div>
        <h2>Types</h2>
        <ComponentPreview
          component={
            <div className="w-[350px] space-y-4">
              <div className="space-y-2">
                <Label>텍스트</Label>
                <Input type="text" placeholder="텍스트 입력" />
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>비밀번호</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>숫자</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
          }
          code={`<Input type="text" placeholder="텍스트 입력" />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="••••••••" />
<Input type="number" placeholder="0" />`}
        />
      </div>

      <div>
        <h2>Disabled</h2>
        <ComponentPreview
          component={
            <Input disabled placeholder="비활성화된 입력 필드" className="w-[350px]" />
          }
          code={`<Input disabled placeholder="비활성화된 입력 필드" />`}
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
                <td className="px-4 py-3 font-mono text-xs">type</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">&quot;text&quot;</td>
                <td className="px-4 py-3 text-muted-foreground">
                  input 타입 (text, email, password, number 등)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">placeholder</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-muted-foreground">
                  플레이스홀더 텍스트
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-muted-foreground">
                  비활성화 여부
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2>Form에서 사용하기</h2>
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto">
          <code>{`import { useForm } from "react-hook-form";

const { register } = useForm();

<form>
  <div className="space-y-2">
    <Label htmlFor="username">사용자명</Label>
    <Input 
      id="username"
      {...register("username")} 
      placeholder="사용자명 입력"
    />
  </div>
</form>`}</code>
        </pre>
      </div>

    </div>
  );
}

