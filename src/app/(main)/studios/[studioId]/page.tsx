import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import StudioDetailContent from "./StudioDetailContent";

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
        <StudioDetailContent studioId={studioId} />
      </div>
    </main>
  );
}

