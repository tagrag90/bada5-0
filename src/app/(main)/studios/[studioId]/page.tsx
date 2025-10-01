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

  return <StudioDetailContent studioId={params.studioId} />;
}

