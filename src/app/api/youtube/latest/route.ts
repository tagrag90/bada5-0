import { handleApiError } from "@/lib/api-error-handler";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json(
      { error: "channelId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        next: { revalidate: 3600 }, // 1시간마다 캐시 갱신
      },
    );

    if (!response.ok) {
      logger.error(`Failed to fetch YouTube feed for channel ${channelId}. Status: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch YouTube feed" },
        { status: response.status },
      );
    }

    const text = await response.text();
    // 간단한 정규식으로 첫 번째 videoId를 추출합니다.
    const videoIdMatch = text.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return NextResponse.json(
        { error: "Could not find video ID in the feed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ videoId });
  } catch (error) {
    return handleApiError(error);
  }
} 