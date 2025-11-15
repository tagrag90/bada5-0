"use client";

import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SocialLinks from "@/components/SocialLinks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptionalUser } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Calendar, StickyNote, Users, Settings, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socialLinks?: string[];
  _count: {
    members: number;
    events: number;
  };
  subscribersCount: number;
}

interface StudioProfileCardProps {
  studio?: Studio;
  studioName: string;
  studioId: string;
  isOwner?: boolean;
  isAdmin?: boolean;
  selectedTab?: string;
  onTabSelect?: (tab: string) => void;
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}

function NavItem({ icon: Icon, active, onClick, title }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center justify-center p-2 rounded-lg transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export default function StudioProfileCard({
  studio,
  studioName,
  studioId,
  isOwner = false,
  isAdmin = false,
  selectedTab,
  onTabSelect,
}: StudioProfileCardProps) {
  const currentUser = useOptionalUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  // 멤버십/구독 상태 확인
  const { data: membershipStatus } = useQuery({
    queryKey: ["studio-membership", studio?.id],
    queryFn: async () => {
      if (!studio?.id || !currentUser) return null;
      const res = await fetch(`/api/studios/${studio.id}/subscription-status`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!studio?.id && !!currentUser,
  });

  // 구독 뮤테이션
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/studios/${studio?.id}/subscribe`, {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "구독 완료",
        description: "스튜디오를 구독했습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["studio-subscription", studio?.id] });
      queryClient.invalidateQueries({ queryKey: ["studio", studio?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "구독 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 구독 취소 뮤테이션
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/studios/${studio?.id}/subscribe`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "구독 취소",
        description: "스튜디오 구독을 취소했습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["studio-subscription", studio?.id] });
      queryClient.invalidateQueries({ queryKey: ["studio", studio?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "구독 취소 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTabSelect = (tab: string) => {
    if (onTabSelect) {
      onTabSelect(tab);
    } else {
      // 기본 라우팅 동작
      if (tab === "workspace") {
        router.push(`/studios/${studioId}/workspace`);
      } else {
        router.push(`/studios/${studioId}?tab=${tab}`);
      }
    }
  };

  return (
    <div
      className="w-full max-w-md md:max-w-xl bg-card shadow-sm mb-4 mx-auto overflow-hidden"
      style={{ borderRadius: '1.5rem' }}
    >
      {/* 배너 영역 */}
      {studio?.bannerUrl && (
        <div className="relative w-full h-32 overflow-hidden">
          <Image
            src={studio.bannerUrl}
            alt={`${studio.name} banner`}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* 프로필 헤더 */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">{studioName}</h2>
            <div className="text-muted-foreground">
              @{studio?.slug || studioName.toLowerCase().replace(/\s+/g, '')}
            </div>
            {studio?.description && (
              <div className="mt-2 overflow-hidden whitespace-pre-line break-words text-sm">
                {studio.description}
              </div>
            )}
          </div>
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white">
            {studio?.avatarUrl ? (
              <Image
                key={studio.avatarUrl}
                src={studio.avatarUrl}
                alt={studioName}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
                {studioName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* 통계 */}
        {studio && (
          <div className="flex items-center gap-8 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">
                {formatNumber(studio._count.members)}
              </span>
              <span className="text-muted-foreground">멤버</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">
                {formatNumber(studio.subscribersCount)}
              </span>
              <span className="text-muted-foreground">팔로워</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">
                {formatNumber(studio._count.events)}
              </span>
              <span className="text-muted-foreground">이벤트</span>
            </div>
          </div>
        )}

        {/* 소셜 링크 */}
        {studio?.socialLinks && studio.socialLinks.length > 0 && (
          <div>
            <SocialLinks links={studio.socialLinks} />
          </div>
        )}

        {/* 네비게이션 메뉴 - 수평 배열, 아이콘만 */}
        <nav className="flex items-center gap-2 pt-2">
          <NavItem
            icon={Network}
            active={selectedTab === "workspace"}
            onClick={() => handleTabSelect("workspace")}
            title="워크스페이스"
          />
          <NavItem
            icon={FileText}
            active={selectedTab === "posts"}
            onClick={() => handleTabSelect("posts")}
            title="포스트"
          />
          <NavItem
            icon={Calendar}
            active={selectedTab === "calendar"}
            onClick={() => handleTabSelect("calendar")}
            title="캘린더"
          />
          <NavItem
            icon={StickyNote}
            active={selectedTab === "notes"}
            onClick={() => handleTabSelect("notes")}
            title="메모"
          />
        </nav>

        {/* 액션 버튼들 */}
        {currentUser && !isOwner && (
          <>
            <Separator />
            <div className="space-y-2">
              {membershipStatus?.isMember ? (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    {membershipStatus.memberRole === 'ADMIN' ? '관리자' : '멤버'}
                  </span>
                </div>
              ) : (
                <Button
                  className={`w-full ${
                    membershipStatus?.isSubscribed
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  size="sm"
                  onClick={() => {
                    if (membershipStatus?.isSubscribed) {
                      unsubscribeMutation.mutate();
                    } else {
                      subscribeMutation.mutate();
                    }
                  }}
                  disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                >
                  {subscribeMutation.isPending || unsubscribeMutation.isPending
                    ? "처리 중..."
                    : membershipStatus?.isSubscribed
                    ? "구독 중"
                    : "구독하기"}
                </Button>
              )}
            </div>
          </>
        )}

        {/* 관리자 전용 버튼들 - 박스 버튼만 */}
        {isAdmin && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                size="sm"
                asChild
              >
                <Link href={`/studios/${studioId}/settings`}>
                  스튜디오 설정
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

