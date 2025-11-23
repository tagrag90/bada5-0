import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  try {
    const { studioId } = await params;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 스튜디오 정보 확인 (소유자 체크용)
    const studio = await prisma.studio.findUnique({
      where: { id: studioId },
      select: {
        ownerId: true,
      },
    });

    if (!studio) {
      return Response.json({ error: "Studio not found" }, { status: 404 });
    }

    // 소유자인 경우
    const isOwner = studio.ownerId === user.id;

    // 멤버십 상태 확인 (소유자가 아닌 경우에만)
    const membership = isOwner ? null : await prisma.studioMember.findUnique({
      where: {
        studioId_userId: {
          studioId: studioId,
          userId: user.id,
        },
      },
      select: {
        role: true,
        joinedAt: true,
      },
    });

    // 구독 상태 확인 (소유자가 아닌 경우에만)
    const subscription = isOwner ? null : await prisma.studioSubscription.findUnique({
      where: {
        studioId_userId: {
          studioId: studioId,
          userId: user.id,
        },
      },
      select: {
        subscribedAt: true,
      },
    });

    return Response.json({
      userId: user.id,
      isOwner,
      isMember: isOwner || !!membership,
      memberRole: isOwner ? "OWNER" : membership?.role,
      memberSince: membership?.joinedAt,
      isSubscribed: !!subscription,
      subscribedAt: subscription?.subscribedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
