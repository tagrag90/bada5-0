import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import StudioDetailContent from "./StudioDetailContent";
import { Suspense } from "react";

function StudioDetailContentWrapper({ studioId }: { studioId: string }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">로딩 중...</div>}>
      <StudioDetailContent studioId={studioId} />
    </Suspense>
  );
}

export default async function StudioDetailPage({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  const { studioId } = await params;
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <StudioDetailContentWrapper studioId={studioId} />
      </div>
    </main>
  );
}

