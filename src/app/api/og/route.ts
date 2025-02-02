import { NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ success: false, error: 'URL이 필요합니다.' });
  }

  try {
    const { result } = await ogs({ url });
    
    const metadata = {
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
      url: result.ogUrl || url,
    };

    return NextResponse.json({ success: true, metadata });
  } catch (error) {
    console.error('OG 스크래핑 실패:', error);
    return NextResponse.json({ success: false, error: '메타데이터를 가져올 수 없습니다.' });
  }
} 