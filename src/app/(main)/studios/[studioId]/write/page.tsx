import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import StudioWriteContent from "./StudioWriteContent";

export default async function StudioWritePage({
  params,
}: {
  params: Promise<{ studioId: string }>;
}) {
  const { studioId } = await params;
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return <StudioWriteContent studioId={studioId} />;
}


