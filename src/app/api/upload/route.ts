import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';

// Vercel 함수 타임아웃 설정 (최대 60초)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = (formData.get('type') as 'media' | 'avatar' | 'studio-avatar' | 'studio-banner') || 'media'; // media, avatar, studio-avatar, studio-banner

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    logger.info(`파일 업로드 시도 [${uploadType}]:`, {
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
      logger.warn(`파일 타입 거부 [${uploadType}]:`, file.type, `(추론: ${fileType})`);
      return NextResponse.json({
        error: `Invalid file type: ${file.type} (inferred: ${fileType}). Allowed: ${allowedTypes[uploadType]?.join(', ')}`
      }, { status: 400 });
    }

    logger.debug(`파일 타입 승인 [${uploadType}]:`, fileType);

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
    let blob;
    try {
      // Vercel Blob은 환경 변수에서 자동으로 토큰을 읽어옴
      // 배포 환경에서 토큰이 없으면 에러 발생
      blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true, // 같은 이름 파일 충돌 방지
      });
      logger.info(`Vercel Blob 업로드 성공 [${uploadType}]:`, blob.url);
    } catch (blobError) {
      // 배포 환경에서 발생할 수 있는 에러 상세 로깅
      const errorMessage = blobError instanceof Error ? blobError.message : String(blobError);
      const errorStack = blobError instanceof Error ? blobError.stack : undefined;
      
      logger.error('Vercel Blob 업로드 실패:', {
        error: errorMessage,
        stack: errorStack,
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        nodeEnv: process.env.NODE_ENV,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      
      // 토큰 관련 에러인지 확인
      if (errorMessage.includes('token') || errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
        return NextResponse.json({
          error: '파일 업로드 인증 오류',
          message: '스토리지 서비스 인증에 실패했습니다. 환경 변수를 확인해주세요.',
        }, { status: 500 });
      }
      
      return NextResponse.json({
        error: '파일 업로드 실패',
        message: errorMessage || '알 수 없는 오류가 발생했습니다.',
      }, { status: 500 });
    }

    // 데이터베이스에 미디어 정보 저장 (게시물 미디어인 경우만)
    let mediaId = null;
    if (uploadType === 'media') {
      try {
        const mediaType = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO';
        const media = await prisma.media.create({
          data: {
            url: blob.url,
            type: mediaType,
          },
        });
        mediaId = media.id;
        logger.debug('미디어 DB 저장 완료, ID:', media.id);
      } catch (dbError) {
        // Blob 업로드는 성공했지만 DB 저장 실패한 경우
        logger.error('미디어 DB 저장 실패 (Blob 업로드는 성공):', {
          error: dbError instanceof Error ? dbError.message : String(dbError),
          blobUrl: blob.url,
        });
        // Blob URL은 반환하되, DB 저장 실패는 경고로 처리
        // (이미 업로드된 파일이므로 사용자는 사용 가능)
      }
    }

    return NextResponse.json({
      url: blob.url,
      mediaId,
      success: true
    });

  } catch (error) {
    // 더 자세한 에러 로깅 (프로덕션에서도 확인 가능)
    logger.error('파일 업로드 에러:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return handleApiError(error, 'upload');
  }
}
