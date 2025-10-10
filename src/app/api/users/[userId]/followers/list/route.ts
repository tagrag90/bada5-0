import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 팔로워 리스트 조회
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
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
    const followerIds = followers.map(f => f.followerId);
    const myFollowing = loggedInUser.id === userId ? [] : await prisma.follow.findMany({
      where: {
        followerId: loggedInUser.id,
        followingId: { in: followerIds },
      },
      select: { followingId: true },
    });

    const myFollowingIds = new Set(myFollowing.map(f => f.followingId));

    // 응답 데이터 가공
    const followersData = followers.map(follow => ({
      id: follow.follower.id,
      username: follow.follower.username,
      displayName: follow.follower.displayName,
      avatarUrl: follow.follower.avatarUrl,
      bio: follow.follower.bio,
      followersCount: follow.follower._count.followers,
      followingCount: follow.follower._count.following,
      isFollowedByMe: myFollowingIds.has(follow.follower.id),
    }));

    // 전체 팔로워 수
    const total = await prisma.follow.count({
      where: { followingId: userId },
    });

    return Response.json({
      followers: followersData,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching followers list:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
