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

    // 구독 상태 확인
    const subscription = await prisma.studioSubscription.findUnique({
      where: {
        studioId_userId: {
          studioId: params.studioId,
          userId: user.id,
        },
      },
    });

    return Response.json({
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
