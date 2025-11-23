import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';

// Vercel 함수 타임아웃 설정 (최대 60초)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = (formData.get('type') as 'media' | 'avatar' | 'studio-avatar' | 'studio-banner') || 'media';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 파일 타입 검증
    const allowedTypes = {
      media: ['image/', 'video/'],
      avatar: ['image/'],
      'studio-avatar': ['image/'],
      'studio-banner': ['image/']
    };

    // application/octet-stream인 경우 확장자로 타입 추론
    let fileType = file.type;
    if (file.type === 'application/octet-stream') {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'webp') {
        fileType = 'image/webp';
      } else if (extension === 'jpg' || extension === 'jpeg') {
        fileType = 'image/jpeg';
      } else if (extension === 'png') {
        fileType = 'image/png';
      } else if (extension === 'gif') {
        fileType = 'image/gif';
      }
    }

    const allowed = allowedTypes[uploadType]?.some(type => fileType.startsWith(type));
    if (!allowed) {
      return NextResponse.json({
        error: `Invalid file type: ${file.type} (inferred: ${fileType}). Allowed: ${allowedTypes[uploadType]?.join(', ')}`
      }, { status: 400 });
    }

    // 파일 크기 검증
    const maxSizes = {
      media: 8 * 1024 * 1024, // 8MB
      avatar: 2 * 1024 * 1024, // 2MB
      'studio-avatar': 2 * 1024 * 1024, // 2MB
      'studio-banner': 8 * 1024 * 1024 // 8MB
    };

    if (file.size > maxSizes[uploadType]) {
      const maxSizeMB = maxSizes[uploadType] / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const fileTypeLabel = file.type.startsWith('video/') ? '비디오' : '이미지';
      
      return NextResponse.json({ 
        error: 'File too large',
        message: `${fileTypeLabel} 파일 크기가 너무 큽니다. (${fileSizeMB}MB / 최대 ${maxSizeMB}MB)`,
      }, { status: 400 });
    }

    // Vercel Blob에 파일 업로드 (upload-resource와 동일한 방식)
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      success: true
    });

  } catch (error) {
    return handleApiError(error, 'upload');
  }
}
