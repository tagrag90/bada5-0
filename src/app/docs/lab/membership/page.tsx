import Link from "next/link";

export default function MembershipDocs() {
  return (
    <div className="space-y-12">
      <div>
        <h1>멤버십 결제 시스템</h1>
        <p className="text-lg text-muted-foreground mt-2">
          크리에이터 구독 및 멤버십 결제 시스템 데모
        </p>
      </div>

      <div>
        <h2>개요</h2>
        <p className="text-muted-foreground mt-4">
          멤버십 결제 시스템은 팬들이 크리에이터의 독점 콘텐츠에 접근할 수 있도록 구독 기반 결제 기능을 제공합니다.
        </p>
      </div>

      <div>
        <h2>주요 기능</h2>
        <ul className="space-y-2 text-muted-foreground mt-4">
          <li>크리에이터 멤버십 플랜 생성</li>
          <li>정기 구독 결제 (월간/연간)</li>
          <li>독점 콘텐츠 접근 권한</li>
          <li>멤버 전용 커뮤니티</li>
          <li>수익 분배 및 정산</li>
          <li>구독 관리 및 취소</li>
        </ul>
      </div>

      <div>
        <h2>데모 체험</h2>
        <div className="bg-muted p-6 rounded-lg mt-4">
          <p className="mb-4">멤버십 결제 시스템을 체험해보세요:</p>
          <Link
            href="/membership/payment/artist_jun"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            멤버십 결제 데모 바로가기 →
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">기술 스택</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• 프론트엔드: Next.js, React</li>
          <li>• 백엔드: Node.js, Prisma</li>
          <li>• 데이터베이스: PostgreSQL</li>
          <li>• 결제: Stripe API</li>
          <li>• 웹훅: Stripe Webhooks</li>
          <li>• 이메일: Resend API</li>
        </ul>
      </section>

      <div>
        <h2>멤버십 플랜 예시</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">기본 플랜</h3>
            <p className="text-2xl font-bold mb-2">₩5,000<span className="text-sm font-normal">/월</span></p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>월 2회 독점 포스트</li>
              <li>커뮤니티 참여</li>
              <li>아카이브 접근</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 border-primary">
            <div className="text-xs text-primary font-medium mb-1">인기</div>
            <h3 className="font-semibold mb-2">프리미엄 플랜</h3>
            <p className="text-2xl font-bold mb-2">₩12,000<span className="text-sm font-normal">/월</span></p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>무제한 독점 콘텐츠</li>
              <li>라이브 참여권</li>
              <li>1:1 메시지</li>
              <li>얼리 액세스</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">연간 플랜</h3>
            <p className="text-2xl font-bold mb-2">₩100,000<span className="text-sm font-normal">/년</span></p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>모든 프리미엄 혜택</li>
              <li>연간 구독 할인 (17%)</li>
              <li>특별 이벤트 초대</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2>기술 스택</h2>
        <ul className="space-y-2 text-muted-foreground mt-4">
          <li>프론트엔드: Next.js, React</li>
          <li>백엔드: Node.js, Prisma</li>
          <li>데이터베이스: PostgreSQL</li>
          <li>결제: Stripe API</li>
          <li>웹훅: Stripe Webhooks</li>
          <li>이메일: Resend API</li>
        </ul>
      </div>

      <div>
        <h2>상태</h2>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-muted-foreground">알파 버전 - 프로토타입</span>
        </div>
      </div>
    </div>
  );
}
