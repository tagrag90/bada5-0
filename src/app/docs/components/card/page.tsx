import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComponentPreview from "../../_components/ComponentPreview";

export default function CardPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>Card</h1>
        <p className="text-lg text-muted-foreground mt-2">
          카드 컨테이너
        </p>
      </div>

      <div>
        <h2>기본</h2>
        <ComponentPreview
          component={
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>카드 본문 내용입니다.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          }
          code={`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>카드 본문 내용입니다.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`}
        />
      </div>

      <div>
        <h2>Header만 있는 카드</h2>
        <ComponentPreview
          component={
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>간단한 카드</CardTitle>
                <CardDescription>Description만 있는 카드</CardDescription>
              </CardHeader>
            </Card>
          }
          code={`<Card>
  <CardHeader>
    <CardTitle>간단한 카드</CardTitle>
    <CardDescription>Description만 있는 카드</CardDescription>
  </CardHeader>
</Card>`}
        />
      </div>

      <div>
        <h2>Footer 버튼</h2>
        <ComponentPreview
          component={
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>확인이 필요합니다</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  이 작업을 계속하시겠습니까?
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">취소</Button>
                <Button className="flex-1">확인</Button>
              </CardFooter>
            </Card>
          }
          code={`<Card>
  <CardHeader>
    <CardTitle>확인이 필요합니다</CardTitle>
  </CardHeader>
  <CardContent>
    <p>이 작업을 계속하시겠습니까?</p>
  </CardContent>
  <CardFooter className="flex gap-2">
    <Button variant="outline" className="flex-1">취소</Button>
    <Button className="flex-1">확인</Button>
  </CardFooter>
</Card>`}
        />
      </div>

      <div>
        <h2>컴포넌트 구조</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">컴포넌트</th>
                <th className="px-4 py-3 text-left font-semibold">설명</th>
                <th className="px-4 py-3 text-left font-semibold">필수 여부</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">Card</td>
                <td className="px-4 py-3 text-muted-foreground">카드 컨테이너</td>
                <td className="px-4 py-3">✅ 필수</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">CardHeader</td>
                <td className="px-4 py-3 text-muted-foreground">제목 영역</td>
                <td className="px-4 py-3">선택</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">CardTitle</td>
                <td className="px-4 py-3 text-muted-foreground">카드 제목</td>
                <td className="px-4 py-3">선택</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">CardDescription</td>
                <td className="px-4 py-3 text-muted-foreground">카드 설명</td>
                <td className="px-4 py-3">선택</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">CardContent</td>
                <td className="px-4 py-3 text-muted-foreground">본문 내용</td>
                <td className="px-4 py-3">선택</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">CardFooter</td>
                <td className="px-4 py-3 text-muted-foreground">하단 액션 영역</td>
                <td className="px-4 py-3">선택</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

