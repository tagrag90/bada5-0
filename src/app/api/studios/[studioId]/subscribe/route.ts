import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// POST /api/studios/[studioId]/subscribe - 스튜디오 구독
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  try {
    const { studioId } = await params;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 스튜디오 존재 확인
    const studio = await prisma.studio.findUnique({
      where: { id: studioId },
    });

    if (!studio) {
      return Response.json(
        { error: "스튜디오를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 구독 중인지 확인
    const existing = await prisma.studioSubscription.findUnique({
      where: {
        studioId_userId: {
          studioId: studioId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return Response.json(
        { error: "이미 구독 중입니다" },
        { status: 400 }
      );
    }

    // 구독 생성
    await prisma.$transaction([
      prisma.studioSubscription.create({
        data: {
          studioId: studioId,
          userId: user.id,
        },
      }),
      prisma.studio.update({
        where: { id: studioId },
        data: {
          subscribersCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return Response.json({ message: "구독했습니다" });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/studios/[studioId]/subscribe - 구독 취소
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  try {
    const { studioId } = await params;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 구독 확인
    const subscription = await prisma.studioSubscription.findUnique({
      where: {
        studioId_userId: {
          studioId: studioId,
          userId: user.id,
        },
      },
    });

    if (!subscription) {
      return Response.json(
        { error: "구독하지 않은 스튜디오입니다" },
        { status: 400 }
      );
    }

    // 구독 취소
    await prisma.$transaction([
      prisma.studioSubscription.delete({
        where: {
          studioId_userId: {
            studioId: studioId,
            userId: user.id,
          },
        },
      }),
      prisma.studio.update({
        where: { id: studioId },
        data: {
          subscribersCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return Response.json({ message: "구독을 취소했습니다" });
  } catch (error) {
    return handleApiError(error);
  }
}

