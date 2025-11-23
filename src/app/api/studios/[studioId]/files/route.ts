import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { checkStudioAccess } from "@/lib/permissions";
import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error-handler";

// GET /api/studios/[studioId]/files
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

    // 권한 확인: 소유자 또는 멤버
    const access = await checkStudioAccess(user.id, studioId);
    if (!access) {
      return Response.json(
        { error: "접근 권한이 없습니다" },
        { status: 403 }
      );
    }

    const files = await prisma.workspaceFile.findMany({
      where: { studioId },
      orderBy: { order: "asc" },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            nodes: true,
            edges: true,
          },
        },
      },
    });

    return Response.json(files);
  } catch (error: any) {
    return handleApiError(error, 'studios-files-get');
  }
}

// POST /api/studios/[studioId]/files
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

    // 권한 확인: 소유자 또는 멤버
    const access = await checkStudioAccess(user.id, studioId);
    if (!access) {
      return Response.json(
        { error: "접근 권한이 없습니다" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, thumbnailUrl, order } = body;

    if (!name || !name.trim()) {
      return Response.json(
        { error: "파일 이름은 필수입니다" },
        { status: 400 }
      );
    }

    // order가 없으면 가장 큰 order + 1로 설정
    let fileOrder = order;
    if (fileOrder === undefined) {
      const maxOrderFile = await prisma.workspaceFile.findFirst({
        where: { studioId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      fileOrder = maxOrderFile ? maxOrderFile.order + 1 : 0;
    }

    const newFile = await prisma.workspaceFile.create({
      data: {
        studioId,
        authorId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        thumbnailUrl: thumbnailUrl || null,
        order: fileOrder,
      },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            nodes: true,
            edges: true,
          },
        },
      },
    });

    return Response.json(newFile, { status: 201 });
  } catch (error: any) {
    return handleApiError(error, 'studios-files-post');
  }
}

