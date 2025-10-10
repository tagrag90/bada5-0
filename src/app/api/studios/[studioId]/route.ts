import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { requireStudioOwner, checkStudioAccess, getStudioPermission } from "@/lib/permissions";
import { getStudioDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId] - 스튜디오 상세 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studio = await prisma.studio.findUnique({
      where: { id: params.studioId },
      select: getStudioDataSelect(user.id),
    });

    if (!studio) {
      return Response.json(
        { error: "스튜디오를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 비공개 스튜디오는 멤버만 조회 가능
    if (!studio.isPublic) {
      const access = await checkStudioAccess(user.id, params.studioId);
      if (!access) {
        return Response.json({ error: "접근 권한이 없습니다" }, { status: 403 });
      }
    }

    return Response.json(studio);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/studios/[studioId] - 스튜디오 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 소유자 또는 관리자 권한 확인
    const permission = await getStudioPermission(user.id, params.studioId);
    if (!permission || !permission.canManage) {
      throw new Error("스튜디오를 관리할 권한이 없습니다");
    }

    const body = await req.json();
    const { name, description, avatarUrl, bannerUrl, socialLinks, isPublic } = body;

    const studio = await prisma.studio.update({
      where: { id: params.studioId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bannerUrl !== undefined && { bannerUrl }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(isPublic !== undefined && { isPublic }),
      },
      select: getStudioDataSelect(user.id),
    });

    return Response.json(studio);
  } catch (error: any) {
    console.error(error);
    if (error.message) {
      return Response.json({ error: error.message }, { status: 403 });
    }
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/studios/[studioId] - 스튜디오 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 소유자 권한 확인
    await requireStudioOwner(user.id, params.studioId);

    await prisma.studio.delete({
      where: { id: params.studioId },
    });

    return Response.json({ message: "스튜디오가 삭제되었습니다" });
  } catch (error: any) {
    console.error(error);
    if (error.message) {
      return Response.json({ error: error.message }, { status: 403 });
    }
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

