import prisma from "@/lib/prisma";
import { del } from '@vercel/blob';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 },
      );
    }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    // Vercel Blob 파일들 삭제
    await Promise.all(
      unusedMedia.map(async (media) => {
        try {
          await del(media.url);
          console.log(`🗑️ Blob 파일 삭제됨: ${media.url}`);
        } catch (error) {
          console.error(`❌ Blob 파일 삭제 실패: ${media.url}`, error);
        }
      })
    );

    // 데이터베이스에서 미디어 레코드 삭제
    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    });

    console.log(`🧹 정리 완료: ${unusedMedia.length}개 미디어 파일 삭제됨`);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
