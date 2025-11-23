import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { requireStudioMember } from "@/lib/permissions";
import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error-handler";

// DELETE /api/studios/[studioId]/edges/[edgeId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; edgeId: string }> }
) {
  try {
    const { studioId, edgeId } = await params;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireStudioMember(user.id, studioId);

    // 연결선 존재 확인
    const existingEdge = await prisma.nodeEdge.findFirst({
      where: {
        id: edgeId,
        studioId: studioId,
      },
    });

    if (!existingEdge) {
      return Response.json({ error: "Edge not found" }, { status: 404 });
    }

    await prisma.nodeEdge.delete({
      where: { id: edgeId },
    });

    return Response.json({ message: "Edge deleted successfully" });
  } catch (error: any) {
    return handleApiError(error, 'studios-edges-edgeId-delete');
  }
}

