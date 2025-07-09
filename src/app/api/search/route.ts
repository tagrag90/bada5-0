import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage, getUserDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 검색어가 비어있으면 빈 결과 반환
    if (!q.trim()) {
      return Response.json({
        posts: [],
        users: [],
        nextCursor: null,
      });
    }

    // 게시물 검색
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            content: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            user: {
              displayName: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              username: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    // 사용자 검색 (첫 페이지에서만)
    const users = !cursor ? await prisma.user.findMany({
      where: {
        OR: [
          {
            displayName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      select: getUserDataSelect(user.id),
      take: 5, // 사용자는 최대 5개만 표시
    }) : [];

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data = {
      posts: posts.slice(0, pageSize),
      users: users,
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}