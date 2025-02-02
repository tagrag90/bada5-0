import { NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ success: false, error: 'URL is required' });
  }

  try {
    const { result } = await ogs({ url });
    const ogData = {
      title: result.ogTitle || '',
      description: result.ogDescription || '',
      image: result.ogImage?.[0]?.url || '',
      url: result.requestUrl,
      siteName: result.ogSiteName,
    };
    return NextResponse.json({ success: true, ogData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch OG data' });
  }
} 