import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface UserAvatarProps {
  user?: {
    avatarUrl?: string | null;
  } | null;
  avatarUrl?: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  user,
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  // user prop이 전달되면 user.avatarUrl을 사용하고, 그렇지 않으면 avatarUrl 사용
  const imageUrl = user?.avatarUrl || avatarUrl || avatarPlaceholder;
  
  return (
    <Image
      src={imageUrl}
      alt="User avatar"
      width={size ?? 34}
      height={size ?? 34}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
