"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucia";

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const DOCS_NAV: NavItem[] = [
  {
    title: "시작하기",
    href: "/docs/getting-started"
  },
  {
    title: "컴포넌트",
    items: [
      { title: "개요", href: "/docs/components" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Input", href: "/docs/components/input" },
      { title: "UserAvatar", href: "/docs/components/user-avatar" },
      { title: "UserCard", href: "/docs/components/user-card" },
      { title: "StudioBadge", href: "/docs/components/studio-badge" },
      { title: "SkillBadge", href: "/docs/components/skill-badge" },
      { title: "FollowButton", href: "/docs/components/follow-button" },
    ]
  },
  {
    title: "브랜드",
    items: [
      { title: "개요", href: "/docs/brand" },
      { title: "로고", href: "/docs/brand/logo" },
      { title: "색상", href: "/docs/brand/colors" },
      { title: "타이포그래피", href: "/docs/brand/typography" },
      { title: "이미지 사이즈", href: "/docs/brand/image-sizes" },
      { title: "소셜 미디어", href: "/docs/brand/social" },
      { title: "브랜드 자산", href: "/docs/brand/assets" },
    ]
  },
  {
    title: "스튜디오",
    href: "/docs/studio"
  },
  {
    title: "SSO 통합",
    href: "/docs/sso"
  },
  {
    title: "피드백",
    href: "/docs/feedback"
  }
];

interface DocsSidebarProps {
  user: User | null;
}

export default function DocsSidebar({ user }: DocsSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(["컴포넌트", "브랜드"]);

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className="docs-sidebar">
      {/* 로고 및 액션 */}
      <div className="p-4 border-b">
        <Link href="/docs" className="flex items-center gap-2 mb-4">
          <Image src={Logo} alt="Dive to Bada" width={32} height={32} />
          <span className="font-bold text-lg">Docs</span>
        </Link>
        
        <div className="flex flex-col gap-2">
          {user ? (
            <Link href="/" className="w-full">
              <Button variant="outline" size="sm" className="w-full justify-center">
                메인으로
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="w-full">
              <Button size="sm" className="w-full justify-center">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {DOCS_NAV.map((section) => (
          <div key={section.title}>
            {section.href ? (
              <Link
                href={section.href}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-semibold rounded-lg transition-colors",
                  pathname === section.href
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50"
                )}
              >
                {section.title}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  {section.title}
                  <span className="text-xs">
                    {openSections.includes(section.title) ? "▼" : "▶"}
                  </span>
                </button>
                {openSections.includes(section.title) && section.items && (
                  <div className="ml-3 mt-1 space-y-1 pl-3">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href!}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}