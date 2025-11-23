import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 팔로잉 리스트 조회
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
    });

    // 현재 로그인한 사용자가 팔로우하고 있는지 확인하기 위한 추가 조회
    const followingIds = following.map(f => f.followingId);
    const myFollowing = loggedInUser.id === userId ? [] : await prisma.follow.findMany({
      where: {
        followerId: loggedInUser.id,
        followingId: { in: followingIds },
      },
      select: { followingId: true },
    });

    const myFollowingIds = new Set(myFollowing.map(f => f.followingId));

    // 응답 데이터 가공
    const followingData = following.map(follow => ({
      id: follow.following.id,
      username: follow.following.username,
      displayName: follow.following.displayName,
      avatarUrl: follow.following.avatarUrl,
      bio: follow.following.bio,
      followersCount: follow.following._count.followers,
      followingCount: follow.following._count.following,
      isFollowedByMe: myFollowingIds.has(follow.following.id),
    }));

    // 전체 팔로잉 수
    const total = await prisma.follow.count({
      where: { followerId: userId },
    });

    return Response.json({
      following: followingData,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    return handleApiError(error, 'users-following-list');
  }
}
