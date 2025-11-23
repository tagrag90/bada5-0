import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const limit = req.nextUrl.searchParams.get("limit");

    // limit 파라미터가 있으면 미리보기 모드 (페이지네이션 없음)
    const isPreviewMode = !!limit;
    const pageSize = isPreviewMode ? parseInt(limit) : 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: isPreviewMode ? pageSize : pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    if (isPreviewMode) {
      // 미리보기 모드: 단순히 posts만 반환
      return Response.json({ posts });
    }

    // 기존 페이지네이션 모드
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
