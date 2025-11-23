import { validateRequest } from "@/auth";
import { handleApiError, AppError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { requireStudioOwner, checkStudioAccess, getStudioPermission } from "@/lib/permissions";
import { getStudioDataSelect } from "@/lib/types";
import { updateStudioSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId] - 스튜디오 상세 조회
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

    const studio = await prisma.studio.findUnique({
      where: { id: studioId },
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
      const access = await checkStudioAccess(user.id, studioId);
      if (!access) {
        return Response.json({ error: "접근 권한이 없습니다" }, { status: 403 });
      }
    }

    return Response.json(studio);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/studios/[studioId] - 스튜디오 수정
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

    // 소유자 또는 관리자 권한 확인
    const permission = await getStudioPermission(user.id, studioId);
    if (!permission || !permission.canManage) {
      throw new Error("스튜디오를 관리할 권한이 없습니다");
    }

    const body = await req.json();
    const validatedData = updateStudioSchema.parse(body);
    const { name, description, avatarUrl, bannerUrl, socialLinks, isPublic } = validatedData;

    const studio = await prisma.studio.update({
      where: { id: studioId },
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
    if (error.message) {
      return handleApiError(new AppError(error.message, 403));
    }
    return handleApiError(error);
  }
}

// DELETE /api/studios/[studioId] - 스튜디오 삭제
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

    // 소유자 권한 확인
    await requireStudioOwner(user.id, studioId);

    await prisma.studio.delete({
      where: { id: studioId },
    });

    return Response.json({ message: "스튜디오가 삭제되었습니다" });
  } catch (error: any) {
    if (error.message) {
      return handleApiError(new AppError(error.message, 403));
    }
    return handleApiError(error);
  }
}

