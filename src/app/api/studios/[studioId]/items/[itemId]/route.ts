import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { requireStudioMember } from "@/lib/permissions";
import { NextRequest } from "next/server";

// PATCH /api/studios/[studioId]/items/[itemId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; itemId: string }> }
) {
  try {
    const { studioId, itemId } = await params;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireStudioMember(user.id, studioId);

    const body = await req.json();

    const item = await prisma.studioItem.update({
      where: { id: itemId },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.type && { type: body.type }),
        ...(body.date !== undefined && { date: body.date ? new Date(body.date) : null }),
        ...(body.time !== undefined && { time: body.time }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.attendees !== undefined && { attendees: body.attendees }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.color !== undefined && { color: body.color }),
        ...(body.isPinned !== undefined && { isPinned: body.isPinned }),
      },
    });

    return Response.json(item);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

// DELETE /api/studios/[studioId]/items/[itemId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studioId: string; itemId: string }> }
) {
  try {
    const { studioId, itemId } = await params;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireStudioMember(user.id, studioId);

    await prisma.studioItem.delete({
      where: { id: itemId },
    });

    return Response.json({ message: "삭제되었습니다" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

