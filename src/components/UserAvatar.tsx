import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn, getDefaultAvatar } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  userId?: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  userId,
  size,
  className,
}: UserAvatarProps) {
  // 아바타 URL 결정: 사용자 지정 이미지 -> 랜덤 기본 이미지 -> 기본 플레이스홀더
  const displayAvatar = avatarUrl ||
    (userId ? getDefaultAvatar(userId) : avatarPlaceholder);

  return (
    <Image
      src={displayAvatar}
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
