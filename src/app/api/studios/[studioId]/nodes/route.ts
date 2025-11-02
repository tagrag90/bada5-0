import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { checkStudioAccess } from "@/lib/permissions";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId]/nodes
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

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // 필터링용 노드 타입

    const where: any = { studioId: studioId };

    if (type) {
      where.type = type;
    }

    const nodes = await prisma.projectNode.findMany({
      where,
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        fromEdges: {
          include: {
            toNode: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
        toEdges: {
          include: {
            fromNode: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(nodes);
  } catch (error: any) {
    console.error("Error fetching nodes:", error);
    return Response.json({ error: error.message || "Failed to fetch nodes" }, { status: 500 });
  }
}

// POST /api/studios/[studioId]/nodes
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
    const {
      type,
      title,
      content,
      x,
      y,
      width,
      height,
      color,
      config,
    } = body;
    
    console.log("Creating node with data:", { type, title, x, y, studioId });

    if (!type || !title || x === undefined || y === undefined) {
      return Response.json(
        { error: "type, title, x, y are required" },
        { status: 400 }
      );
    }

    const node = await prisma.projectNode.create({
      data: {
        studioId: studioId,
        authorId: user.id,
        type: type as any, // NodeType enum
        title,
        content: content || null,
        x: parseFloat(x),
        y: parseFloat(y),
        width: width ? parseFloat(width) : 300,
        height: height ? parseFloat(height) : 200,
        color: color || null,
        config: config || null,
      },
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

    console.log("Node created successfully:", node.id);
    return Response.json(node, { status: 201 });
  } catch (error: any) {
    console.error("Error creating node:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    // Prisma 에러 처리
    if (error.code === "P2002") {
      return Response.json(
        { error: "이미 존재하는 노드입니다" },
        { status: 409 }
      );
    }
    
    return Response.json(
      { 
        error: error.message || "노드 생성에 실패했습니다",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

