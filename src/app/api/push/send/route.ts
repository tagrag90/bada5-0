import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { APNS_CONFIG, JWT_CONFIG } from '@/lib/apns-config';

// 메모리에 저장된 푸시 토큰 (기존 register API와 공유)
const pushTokens = new Map<string, { platform: string, userId?: string, createdAt: Date }>();

// 기존 register API에서 사용하는 토큰들 가져오기
declare global {
  var globalPushTokens: Map<string, { platform: string, userId?: string, createdAt: Date }>;
}

if (!global.globalPushTokens) {
  global.globalPushTokens = new Map();
}

// JWT 토큰 생성 함수
function createJWTToken(): string {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    iss: APNS_CONFIG.teamId,
    iat: now,
    exp: now + (60 * 60), // 1시간 후 만료
  };

  // 실제 환경에서는 .p8 파일을 읽어야 함
  const privateKey = process.env.APNS_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgKVm039dk/+Q9Pymw
z/uNcDPK7VGskQp4jowh0m3vzmCgCgYIKoZIzj0DAQehRANCAAQKuvD+SyAffzxC
d9bT4N1rstTXUwk8nxM12TkTXlx9T4neRvvt062N9rCjSpmqfUqjJBtJPRisMhGv
jlDNucv5
-----END PRIVATE KEY-----`;

  return jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    keyid: APNS_CONFIG.keyId,
  });
}

// APNs 푸시 알림 발송 함수
async function sendAPNSNotification(deviceToken: string, payload: any): Promise<boolean> {
  try {
    const jwtToken = createJWTToken();
    
    const apnsPayload = {
      aps: {
        alert: {
          title: payload.title,
          body: payload.body,
        },
        badge: payload.badge || 1,
        sound: payload.sound || 'default',
        'content-available': 1,
      },
      // 커스텀 데이터
      data: payload.data || {},
    };

    const response = await fetch(
      `https://${APNS_CONFIG.server}/3/device/${deviceToken}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'apns-topic': APNS_CONFIG.bundleId,
          'apns-push-type': 'alert',
          'apns-priority': '10',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apnsPayload),
      }
    );

    if (response.ok) {
      console.log(`Push notification sent successfully to ${deviceToken.substring(0, 20)}...`);
      return true;
    } else {
      const error = await response.text();
      console.error(`APNs error: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    console.error('Failed to send APNs notification:', error);
    return false;
  }
}

// 푸시 알림 발송 API
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      body, 
      badge = 1, 
      sound = 'default',
      data = {},
      userIds = [], // 특정 사용자들에게만 발송
      sendToAll = false // 모든 사용자에게 발송
    } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: 'title and body are required' },
        { status: 400 }
      );
    }

    const payload = { title, body, badge, sound, data };
    const results: { deviceToken: string, success: boolean }[] = [];
    
    // 발송할 토큰들 필터링 (global 토큰 사용)
    const tokensToSend = Array.from(global.globalPushTokens.entries()).filter(([token, tokenData]) => {
      if (sendToAll) return true;
      if (userIds.length > 0 && tokenData.userId) {
        return userIds.includes(tokenData.userId);
      }
      return false;
    });

    console.log(`Sending push notifications to ${tokensToSend.length} devices`);

    // 각 디바이스에 푸시 알림 발송
    for (const [deviceToken, tokenData] of tokensToSend) {
      if (tokenData.platform === 'ios') {
        const success = await sendAPNSNotification(deviceToken, payload);
        results.push({ 
          deviceToken: deviceToken.substring(0, 20) + '...', 
          success 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Push notifications sent: ${successCount} success, ${failureCount} failed`,
      results: results,
      totalDevices: tokensToSend.length
    });

  } catch (error) {
    console.error('Failed to send push notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send push notifications' },
      { status: 500 }
    );
  }
}

// 테스트용 GET 엔드포인트
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const test = searchParams.get('test');
  
  if (test === 'true') {
    // 테스트 푸시 알림 발송
    const testPayload = {
      title: 'Dive to Bada 테스트',
      body: '푸시 알림이 정상적으로 작동합니다! 🎉',
      badge: 1,
      sound: 'default',
      data: { type: 'test' }
    };

    const results = [];
    for (const [deviceToken, tokenData] of global.globalPushTokens.entries()) {
      if (tokenData.platform === 'ios') {
        const success = await sendAPNSNotification(deviceToken, testPayload);
        results.push({ 
          deviceToken: deviceToken.substring(0, 20) + '...', 
          success 
        });
      }
    }

    return NextResponse.json({
      message: 'Test push notification sent',
      results,
      totalTokens: global.globalPushTokens.size
    });
  }

  return NextResponse.json({
    message: 'Push notification send API',
    registeredDevices: global.globalPushTokens.size,
    usage: {
      POST: 'Send push notification',
      'GET?test=true': 'Send test notification'
    }
  });
}
