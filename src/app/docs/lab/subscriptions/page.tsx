import Link from "next/link";

export default function SubscriptionsDocs() {
  return (
    <div className="space-y-12">
      <div>
        <h1>구독 관리 시스템</h1>
        <p className="text-lg text-muted-foreground mt-2">
          사용자의 구독 현황을 관리하고 분석하는 도구
        </p>
      </div>

      <div>
        <h2>개요</h2>
        <p className="text-muted-foreground mt-4">
          구독 관리 시스템은 사용자가 자신이 구독 중인 크리에이터들을 한눈에 보고 관리할 수 있는 기능을 제공합니다.
        </p>
      </div>

      <div>
        <h2>주요 기능</h2>
        <ul className="space-y-2 text-muted-foreground mt-4">
          <li>구독 중인 크리에이터 목록</li>
          <li>구독 상태 및 기간 확인</li>
          <li>구독 취소 및 재구독</li>
          <li>결제 내역 조회</li>
          <li>구독 추천 알고리즘</li>
          <li>구독 비용 분석</li>
        </ul>
      </div>

      <div>
        <h2>데모 체험</h2>
        <div className="bg-muted p-6 rounded-lg mt-4">
          <p className="mb-4">구독 관리 시스템을 체험해보세요:</p>
          <Link
            href="/user/subscriptions"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            구독 관리 데모 바로가기 →
          </Link>
        </div>
      </div>

      <div>
        <h2>구독 상태 관리</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">활성 구독</span>
            </div>
            <p className="text-sm text-muted-foreground">
              정상적으로 결제되고 있는 구독
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium">결제 대기</span>
            </div>
            <p className="text-sm text-muted-foreground">
              다음 결제 예정인 구독
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">만료됨</span>
            </div>
            <p className="text-sm text-muted-foreground">
              결제가 실패한 구독
            </p>
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
          <li>이메일: Resend API</li>
          <li>실시간: WebSocket</li>
        </ul>
      </div>

      <div>
        <h2>구독 분석</h2>
        <div className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">💰 월별 구독 비용</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>크리에이터 A</span>
                  <span>₩12,000</span>
                </div>
                <div className="flex justify-between">
                  <span>크리에이터 B</span>
                  <span>₩8,000</span>
                </div>
                <div className="flex justify-between">
                  <span>크리에이터 C</span>
                  <span>₩5,000</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>총계</span>
                  <span>₩25,000</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">📊 구독 통계</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>총 구독 수</span>
                  <span>3개</span>
                </div>
                <div className="flex justify-between">
                  <span>평균 구독 기간</span>
                  <span>8개월</span>
                </div>
                <div className="flex justify-between">
                  <span>이번 달 비용</span>
                  <span>₩25,000</span>
                </div>
                <div className="flex justify-between">
                  <span>저장된 금액</span>
                  <span>₩4,250</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>상태</h2>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">안정 버전 - 운영 중</span>
        </div>
      </div>
    </div>
  );
}
