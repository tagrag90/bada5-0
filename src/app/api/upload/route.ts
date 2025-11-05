import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = (formData.get('type') as 'media' | 'avatar' | 'studio-avatar' | 'studio-banner') || 'media'; // media, avatar, studio-avatar, studio-banner

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log(`📁 파일 업로드 시도 [${uploadType}]:`, {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // 파일 타입 검증 (application/octet-stream도 허용 - WebP 등의 경우)
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
      console.error(`❌ 파일 타입 거부 [${uploadType}]:`, file.type, `(추론: ${fileType})`);
      return NextResponse.json({
        error: `Invalid file type: ${file.type} (inferred: ${fileType}). Allowed: ${allowedTypes[uploadType]?.join(', ')}`
      }, { status: 400 });
    }

    console.log(`✅ 파일 타입 승인 [${uploadType}]:`, fileType);

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
        maxSize: maxSizes[uploadType],
        fileSize: file.size,
        fileType: file.type.startsWith('video/') ? 'video' : 'image'
      }, { status: 400 });
    }

    // Vercel Blob에 파일 업로드 (고유한 파일명 생성)
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // 같은 이름 파일 충돌 방지
    });

    console.log(`✅ Vercel Blob 업로드 성공 [${uploadType}]:`, blob.url);

    // 데이터베이스에 미디어 정보 저장 (게시물 미디어인 경우만)
    let mediaId = null;
    if (uploadType === 'media') {
      const mediaType = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO';
      const media = await prisma.media.create({
        data: {
          url: blob.url,
          type: mediaType,
        },
      });
      mediaId = media.id;
      console.log('💾 미디어 DB 저장 완료, ID:', media.id);
    }

    return NextResponse.json({
      url: blob.url,
      mediaId,
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
