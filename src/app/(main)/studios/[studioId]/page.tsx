import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import StudioDetailContent from "./StudioDetailContent";

export default async function StudioDetailPage({
  params,
}: {
  params: { studioId: string };
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <StudioDetailContent studioId={params.studioId} />
      </div>
    </main>
  );
}

