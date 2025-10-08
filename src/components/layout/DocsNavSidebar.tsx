"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";

interface DocsNavSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const navItems = [
  { id: "getting-started", label: "시작하기" },
  { id: "studio", label: "스튜디오 가이드" },
  { id: "features", label: "주요 기능" },
  { id: "services", label: "Team Bada 서비스" },
  { id: "experimental", label: "실험실" },
  { id: "channel", label: "공식 채널" },
  { id: "faq", label: "자주 묻는 질문" },
  { id: "guidelines", label: "커뮤니티 가이드라인" },
  { id: "sso", label: "Login with Divetobada" },
];

export default function DocsNavSidebar({
  activeSection = "getting-started",
  onSectionChange
}: DocsNavSidebarProps) {

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <>
      {/* Docs 전용 로고 헤더 */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Image src={Logo} alt="Divetobada" width={32} height={32} />
          <span className="font-bold text-xl">Docs</span>
        </Link>
      </div>

      <div className="space-y-4 p-4">
        {/* 타이틀 */}
        <div className="px-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            DOCUMENTATION
          </h3>
          <p className="text-base font-bold">목차</p>
        </div>

        <div className="h-px bg-border" />

        {/* 목차 네비게이션 */}
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {index + 1}. {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

