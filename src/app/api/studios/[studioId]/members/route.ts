import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { requireStudioMember, requireStudioOwner } from "@/lib/permissions";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId]/members - 멤버 목록
export async function GET(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 멤버 권한 확인
    await requireStudioMember(user.id, params.studioId);

    const members = await prisma.studioMember.findMany({
      where: { studioId: params.studioId },
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
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ADMIN 이상 권한 필요
    await requireStudioMember(user.id, params.studioId, "ADMIN");

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
          studioId: params.studioId,
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
        studioId: params.studioId,
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

// DELETE /api/studios/[studioId]/members/[memberId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
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
    await requireStudioMember(user.id, params.studioId, "ADMIN");

    await prisma.studioMember.delete({
      where: { id: memberId },
    });

    return Response.json({ message: "멤버가 제거되었습니다" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

