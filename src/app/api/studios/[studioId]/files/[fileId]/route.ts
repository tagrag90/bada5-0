import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { checkStudioAccess } from "@/lib/permissions";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId]/files/[fileId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; fileId: string }> }
) {
  try {
    const { studioId, fileId } = await params;
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

    const file = await prisma.workspaceFile.findFirst({
      where: {
        id: fileId,
        studioId,
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

    if (!file) {
      return Response.json({ error: "파일을 찾을 수 없습니다" }, { status: 404 });
    }

    return Response.json(file);
  } catch (error: any) {
    console.error("Error fetching workspace file:", error);
    return Response.json(
      { error: error.message || "Failed to fetch file" },
      { status: 500 }
    );
  }
}

// PATCH /api/studios/[studioId]/files/[fileId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; fileId: string }> }
) {
  try {
    const { studioId, fileId } = await params;
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
    const updateData: any = {};

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return Response.json(
          { error: "파일 이름은 비어있을 수 없습니다" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }
    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }
    if (body.thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = body.thumbnailUrl || null;
    }
    if (body.order !== undefined) {
      updateData.order = parseInt(body.order);
    }

    const updatedFile = await prisma.workspaceFile.update({
      where: {
        id: fileId,
        studioId,
      },
      data: updateData,
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

    return Response.json(updatedFile);
  } catch (error: any) {
    console.error("Error updating workspace file:", error);
    if (error.code === "P2025") {
      return Response.json({ error: "파일을 찾을 수 없습니다" }, { status: 404 });
    }
    return Response.json(
      { error: error.message || "Failed to update file" },
      { status: 500 }
    );
  }
}

// DELETE /api/studios/[studioId]/files/[fileId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; fileId: string }> }
) {
  try {
    const { studioId, fileId } = await params;
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

    // 파일 삭제 (CASCADE로 노드와 연결선도 함께 삭제됨)
    await prisma.workspaceFile.delete({
      where: {
        id: fileId,
        studioId,
      },
    });

    return Response.json({ message: "파일이 성공적으로 삭제되었습니다" });
  } catch (error: any) {
    console.error("Error deleting workspace file:", error);
    if (error.code === "P2025") {
      return Response.json({ error: "파일을 찾을 수 없습니다" }, { status: 404 });
    }
    return Response.json(
      { error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}

