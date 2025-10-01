import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { requireStudioMember } from "@/lib/permissions";
import { NextRequest } from "next/server";

// GET /api/studios/[studioId]/items
export async function GET(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireStudioMember(user.id, params.studioId);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // NOTE, EVENT, TASK
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const hasDate = searchParams.get("hasDate"); // 날짜 있는 아이템만

    const where: any = { studioId: params.studioId };

    if (type) {
      where.type = type;
    }

    // 날짜 필터
    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (hasDate === "true") {
      // 날짜가 있는 아이템만 (캘린더용)
      where.date = {
        not: null,
      };
    }

    const items = await prisma.studioItem.findMany({
      where,
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });

    return Response.json(items);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 403 });
  }
}

// POST /api/studios/[studioId]/items
export async function POST(
  req: NextRequest,
  { params }: { params: { studioId: string } }
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireStudioMember(user.id, params.studioId);

    const body = await req.json();
    const {
      title,
      content,
      type,
      date,
      time,
      duration,
      location,
      attendees,
      tags,
      category,
      color,
    } = body;

    const item = await prisma.studioItem.create({
      data: {
        studioId: params.studioId,
        authorId: user.id,
        title,
        content,
        type: type || "NOTE",
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(duration && { duration }),
        ...(location && { location }),
        ...(attendees && { attendees }),
        ...(tags && { tags }),
        ...(category && { category }),
        ...(color && { color }),
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

    return Response.json(item, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 403 });
  }
}

