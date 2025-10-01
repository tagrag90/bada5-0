import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import StudiosContent from "./StudiosContent";

export const metadata = {
  title: "내 스튜디오 | Dive to Bada",
  description: "스튜디오를 생성하고 관리하세요",
};

export default async function StudiosPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  return <StudiosContent />;
}

