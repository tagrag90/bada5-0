import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// YouTube oEmbed API를 사용한 메타데이터 추출
async function fetchYouTubeMetadata(url: string) {
  try {
    // YouTube oEmbed API 호출
    const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube oEmbed API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      url,
      title: data.title || '',
      description: `${data.author_name} • 조회수 정보 없음`, // YouTube oEmbed는 조회수 제공 안함
      image: data.thumbnail_url || null
    };
  } catch (error) {
    console.error('YouTube oEmbed API 오류:', error);
    
    // oEmbed 실패 시 일반 메타데이터 추출로 폴백
    return await fetchMetadata(url);
  }
}

export const runtime = 'edge';

// 페이지에서 메타데이터 추출
async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // 기본 메타데이터 추출
    const metaTitle = $('meta[property="og:title"]').attr('content') || 
                      $('meta[name="twitter:title"]').attr('content') || 
                      $('title').text() || '';
                      
    const metaDescription = $('meta[property="og:description"]').attr('content') || 
                            $('meta[name="twitter:description"]').attr('content') || 
                            $('meta[name="description"]').attr('content') || '';
                            
    const metaImage = $('meta[property="og:image"]').attr('content') || 
                      $('meta[name="twitter:image"]').attr('content') || '';
    
    return {
      url,
      title: metaTitle?.trim().substring(0, 100),
      description: metaDescription?.trim().substring(0, 200),
      image: metaImage || null
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      url,
      title: new URL(url).hostname,
      description: '',
      image: null
    };
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // URL 유효성 검사
    new URL(url);
    
    // YouTube URL인지 확인
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const youtubeMetadata = await fetchYouTubeMetadata(url);
      return NextResponse.json(youtubeMetadata);
    }
    
    const metadata = await fetchMetadata(url);
    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid URL provided' },
      { status: 400 }
    );
  }
} 