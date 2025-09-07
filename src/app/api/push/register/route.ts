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
        
        if (!deviceToken || !platform) {
            return NextResponse.json(
                { error: 'deviceToken and platform are required' }, 
                { status: 400 }
            );
        }
        
        console.log(`Registering push token: ${deviceToken} for platform: ${platform}`);
        
        // 메모리에 토큰 저장 (서버 재시작 시 초기화됨)
        global.globalPushTokens.set(deviceToken, {
            platform,
            userId,
            createdAt: new Date()
        });
        
        console.log('Push token registered successfully in memory');
        console.log(`Total tokens: ${global.globalPushTokens.size}`);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Token registered in memory (temporary storage)' 
        });
        
    } catch (error) {
        console.error('Failed to register push token:', error);
        return NextResponse.json(
            { error: 'Failed to register token' }, 
            { status: 500 }
        );
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
