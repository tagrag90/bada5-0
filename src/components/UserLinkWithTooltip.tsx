"use client";

import { useOptionalUser } from "@/app/(main)/SessionProvider";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { useToast } from "./ui/use-toast";
import UserTooltip from "./UserTooltip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const user = useOptionalUser();
  const isLoggedIn = !!user;
  const router = useRouter();
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast({
        title: "로그인이 필요합니다",
        description: "프로필을 보려면 로그인이 필요합니다.",
        duration: 3000,
      });
      router.push("/login");
    }
  };

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
        onClick={handleProfileClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
        onClick={handleProfileClick}
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
