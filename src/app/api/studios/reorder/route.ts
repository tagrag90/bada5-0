import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studioIds } = await req.json();

    if (!Array.isArray(studioIds)) {
      return NextResponse.json(
        { error: "studioIds must be an array" },
        { status: 400 }
      );
    }

    // 사용자가 소유한 스튜디오만 필터링 (멤버 스튜디오는 제외)
    const ownedStudios = await prisma.studio.findMany({
      where: {
        ownerId: user.id,
        id: {
          in: studioIds,
        },
      },
      select: {
        id: true,
      },
    });

    const ownedStudioIds = ownedStudios.map((s) => s.id);

    // 소유한 스튜디오만 순서 업데이트
    if (ownedStudioIds.length === 0) {
      return NextResponse.json(
        { error: "재정렬할 스튜디오가 없습니다" },
        { status: 400 }
      );
    }

    // 요청된 순서에서 소유한 스튜디오만 추출 (순서 유지)
    const orderedStudioIds = studioIds.filter((id) => ownedStudioIds.includes(id));

    // 순서 업데이트 (트랜잭션) - 소유한 스튜디오만
    await prisma.$transaction(
      orderedStudioIds.map((studioId, index) =>
        prisma.studio.update({
          where: { id: studioId },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

