import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { requireStudioMember, requireStudioOwner } from "@/lib/permissions";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId]/members - 멤버 목록
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

    // 멤버 권한 확인
    await requireStudioMember(user.id, studioId);

    const members = await prisma.studioMember.findMany({
      where: { studioId: studioId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [
        { role: "asc" },
        { joinedAt: "asc" },
      ],
    });

    return Response.json(members);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

// POST /api/studios/[studioId]/members - 멤버 초대
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

    // ADMIN 이상 권한 필요
    await requireStudioMember(user.id, studioId, "ADMIN");

    const body = await req.json();
    const { username, role } = body;

    // 초대할 사용자 찾기
    const invitedUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!invitedUser) {
      return Response.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 멤버인지 확인
    const existing = await prisma.studioMember.findUnique({
      where: {
        studioId_userId: {
          studioId: studioId,
          userId: invitedUser.id,
        },
      },
    });

    if (existing) {
      return Response.json(
        { error: "이미 멤버입니다" },
        { status: 400 }
      );
    }

    // 멤버 추가
    const member = await prisma.studioMember.create({
      data: {
        studioId: studioId,
        userId: invitedUser.id,
        role: role || "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return Response.json(member, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

// PATCH /api/studios/[studioId]/members/[memberId] - 멤버 역할 업데이트
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string }> }
) {
  try {
    const { studioId } = await params;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return Response.json(
        { error: "memberId가 필요합니다" },
        { status: 400 }
      );
    }

    // ADMIN 이상 권한 필요
    await requireStudioMember(user.id, studioId, "ADMIN");

    const body = await req.json();
    const { role } = body;

    if (!role || !["ADMIN", "MODERATOR", "MEMBER"].includes(role)) {
      return Response.json(
        { error: "유효하지 않은 역할입니다" },
        { status: 400 }
      );
    }

    // 멤버 존재 확인 및 업데이트
    const updatedMember = await prisma.studioMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return Response.json(updatedMember);
  } catch (error: any) {
    logger.error("Error updating member role:", error);
    return handleApiError(error);
  }
}

// DELETE /api/studios/[studioId]/members/[memberId]
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

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return Response.json(
        { error: "memberId가 필요합니다" },
        { status: 400 }
      );
    }

    // ADMIN 이상 권한 필요
    await requireStudioMember(user.id, studioId, "ADMIN");

    await prisma.studioMember.delete({
      where: { id: memberId },
    });

    return Response.json({ message: "멤버가 제거되었습니다" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

