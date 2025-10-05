import { NextRequest, NextResponse } from "next/server";

/**
 * Login with Divetobada 버튼 HTML 반환
 * 검정 배경 + Bada 로고
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirect = searchParams.get('redirect') || 'https://vessel.today/sso';
  const service = searchParams.get('service') || 'external';
  const theme = searchParams.get('theme') || 'light';
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://divetobada.com';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
      padding: 12px;
      background: transparent;
    }
    .bada-login-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 44px;
      background: #000000;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      white-space: nowrap;
      outline: none;
    }
    .bada-login-btn:hover {
      background: #1a1a1a;
      transform: scale(1.02);
    }
    .bada-login-btn:active {
      transform: scale(0.98);
    }
    .bada-login-btn:focus-visible {
      outline: 2px solid #00DD89;
      outline-offset: 2px;
    }
    .logo-container {
      position: relative;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <button class="bada-login-btn" onclick="handleLogin()">
    <div class="logo-container">
      <img 
        src="${baseUrl}/_next/static/media/logo.21df6df2.png" 
        alt="Divetobada" 
        class="logo"
      />
    </div>
    Login with Divetobada
  </button>

  <script>
    function handleLogin() {
      const loginUrl = '${baseUrl}/auth/sso?service=${service}&redirect=${encodeURIComponent(redirect)}';
      
      if (window.parent !== window) {
        // iframe 내부
        window.parent.location.href = loginUrl;
      } else {
        // 직접 접근
        window.location.href = loginUrl;
      }
    }
  </script>
</body>
</html>
  `.trim();

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // X-Frame-Options 제거 - 다른 origin(Vessel)에서도 iframe 허용
    },
  });
}
