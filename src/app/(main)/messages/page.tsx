import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <main className="w-full overflow-hidden rounded-2xl bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">메시지</h1>
      <p className="text-muted-foreground">
        메시지 기능은 현재 준비 중입니다. 곧 사용하실 수 있습니다.
      </p>
    </main>
  );
}
