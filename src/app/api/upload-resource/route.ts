import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/auth';

// 자료 공유 노드용 파일 업로드 (모든 파일 타입 허용)
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 파일 크기 검증 (100MB 제한)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
    }

    // Vercel Blob에 파일 업로드
    const blob = await put(`resources/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // 파일 ID 생성 (URL 기반)
    const fileId = blob.url.split('/').pop()?.split('?')[0] || crypto.randomUUID();

    return NextResponse.json({
      url: blob.url,
      fileId: fileId,
      success: true
    });

  } catch (error) {
    console.error('❌ Vercel Blob 업로드 실패:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

