import prisma from "@/lib/prisma";
import { PostsPage } from "@/lib/types";
import { Prisma } from "@prisma/client";

// 비로그인 사용자를 위한 가상 사용자 ID
const ANONYMOUS_USER_ID = "anonymous-user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = 10;

  try {
    // 비로그인 사용자용 PostDataInclude를 정의
    const publicPostInclude = {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          skills: true,
          createdAt: true,
          followers: {
            where: {
              followerId: ANONYMOUS_USER_ID,
            },
            select: {
              followerId: true,
            },
          },
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
      },
      studio: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
        },
      },
      attachments: true,
      likes: {
        where: {
          userId: ANONYMOUS_USER_ID,
        },
        select: {
          userId: true,
        },
      },
      bookmarks: {
        where: {
          userId: ANONYMOUS_USER_ID,
        },
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    } satisfies Prisma.PostInclude;

    // 공개 게시물을 가져옴
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
      include: publicPostInclude,
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    // 각 게시물에 likedByMe와 bookmarkedByMe 필드 추가
    const postsWithUserData = posts.map((post) => {
      return {
        ...post,
        likedByMe: false,
        bookmarkedByMe: false,
      };
    });

    const result: PostsPage = {
      posts: postsWithUserData,
      nextCursor,
    };

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return Response.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
} 