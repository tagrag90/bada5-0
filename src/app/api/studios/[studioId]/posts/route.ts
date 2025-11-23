import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { getPostDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  try {
    const { studioId } = await params;
    const { user } = await validateRequest();

    const posts = await prisma.post.findMany({
      where: {
        studioId: studioId,
      },
      select: getPostDataSelect(user?.id || ""),
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(posts);
  } catch (error) {
    return handleApiError(error);
  }
}


