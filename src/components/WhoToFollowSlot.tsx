import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import WhoToFollow from "./WhoToFollow";

// 서버 컴포넌트 - 서버에서 렌더링되어 클라이언트 컴포넌트에 전달됨
export default async function WhoToFollowSlot() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    }>
      <WhoToFollow />
    </Suspense>
  );
}

