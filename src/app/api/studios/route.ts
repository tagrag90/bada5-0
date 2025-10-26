import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getStudioDataSelect } from "@/lib/types";
import { createStudioSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

// GET /api/studios - 내 스튜디오 목록 조회
export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 내가 소유하거나 멤버인 스튜디오
    const studios = await prisma.studio.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      select: getStudioDataSelect(user.id),
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(studios);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/studios - 스튜디오 생성
export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createStudioSchema.parse(body);
    const { name, description, avatarUrl, bannerUrl, socialLinks, isPublic } = validatedData;

    // slug는 별도 처리 (validation schema에 포함되지 않음)
    const slug = body.slug;
    if (!slug) {
      return Response.json(
        { error: "슬러그는 필수입니다" },
        { status: 400 }
      );
    }

    // 슬러그 중복 확인
    const existing = await prisma.studio.findUnique({
      where: { slug },
    });

    if (existing) {
      return Response.json(
        { error: "이미 사용 중인 슬러그입니다" },
        { status: 400 }
      );
    }

    // 스튜디오 생성
    const studio = await prisma.studio.create({
      data: {
        name,
        slug,
        description,
        avatarUrl,
        bannerUrl,
        socialLinks,
        isPublic: isPublic ?? true,
        type: body.type || "PERSONAL",
        ownerId: user.id,
      },
      select: getStudioDataSelect(user.id),
    });

    // 소유자를 멤버로 자동 추가
    await prisma.studioMember.create({
      data: {
        studioId: studio.id,
        userId: user.id,
        role: "OWNER",
      },
    });

    return Response.json(studio, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

