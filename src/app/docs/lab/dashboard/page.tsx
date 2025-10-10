import Link from "next/link";

export default function DashboardDocs() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">크리에이터 대시보드</h1>
        <p className="text-lg text-muted-foreground mb-6">
          크리에이터를 위한 콘텐츠 관리 및 분석 도구
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">개요</h2>
        <p className="text-muted-foreground">
          크리에이터 대시보드는 콘텐츠 제작자들이 자신의 활동을 효과적으로 관리하고 분석할 수 있는 종합 관리 도구입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">주요 기능</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• 실시간 분석 대시보드</li>
          <li>• 구독자 통계 및 추이</li>
          <li>• 콘텐츠 성과 분석</li>
          <li>• 수익 및 정산 현황</li>
          <li>• 멤버십 관리</li>
          <li>• 콘텐츠 일정 관리</li>
          <li>• 팬 커뮤니케이션 도구</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">데모 체험</h2>
        <div className="bg-muted p-4 rounded-lg">
          <p className="mb-4">크리에이터 대시보드를 체험해보세요:</p>
          <Link
            href="/creator/dashboard/membership"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            대시보드 데모 바로가기 →
          </Link>
        </div>
      </section>

      <div>
        <h2>분석 지표</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="font-semibold">콘텐츠 분석</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>조회수 및 참여율</li>
              <li>인기도 상승 추이</li>
              <li>최적 게시 시간 분석</li>
              <li>해시태그 성과</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">수익 분석</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>구독 수익 현황</li>
              <li>일일/월별 수익 추이</li>
              <li>멤버십 플랜별 성과</li>
              <li>예상 정산 금액</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2>기술 스택</h2>
        <ul className="space-y-2 text-muted-foreground mt-4">
          <li>프론트엔드: Next.js, React, Chart.js</li>
          <li>백엔드: Node.js, Prisma</li>
          <li>데이터베이스: PostgreSQL</li>
          <li>분석: Custom Analytics Engine</li>
          <li>실시간: WebSocket</li>
        </ul>
      </div>

      <div>
        <h2>대시보드 구성</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">📊 분석 탭</h4>
            <p className="text-sm text-muted-foreground">실시간 통계 및 차트</p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">💰 수익 탭</h4>
            <p className="text-sm text-muted-foreground">구독 및 수익 현황</p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">👥 멤버십 탭</h4>
            <p className="text-sm text-muted-foreground">구독자 관리</p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">📅 일정 탭</h4>
            <p className="text-sm text-muted-foreground">콘텐츠 일정 관리</p>
          </div>
        </div>
      </div>

      <div>
        <h2>상태</h2>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-muted-foreground">베타 버전 - 테스트 중</span>
        </div>
      </div>
    </div>
  );
}
