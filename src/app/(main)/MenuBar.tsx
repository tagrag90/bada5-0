import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { MenuBarClient } from "./MenuBarClient";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });
  
  // 메시지 기능이 제거되었으므로 0으로 설정
  const unreadMessagesCount = 0;

  return (
    <MenuBarClient 
      className={className}
      unreadNotificationsCount={unreadNotificationsCount}
      unreadMessagesCount={unreadMessagesCount}
    />
  );
}
