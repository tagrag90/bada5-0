import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 멤버십 상태 확인
    const membership = await prisma.studioMember.findUnique({
      where: {
        studioId_userId: {
          studioId: params.studioId,
          userId: user.id,
        },
      },
      select: {
        role: true,
        joinedAt: true,
      },
    });

    // 구독 상태 확인 (멤버가 아닌 경우에만)
    const subscription = await prisma.studioSubscription.findUnique({
      where: {
        studioId_userId: {
          studioId: params.studioId,
          userId: user.id,
        },
      },
      select: {
        subscribedAt: true,
      },
    });

    return Response.json({
      isMember: !!membership,
      memberRole: membership?.role,
      memberSince: membership?.joinedAt,
      isSubscribed: !!subscription,
      subscribedAt: subscription?.subscribedAt,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
