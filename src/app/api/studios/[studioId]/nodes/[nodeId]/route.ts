import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma";
import { checkStudioAccess } from "@/lib/permissions";
import { NextRequest } from "next/server";

// PATCH /api/studios/[studioId]/nodes/[nodeId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; nodeId: string }> }
) {
  try {
    const { studioId, nodeId } = await params;
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

    // 노드 존재 확인 및 권한 확인
    const existingNode = await prisma.projectNode.findFirst({
      where: {
        id: nodeId,
        studioId: studioId,
      },
    });

    if (!existingNode) {
      return Response.json({ error: "Node not found" }, { status: 404 });
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    // emoji는 null이어도 명시적으로 업데이트 (빈 문자열도 null로 처리)
    if (body.emoji !== undefined) {
      updateData.emoji = body.emoji && body.emoji.trim() ? body.emoji.trim() : null;
    }
    if (body.x !== undefined) updateData.x = parseFloat(body.x);
    if (body.y !== undefined) updateData.y = parseFloat(body.y);
    if (body.width !== undefined) updateData.width = parseFloat(body.width);
    if (body.height !== undefined) updateData.height = parseFloat(body.height);
    if (body.type !== undefined) updateData.type = body.type;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.isCollapsed !== undefined) updateData.isCollapsed = body.isCollapsed;
    if (body.config !== undefined) updateData.config = body.config;

    logger.debug("Updating node:", { nodeId, updateData });

    const node = await prisma.projectNode.update({
      where: { id: nodeId },
      data: updateData,
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return Response.json(node);
  } catch (error: any) {
    return handleApiError(error);
  }
}

// DELETE /api/studios/[studioId]/nodes/[nodeId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; nodeId: string }> }
) {
  try {
    const { studioId, nodeId } = await params;
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

    // 노드 존재 확인
    const existingNode = await prisma.projectNode.findFirst({
      where: {
        id: nodeId,
        studioId: studioId,
      },
    });

    if (!existingNode) {
      return Response.json({ error: "Node not found" }, { status: 404 });
    }

    // 노드 삭제 (연결선은 cascade로 자동 삭제됨)
    await prisma.projectNode.delete({
      where: { id: nodeId },
    });

    return Response.json({ message: "Node deleted successfully" });
  } catch (error: any) {
    return handleApiError(error);
  }
}

