import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { getPostDataSelect, PostsPage } from "@/lib/types";

// 비로그인 사용자를 위한 가상 사용자 ID
const ANONYMOUS_USER_ID = "anonymous-user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = 10;

  try {
    // 공개 게시물을 가져옴 (비로그인 사용자용)
    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1,
          }
        : {}),
      orderBy: {
        createdAt: "desc",
      },
      select: getPostDataSelect(ANONYMOUS_USER_ID),
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    const result: PostsPage = {
      posts: posts.slice(0, limit),
      nextCursor,
    };

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
} 