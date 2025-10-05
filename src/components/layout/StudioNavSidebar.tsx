"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  Calendar, 
  StickyNote, 
  Edit3, 
  Settings,
  Users,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Logo from "@/assets/logo.png";

interface StudioNavSidebarProps {
  studioId: string;
  studioName: string;
  isOwner: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default function StudioNavSidebar({ 
  studioId, 
  studioName,
  isOwner,
  activeTab = "posts",
  onTabChange
}: StudioNavSidebarProps) {
  const pathname = usePathname();
  const isWritePage = pathname?.includes('/write');

  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <>
      {/* 스튜디오 전용 로고 헤더 */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Image src={Logo} alt="Divetobada" width={32} height={32} />
          <span className="font-bold text-xl">Divetobada</span>
        </Link>
      </div>

      <div className="space-y-4 p-4">
        {/* 스튜디오 제목 */}
        <div className="px-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            STUDIO
          </h3>
          <p className="text-base font-bold truncate">{studioName}</p>
        </div>

        <Separator />

        {/* 네비게이션 메뉴 */}
        <nav className="space-y-1">
          <NavItem
            icon={FileText}
            label="포스트"
            active={activeTab === "posts" && !isWritePage}
            onClick={() => handleTabClick("posts")}
          />
          <NavItem
            icon={Calendar}
            label="캘린더"
            active={activeTab === "calendar"}
            onClick={() => handleTabClick("calendar")}
          />
          <NavItem
            icon={StickyNote}
            label="메모"
            active={activeTab === "notes"}
            onClick={() => handleTabClick("notes")}
          />
        </nav>

        {/* 소유자 전용 메뉴 */}
        {isOwner && (
          <>
            <Separator />
            <div className="space-y-1">
              <Link href={`/studios/${studioId}/write`}>
                <Button 
                  variant={isWritePage ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  새 글 쓰기
                </Button>
              </Link>
              <NavItem
                icon={Users}
                label="멤버 관리"
                onClick={() => {
                  const event = new CustomEvent('openMembersDialog');
                  window.dispatchEvent(event);
                }}
              />
              <NavItem
                icon={Settings}
                label="설정"
                onClick={() => {
                  const event = new CustomEvent('openSettingsDialog');
                  window.dispatchEvent(event);
                }}
              />
            </div>
          </>
        )}

        <Separator />

        {/* 홈으로 돌아가기 */}
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Home className="h-4 w-4 mr-2" />
            홈으로
          </Button>
        </Link>
      </div>
    </>
  );
}
