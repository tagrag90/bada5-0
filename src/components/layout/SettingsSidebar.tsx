"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  Settings as SettingsIcon,
  ChevronRight
} from "lucide-react";

interface SettingsNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsNavItems: SettingsNavItem[] = [
  { href: "/settings/profile", label: "프로필 편집", icon: User },
  { href: "/settings/security", label: "계정 보안", icon: Shield },
  { href: "/settings/notifications", label: "알림 설정", icon: Bell },
  { href: "/settings/devices", label: "기기 관리", icon: Smartphone },
  { href: "/settings/account", label: "계정 관리", icon: SettingsIcon },
];

interface SettingsSidebarProps {
  className?: string;
}

export default function SettingsSidebar({ className }: SettingsSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-gray-50", className)}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">설정</h2>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {settingsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href === "/settings/profile" && pathname === "/settings");

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

