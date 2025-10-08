import Link from "next/link";

export default function ComponentsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1>컴포넌트</h1>
        <p className="text-lg text-muted-foreground mt-2">
          프로젝트에 사용된 UI 컴포넌트
        </p>
      </div>

      <div>
        <h2>기본 컴포넌트</h2>
        <p className="text-sm text-muted-foreground mb-4">
          shadcn/ui 기반
        </p>
        <div className="space-y-3">
          <Link href="/docs/components/button" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              Button →
            </span>
          </Link>
          <Link href="/docs/components/card" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              Card →
            </span>
          </Link>
          <Link href="/docs/components/input" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              Input →
            </span>
          </Link>
        </div>
      </div>

      <div>
        <h2>커스텀 컴포넌트</h2>
        <div className="space-y-3 mt-4">
          <Link href="/docs/components/user-avatar" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              UserAvatar →
            </span>
          </Link>
          <Link href="/docs/components/user-card" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              UserCard →
            </span>
          </Link>
          <Link href="/docs/components/studio-badge" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              StudioBadge →
            </span>
          </Link>
          <Link href="/docs/components/skill-badge" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              SkillBadge →
            </span>
          </Link>
          <Link href="/docs/components/follow-button" className="block group">
            <span className="text-base font-medium group-hover:text-primary transition-colors">
              FollowButton →
            </span>
          </Link>
        </div>
      </div>

      <div>
        <h2>사용법</h2>
        <pre className="p-4 bg-gray-900 text-gray-100 text-sm rounded-lg overflow-x-auto mt-4">
          <code>{`import { Button } from "@/components/ui/button";

<Button>Click me</Button>`}</code>
        </pre>
      </div>
    </div>
  );
}

