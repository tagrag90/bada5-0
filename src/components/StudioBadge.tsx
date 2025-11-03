"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface StudioBadgeProps {
  studioId: string;
  studioName: string;
  studioAvatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  showLink?: boolean;
}

export default function StudioBadge({ 
  studioId,
  studioName, 
  studioAvatarUrl,
  size = "sm",
  showLink = true,
}: StudioBadgeProps) {
  // 필수 props 검증
  if (!studioId || !studioName) {
    console.warn("StudioBadge: studioId and studioName are required");
    return null;
  }

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2", 
    lg: "text-lg px-5 py-2.5"
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  const badgeContent = (
    <Badge 
      variant="secondary" 
      className={`bg-gray-100 text-gray-700 border-2 border-transparent ${sizeClasses[size]} font-semibold rounded-md inline-flex items-center gap-1.5 hover:bg-gray-200 hover:border-black hover:shadow-lg hover:shadow-black/10 transition-all duration-200 w-fit ${showLink ? 'cursor-pointer' : ''}`}
    >
      {studioAvatarUrl && (
        <Image
          src={studioAvatarUrl}
          alt={`${studioName} avatar`}
          width={iconSize[size]}
          height={iconSize[size]}
          className="flex-shrink-0 rounded-full"
        />
      )}
      <span>{studioName}</span>
    </Badge>
  );

  if (showLink) {
    return (
      <Link href={`/studios/${studioId}`}>
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
