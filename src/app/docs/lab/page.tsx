import Link from "next/link";
import { Beaker, Ticket, CreditCard, BarChart3, UserCheck, Sparkles, Layers, Zap } from "lucide-react";

const experiments = [
  {
    name: "티켓팅 시스템",
    description: "이벤트 티켓 발급 및 관리",
    icon: Ticket,
    href: "/docs/lab/ticketing",
    status: "beta",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "멤버십 결제",
    description: "크리에이터 구독 결제 시스템",
    icon: CreditCard,
    href: "/docs/lab/membership",
    status: "alpha",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    name: "크리에이터 대시보드",
    description: "콘텐츠 관리 및 분석 도구",
    icon: BarChart3,
    href: "/docs/lab/dashboard",
    status: "beta",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "구독 관리",
    description: "사용자 구독 현황 관리",
    icon: UserCheck,
    href: "/docs/lab/subscriptions",
    status: "stable",
    statusColor: "bg-green-100 text-green-800",
  },
];

const uiExperiments = [
  {
    name: "Cosmos",
    description: "2D ↔ 3D 전환 가능한 우주 탐험",
    icon: Sparkles,
    href: "/ui-lab/cosmos",
    status: "live",
    statusColor: "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold",
  },
];

export default function LabHome() {
  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Beaker className="h-8 w-8 text-muted-foreground" />
          <h1>실험실</h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          개발 중인 새로운 기능들을 미리 체험하고 피드백을 제공해주세요
        </p>
      </div>

      <div>
        <h2>실험 중인 기능들</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {experiments.map((experiment) => (
            <Link
              key={experiment.name}
              href={experiment.href}
              className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <experiment.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">
                      {experiment.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${experiment.statusColor}`}>
                      {experiment.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {experiment.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2>🌌 Cosmos - 새로운 우주 탐험</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Studio_bada의 새로운 인터페이스입니다. Studio와 User를 행성으로 표현합니다.
        </p>
        <div className="grid gap-4">
          {uiExperiments.map((experiment) => (
            <Link
              key={experiment.name}
              href={experiment.href}
              className="block p-8 border-2 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <experiment.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">
                      {experiment.name}
                    </h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${experiment.statusColor}`}>
                      {experiment.status}
                    </span>
                  </div>
                  <p className="text-base text-muted-foreground">
                    {experiment.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border-2 border-purple-300 dark:border-purple-700">
          <p className="text-sm font-semibold mb-2">
            🌌 <strong>Cosmos</strong>는 실제 데이터와 연결된 라이브 환경입니다!
          </p>
          <p className="text-xs text-muted-foreground">
            Studio와 User를 행성으로 표현한 새로운 탐험 경험을 제공합니다. 2D/3D 전환이 가능합니다.
          </p>
        </div>
      </div>

      <div>
        <h2>실험실 이용 안내</h2>
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🎯 목적</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 새로운 기능 사전 체험</li>
                <li>• 사용자 피드백 수집</li>
                <li>• 제품 개선 방향성 탐색</li>
                <li>• 혁신적인 아이디어 검증</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">⚠️ 주의사항</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 베타 기능은 불안정할 수 있음</li>
                <li>• 데이터 유실 가능성 존재</li>
                <li>• 기능이 변경되거나 제거될 수 있음</li>
                <li>• 피드백은 개발에 큰 도움이 됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>피드백 제공하기</h2>
        <p className="text-muted-foreground mt-4">
          실험실 기능을 사용하시면서 발견한 문제점이나 개선사항이 있으시면 언제든지 알려주세요.
        </p>
        <div className="mt-4">
          <Link
            href="/docs"
            className="inline-flex items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            문서 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
