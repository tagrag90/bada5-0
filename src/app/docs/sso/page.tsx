export default function SSOPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>SSO 통합</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Login with Divetobada
        </p>
      </div>

      <div>
        <h2>작동 방식</h2>
        <ol className="space-y-2 mt-4">
          <li>외부 서비스에서 버튼 클릭</li>
          <li>Divetobada 로그인 페이지로 이동</li>
          <li>로그인 성공 시 JWT 토큰 생성 (5분 유효)</li>
          <li>외부 서비스로 리다이렉트 및 자동 로그인</li>
        </ol>
      </div>

      <div>
        <h2>iframe 위젯</h2>
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto mt-4">
          <code>{`<iframe 
  src="https://divetobada.com/api/widget/login-button?redirect=YOUR_SSO_URL&service=YOUR_SERVICE"
  width="320" 
  height="60"
></iframe>`}</code>
        </pre>
      </div>

      <div>
        <h2>백엔드 구현</h2>
        <p className="text-muted-foreground mb-4">
          SSO 토큰을 검증하고 사용자를 생성하세요.
        </p>

        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto">
          <code>{`// Express 예시
app.post("/sso/divetobada", async (req, res) => {
  const { token } = req.body;
  
  // JWT 검증 (SHARED_SSO_SECRET 필요)
  const decoded = jwt.verify(token, SHARED_SSO_SECRET);
  
  // 이메일로 계정 찾기 또는 생성
  let user = await User.findOne({ email: decoded.email });
  if (!user) {
    user = await createUser({
      email: decoded.email,
      displayName: decoded.displayName,
      username: decoded.username
    });
  }
  
  // 세션 생성 후 토큰 반환
  return res.json({ 
    access_token: generateToken(user) 
  });
});`}</code>
        </pre>
      </div>

      <div>
        <h2>사용 사례</h2>
        <p className="mt-2">
          Vessel (
          <a href="https://www.vessel.today" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            vessel.today
          </a>
          )에서 작동 중
        </p>
      </div>

      <div>
        <h2>문의</h2>
        <p className="mt-2">
          <a href="mailto:teambada1206@gmail.com" className="text-primary underline">
            teambada1206@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

