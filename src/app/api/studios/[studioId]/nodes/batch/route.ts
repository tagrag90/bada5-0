import { validateRequest } from "@/auth";
import { handleApiError } from "@/lib/api-error-handler";
import prisma from "@/lib/prisma";
import { requireStudioMember } from "@/lib/permissions";
import { NextRequest } from "next/server";

// PATCH /api/studios/[studioId]/nodes/batch
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

    await requireStudioMember(user.id, studioId);

    const body = await req.json();
    const { nodes } = body; // [{ id, x, y, width, height, ... }, ...]

    if (!Array.isArray(nodes)) {
      return Response.json({ error: "nodes must be an array" }, { status: 400 });
    }

    // 트랜잭션으로 여러 노드 일괄 업데이트
    const updates = nodes.map((node: any) => {
      const updateData: any = {};
      if (node.x !== undefined) updateData.x = parseFloat(node.x);
      if (node.y !== undefined) updateData.y = parseFloat(node.y);
      if (node.width !== undefined) updateData.width = parseFloat(node.width);
      if (node.height !== undefined) updateData.height = parseFloat(node.height);
      if (node.title !== undefined) updateData.title = node.title;
      if (node.content !== undefined) updateData.content = node.content;
      if (node.color !== undefined) updateData.color = node.color;
      if (node.isCollapsed !== undefined) updateData.isCollapsed = node.isCollapsed;
      if (node.config !== undefined) updateData.config = node.config;

      return prisma.projectNode.update({
        where: { id: node.id },
        data: updateData,
      });
    });

    await prisma.$transaction(updates);

    return Response.json({ message: "Nodes updated successfully", count: nodes.length });
  } catch (error: any) {
    return handleApiError(error);
  }
}

