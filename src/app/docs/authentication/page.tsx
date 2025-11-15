export default function AuthenticationPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>인증 시스템</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Lucia Auth 기반의 인증 시스템
        </p>
      </div>

      <div>
        <h2>인증 방법</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">이메일/비밀번호</h3>
            <p className="text-sm text-muted-foreground mb-2">전통적인 이메일과 비밀번호를 사용한 인증</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Argon2 해싱</li>
              <li>• 세션 쿠키 관리</li>
              <li>• 자동 로그인 유지</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Google OAuth</h3>
            <p className="text-sm text-muted-foreground mb-2">Google 계정을 통한 간편 로그인</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• PKCE 보안</li>
              <li>• 자동 계정 생성</li>
              <li>• TestFlight 지원</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2>세션 관리</h2>
        <p className="text-muted-foreground mt-2">
          Lucia를 통한 서버 사이드 세션 검증 및 쿠키 기반 인증을 사용합니다.
        </p>
        <ul className="space-y-2 mt-4">
          <li>• 서버 사이드 세션 검증</li>
          <li>• 쿠키 기반 인증</li>
          <li>• 자동 만료 관리</li>
        </ul>
      </div>

      <div>
        <h2>SSO 통합</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Login with Divetobada를 통한 외부 서비스 인증. 자세한 내용은 <a href="/docs/sso" className="text-primary underline">SSO 통합</a> 페이지를 참조하세요.
        </p>
      </div>
    </div>
  );
}

