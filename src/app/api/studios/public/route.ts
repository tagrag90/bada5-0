import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    // 공개 스튜디오들 조회 (검색 기능 포함)
    const studios = await prisma.studio.findMany({
      where: {
        isPublic: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        owner: {
          select: {
            username: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            members: true,
            events: true,
            subscriptions: true,
          },
        },
      },
      orderBy: [
        { subscribersCount: "desc" }, // 구독자 수로 정렬
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    // 전체 개수도 함께 반환
    const total = await prisma.studio.count({
      where: {
        isPublic: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    });

    return Response.json({
      studios,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
