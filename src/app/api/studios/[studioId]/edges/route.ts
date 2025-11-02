import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { requireStudioMember } from "@/lib/permissions";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId]/edges
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

    await requireStudioMember(user.id, studioId);

    const edges = await prisma.nodeEdge.findMany({
      where: { studioId: studioId },
      include: {
        fromNode: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        toNode: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return Response.json(edges);
  } catch (error: any) {
    console.error("Error fetching edges:", error);
    return Response.json({ error: error.message || "Failed to fetch edges" }, { status: 500 });
  }
}

// POST /api/studios/[studioId]/edges
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

    await requireStudioMember(user.id, studioId);

    const body = await req.json();
    const { fromId, toId, fromPort, toPort, type, label, color } = body;

    if (!fromId || !toId) {
      return Response.json(
        { error: "fromId and toId are required" },
        { status: 400 }
      );
    }

    // 노드들이 같은 Studio에 속하는지 확인
    const fromNode = await prisma.projectNode.findFirst({
      where: { id: fromId, studioId: studioId },
    });

    const toNode = await prisma.projectNode.findFirst({
      where: { id: toId, studioId: studioId },
    });

    if (!fromNode || !toNode) {
      return Response.json(
        { error: "Both nodes must belong to this studio" },
        { status: 400 }
      );
    }

    // 자기 자신에게 연결 불가
    if (fromId === toId) {
      return Response.json(
        { error: "Cannot connect node to itself" },
        { status: 400 }
      );
    }

    const edge = await prisma.nodeEdge.create({
      data: {
        studioId: studioId,
        fromId,
        toId,
        fromPort: fromPort || null,
        toPort: toPort || null,
        type: type || "ARROW",
        label: label || null,
        color: color || null,
      },
      include: {
        fromNode: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        toNode: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    return Response.json(edge, { status: 201 });
  } catch (error: any) {
    // unique constraint 에러 처리
    if (error.code === "P2002") {
      return Response.json(
        { error: "Edge already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating edge:", error);
    return Response.json({ error: error.message || "Failed to create edge" }, { status: 500 });
  }
}

