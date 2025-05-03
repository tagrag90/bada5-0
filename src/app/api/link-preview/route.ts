import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

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
    const metadata = await fetchMetadata(url);
    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid URL provided' },
      { status: 400 }
    );
  }
} 