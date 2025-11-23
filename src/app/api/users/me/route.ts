import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 완전한 사용자 정보 조회 (skills, followers count 포함)
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        googleId: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!fullUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(fullUser);
  } catch (error) {
    return handleApiError(error, 'users-me');
  }
}


