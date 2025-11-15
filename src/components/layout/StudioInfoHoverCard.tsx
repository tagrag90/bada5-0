"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SocialLinks from "@/components/SocialLinks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOptionalUser } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Calendar, StickyNote, Network } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface StudioInfoHoverCardProps {
  studio?: Studio;
  studioName: string;
  isOwner?: boolean;
  isAdmin?: boolean;
  selectedChannel?: string;
  onChannelSelect?: (channel: string) => void;
}

export default function StudioInfoHoverCard({ 
  studio, 
  studioName, 
  isOwner = false, 
  isAdmin = false,
  selectedChannel = "workspace",
  onChannelSelect,
}: StudioInfoHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const currentUser = useOptionalUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  return (
    <div 
      ref={cardRef}
      className="relative"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white hover:ring-2 hover:ring-gray-400 transition-all cursor-pointer"
      >
        {studio?.avatarUrl ? (
          <Image
            key={studio.avatarUrl}
            src={studio.avatarUrl}
            alt={studioName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">
            {studioName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
      
      {/* 클릭 팝업 */}
      {isOpen && (
        <div className="absolute top-0 left-14 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
        <div className="bg-white">
          {/* 배너 영역 */}
          {studio?.bannerUrl && (
            <div className="relative w-full h-24 overflow-hidden">
              <Image
                src={studio.bannerUrl}
                alt={`${studio.name} banner`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* 프로필 정보 영역 */}
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              {/* 스튜디오 아바타 */}
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white">
                {studio?.avatarUrl ? (
                  <Image
                    key={studio.avatarUrl}
                    src={studio.avatarUrl}
                    alt={studio.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600">
                    {studioName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* 스튜디오 정보 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate text-lg">{studioName}</h3>
                <p className="text-sm text-gray-500 truncate">@{studio?.slug || studioName.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>

            {/* 설명 */}
            {studio?.description && (
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="line-clamp-3">{studio.description}</p>
              </div>
            )}

            {/* 통계 */}
            {studio && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-bold text-lg text-gray-900">{formatNumber(studio._count.members)}</div>
                  <div className="text-xs text-gray-600">멤버</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-bold text-lg text-gray-900">{formatNumber(studio.subscribersCount)}</div>
                  <div className="text-xs text-gray-600">팔로워</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-bold text-lg text-gray-900">{formatNumber(studio._count.events)}</div>
                  <div className="text-xs text-gray-600">이벤트</div>
                </div>
              </div>
            )}

            {/* 소셜 링크 */}
            {studio?.socialLinks && studio.socialLinks.length > 0 && (
              <>
                <Separator />
                <div>
                  <SocialLinks links={studio.socialLinks} />
                </div>
              </>
            )}

            {/* 채널 네비게이션 */}
            {onChannelSelect && (
              <>
                <Separator />
                <nav className="space-y-1">
                  <button
                    onClick={() => onChannelSelect("workspace")}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedChannel === "workspace"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Network className="h-4 w-4" />
                    워크스페이스
                  </button>
                  <button
                    onClick={() => onChannelSelect("posts")}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedChannel === "posts"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    포스트
                  </button>
                  <button
                    onClick={() => onChannelSelect("calendar")}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedChannel === "calendar"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    캘린더
                  </button>
                  <button
                    onClick={() => onChannelSelect("notes")}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedChannel === "notes"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <StickyNote className="h-4 w-4" />
                    메모
                  </button>
                </nav>
              </>
            )}

            {/* 액션 버튼들 */}
            {currentUser && !isOwner && (
              <>
                <Separator />
                <div className="space-y-2">
                  {membershipStatus?.isMember ? (
                    // 멤버인 경우
                    <div className="space-y-2">
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          {membershipStatus.memberRole === 'ADMIN' ? '관리자' : '멤버'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // 멤버가 아닌 경우 (구독 버튼 표시)
                    <>
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
                    </>
                  )}
                </div>
              </>
            )}

            {/* 관리자 전용 버튼들 */}
            {isAdmin && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => {
                      const event = new CustomEvent('openSettingsDialog');
                      window.dispatchEvent(event);
                    }}
                  >
                    스튜디오 설정
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => {
                      const event = new CustomEvent('openMembersDialog');
                      window.dispatchEvent(event);
                    }}
                  >
                    멤버 관리
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

