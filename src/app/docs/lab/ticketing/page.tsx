import Link from "next/link";

export default function TicketingDocs() {
  return (
    <div className="space-y-12">
      <div>
        <h1>티켓팅 시스템</h1>
        <p className="text-lg text-muted-foreground mt-2">
          이벤트 티켓 발급 및 관리 시스템 데모
        </p>
      </div>

      <div>
        <h2>개요</h2>
        <p className="text-muted-foreground mt-4">
          티켓팅 시스템은 이벤트 주최자가 티켓을 발급하고 참가자들이 티켓을 구매할 수 있는 기능을 제공합니다.
        </p>
      </div>

      <div>
        <h2>주요 기능</h2>
        <ul className="space-y-2 text-muted-foreground mt-4">
          <li>이벤트 티켓 생성 및 관리</li>
          <li>티켓 구매 및 결제 처리</li>
          <li>참석자 명단 관리</li>
          <li>QR 코드 기반 입장 확인</li>
          <li>실시간 티켓 판매 현황</li>
        </ul>
      </div>

      <div>
        <h2>데모 체험</h2>
        <div className="bg-muted p-6 rounded-lg mt-4">
          <p className="mb-4">실제 티켓팅 시스템을 체험해보세요:</p>
          <Link
            href="/ticketing-demo"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            티켓팅 데모 바로가기 →
          </Link>
        </div>
      </div>

      <div>
        <h2>기술 스택</h2>
        <ul className="space-y-2 text-muted-foreground mt-4">
          <li>프론트엔드: Next.js, React</li>
          <li>백엔드: Node.js, Prisma</li>
          <li>데이터베이스: PostgreSQL</li>
          <li>결제: Stripe API</li>
          <li>QR 코드: QRCode 라이브러리</li>
        </ul>
      </div>

      <div>
        <h2>상태</h2>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-muted-foreground">베타 버전 - 개발 중</span>
        </div>
      </div>
    </div>
  );
}
