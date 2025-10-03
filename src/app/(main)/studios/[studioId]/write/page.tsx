import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import StudioWriteContent from "./StudioWriteContent";

export default async function StudioWritePage({
  params,
}: {
  params: { studioId: string };
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return <StudioWriteContent studioId={params.studioId} />;
}


