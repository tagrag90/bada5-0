"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Settings as SettingsIcon,
  Users,
  ChevronRight,
} from "lucide-react";

interface StudioSettingsNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StudioSettingsSidebarProps {
  studioId: string;
  className?: string;
}

const studioSettingsNavItems: StudioSettingsNavItem[] = [
  { href: "/studios/[studioId]/settings", label: "기본 설정", icon: SettingsIcon },
  // 향후 추가 가능: 멤버 관리 등
];

export default function StudioSettingsSidebar({ studioId, className }: StudioSettingsSidebarProps) {
  const pathname = usePathname();

  const navItems = studioSettingsNavItems.map(item => ({
    ...item,
    href: item.href.replace('[studioId]', studioId),
  }));

  return (
    <div className={cn("flex flex-col h-full bg-gray-50", className)}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">스튜디오 설정</h2>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href.includes("/settings") && pathname?.includes("/settings"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-blue-700" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

