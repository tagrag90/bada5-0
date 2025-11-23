import { handleApiError } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

// 마이그레이션 없이 메모리에 푸시 토큰 저장 (임시 방법)
declare global {
  var globalPushTokens: Map<string, { platform: string, userId?: string, createdAt: Date }>;
}

if (!global.globalPushTokens) {
  global.globalPushTokens = new Map();
}

export async function POST(request: NextRequest) {
    try {
        const { deviceToken, platform, userId } = await request.json();
        
        logger.debug('Push token registration request:', {
            deviceToken: deviceToken ? deviceToken.substring(0, 20) + '...' : 'null',
            platform,
            userId,
            timestamp: new Date().toISOString()
        });
        
        if (!deviceToken || !platform) {
            logger.warn('Missing required fields:', { deviceToken: !!deviceToken, platform: !!platform });
            return NextResponse.json(
                { error: 'deviceToken and platform are required' }, 
                { status: 400 }
            );
        }
        
        logger.debug(`Registering push token: ${deviceToken.substring(0, 20)}... for platform: ${platform}, userId: ${userId}`);
        
        // 기존 토큰 확인
        const existingToken = global.globalPushTokens.get(deviceToken);
        if (existingToken) {
            logger.debug('Token already exists, updating:', existingToken);
        }
        
        // 메모리에 토큰 저장 (서버 재시작 시 초기화됨)
        global.globalPushTokens.set(deviceToken, {
            platform,
            userId,
            createdAt: new Date()
        });
        
        logger.debug('Push token registered successfully in memory');
        logger.debug(`Total tokens after registration: ${global.globalPushTokens.size}`);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Token registered in memory (temporary storage)',
            totalTokens: global.globalPushTokens.size
        });
        
    } catch (error) {
        return handleApiError(error);
    }
}

// 토큰 목록 조회 (개발용)
export async function GET() {
    const tokenList = Array.from(global.globalPushTokens.entries()).map(([token, data]) => ({
        deviceToken: token.substring(0, 20) + '...', // 보안상 일부만 표시
        platform: data.platform,
        createdAt: data.createdAt
    }));
    
    return NextResponse.json({
        totalTokens: global.globalPushTokens.size,
        tokens: tokenList
    });
}
