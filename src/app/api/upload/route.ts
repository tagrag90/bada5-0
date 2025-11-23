import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

// Vercel 함수 타임아웃 설정 (최대 60초)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formDataError) {
      logger.error('FormData 파싱 실패:', {
        error: formDataError instanceof Error ? formDataError.message : String(formDataError),
      });
      return NextResponse.json({
        error: '요청 파싱 실패',
        message: '파일 데이터를 읽을 수 없습니다.',
      }, { status: 400 });
    }

    const file = formData.get('file') as File;
    const uploadType = (formData.get('type') as 'media' | 'avatar' | 'studio-avatar' | 'studio-banner') || 'media'; // media, avatar, studio-avatar, studio-banner

    if (!file) {
      return NextResponse.json({ 
        error: 'No file provided',
        message: '파일이 제공되지 않았습니다.',
      }, { status: 400 });
    }

    // 콘솔에 상세 정보 출력 (Vercel 로그 대신 사용)
    console.log('[업로드 API] 파일 업로드 시도:', {
      uploadType,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      nodeEnv: process.env.NODE_ENV,
    });
    
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

    // Vercel Blob 토큰 확인
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      const errorMsg = 'BLOB_READ_WRITE_TOKEN 환경 변수가 설정되지 않았습니다.';
      console.error('[업로드 API]', errorMsg);
      return NextResponse.json({
        error: '스토리지 설정 오류',
        message: '파일 스토리지 서비스가 설정되지 않았습니다.',
        details: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      }, { status: 500 });
    }

    // Vercel Blob에 파일 업로드 (고유한 파일명 생성)
    let blob;
    try {
      console.log('[업로드 API] Vercel Blob 업로드 시작:', {
        fileName: file.name,
        fileSize: file.size,
        hasToken: !!blobToken,
        tokenLength: blobToken.length,
      });

      blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true, // 같은 이름 파일 충돌 방지
      });
      
      console.log('[업로드 API] Vercel Blob 업로드 성공:', blob.url);
      logger.info(`Vercel Blob 업로드 성공 [${uploadType}]:`, blob.url);
    } catch (blobError) {
      // 배포 환경에서 발생할 수 있는 에러 상세 로깅
      const errorMessage = blobError instanceof Error ? blobError.message : String(blobError);
      const errorStack = blobError instanceof Error ? blobError.stack : undefined;
      const errorName = blobError instanceof Error ? blobError.name : undefined;
      
      // 콘솔에 상세 에러 출력 (Vercel 로그 대신 사용)
      console.error('[업로드 API] Vercel Blob 업로드 실패:', {
        error: errorMessage,
        name: errorName,
        stack: errorStack,
        hasToken: !!blobToken,
        tokenLength: blobToken?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadType,
      });
      
      logger.error('Vercel Blob 업로드 실패:', {
        error: errorMessage,
        stack: errorStack,
        hasToken: !!blobToken,
        nodeEnv: process.env.NODE_ENV,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      
      // 토큰 관련 에러인지 확인
      const lowerErrorMessage = errorMessage.toLowerCase();
      if (lowerErrorMessage.includes('token') || 
          lowerErrorMessage.includes('unauthorized') || 
          lowerErrorMessage.includes('authentication') ||
          lowerErrorMessage.includes('forbidden') ||
          lowerErrorMessage.includes('401') ||
          lowerErrorMessage.includes('403')) {
        return NextResponse.json({
          error: '파일 업로드 인증 오류',
          message: '스토리지 서비스 인증에 실패했습니다. 환경 변수를 확인해주세요.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        }, { status: 500 });
      }
      
      return NextResponse.json({
        error: '파일 업로드 실패',
        message: errorMessage || '알 수 없는 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      }, { status: 500 });
    }

    // Blob 업로드 성공 시 URL 반환
    // Media 레코드는 게시물 생성 시 별도로 생성됨 (Prisma 의존성 제거)
    return NextResponse.json({
      url: blob.url,
      success: true
    });

  } catch (error) {
    // 더 자세한 에러 로깅 (프로덕션에서도 확인 가능)
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : undefined;
    
    // 콘솔에 상세 에러 출력 (Vercel 로그 대신 사용)
    console.error('[업로드 API] 전체 에러:', {
      error: errorMessage,
      name: errorName,
      stack: errorStack,
      nodeEnv: process.env.NODE_ENV,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    logger.error('파일 업로드 에러:', {
      error: errorMessage,
      stack: errorStack,
      name: errorName,
    });
    
    // 클라이언트에 더 자세한 에러 정보 제공 (프로덕션에서도 메시지는 전달)
    const responseMessage = errorMessage || '알 수 없는 오류가 발생했습니다.';
    
    return NextResponse.json({
      error: '파일 업로드 실패',
      message: responseMessage,
      errorType: errorName,
      // 프로덕션에서도 기본 에러 메시지는 전달 (스택은 제외)
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
