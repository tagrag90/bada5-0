import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { checkStudioAccess } from "@/lib/permissions";
import { NextRequest } from "next/server";
import { handleApiError } from "@/lib/api-error-handler";

// POST /api/studios/[studioId]/files/[fileId]/generate-thumbnail
// 클라이언트에서 화이트보드를 열어서 썸네일을 생성하도록 안내하는 API
// 실제 썸네일 생성은 클라이언트 사이드에서 이루어짐
export async function POST(
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

    // 파일 확인
    const file = await prisma.workspaceFile.findFirst({
      where: {
        id: fileId,
        studioId,
      },
      include: {
        _count: {
          select: {
            nodes: true,
          },
        },
      },
    });

    if (!file) {
      return Response.json({ error: "파일을 찾을 수 없습니다" }, { status: 404 });
    }

    // 노드가 없으면 썸네일 생성 불가
    if (file._count.nodes === 0) {
      return Response.json({ 
        error: "노드가 없어 썸네일을 생성할 수 없습니다",
        message: "파일에 노드를 추가한 후 다시 시도해주세요."
      }, { status: 400 });
    }

    // 이 API는 단순히 파일이 썸네일 생성을 시도할 수 있는지 확인만 함
    // 실제 썸네일 생성은 클라이언트에서 화이트보드를 열어서 자동 생성됨
    return Response.json({ 
      success: true,
      message: "파일을 열어서 썸네일이 자동 생성됩니다."
    });
  } catch (error: any) {
    return handleApiError(error, 'studios-files-fileId-generate-thumbnail');
  }
}

