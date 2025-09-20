"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, ArrowLeft, CreditCard, Shield, Lock } from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";

// 모의 데이터 - 실제로는 API에서 가져올 것
const mockCreator = {
  id: "creator1",
  username: "artist_jun",
  displayName: "준 아티스트",
  avatarUrl: "/avatars/default-1.png",
  bio: "디지털 아트와 일러스트레이션을 전문으로 하는 크리에이터입니다.",
  subscriberCount: 1250,
};

const mockTiers = [
  {
    id: "tier1",
    name: "브론즈",
    price: 4900,
    description: "기본 콘텐츠 접근",
    benefits: [
      "✓ 월 2회 독점 포스트",
      "✓ 커뮤니티 참여",
      "✓ 작품 프로세스 보기",
    ],
    subscriberCount: 450,
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "tier2",
    name: "실버",
    price: 9900,
    description: "고급 콘텐츠 접근",
    benefits: [
      "✓ 브론즈 티어 모든 혜택",
      "✓ 월 4회 독점 포스트",
      "✓ 라이브 스트리밍 참여",
      "✓ 작품 PSD 파일 제공",
      "✓ 1:1 메시지 상담",
    ],
    subscriberCount: 320,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    recommended: true,
  },
  {
    id: "tier3",
    name: "골드",
    price: 19900,
    description: "VIP 전용 콘텐츠",
    benefits: [
      "✓ 실버 티어 모든 혜택",
      "✓ 무제한 독점 콘텐츠",
      "✓ 독점 굿즈 제작 참여",
      "✓ 우선 응대 및 피드백",
      "✓ 작품 NFT 에어드랍",
      "✓ 오프라인 이벤트 초대",
    ],
    subscriberCount: 85,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
];

export default function MembershipPaymentPage() {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedTier) return;

    setIsProcessing(true);
    // 실제로는 Stripe 결제 처리
    setTimeout(() => {
      alert("결제 기능은 추후 구현 예정입니다.");
      setIsProcessing(false);
    }, 2000);
  };

  const selectedTierData = mockTiers.find(tier => tier.id === selectedTier);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/users/${creatorId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <UserAvatar
                avatarUrl={mockCreator.avatarUrl}
                userId={mockCreator.id}
                size={40}
              />
              <div>
                <h1 className="text-xl font-bold">{mockCreator.displayName}의 멤버십</h1>
                <p className="text-sm text-muted-foreground">
                  {mockCreator.subscriberCount.toLocaleString()}명의 구독자
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 티어 선택 영역 */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">멤버십 티어 선택</h2>
              <p className="text-muted-foreground">
                {mockCreator.displayName}님의 독점 콘텐츠에 접근하고 특별한 혜택을 누려보세요
              </p>
            </div>

            <div className="grid gap-4">
              {mockTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTier === tier.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tier.color}`}>
                          <Crown className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{tier.name}</CardTitle>
                            {tier.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                추천
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{tier.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₩{tier.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">/월</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        {tier.subscriberCount}명의 구독자가 선택했어요
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 결제 요약 및 처리 영역 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTierData ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>선택된 티어</span>
                        <span className="font-medium">{selectedTierData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>월 구독료</span>
                        <span className="font-medium">₩{selectedTierData.price.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>총 결제금액</span>
                        <span>₩{selectedTierData.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full"
                        size="lg"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            결제 처리 중...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            ₩{selectedTierData.price.toLocaleString()} 결제하기
                          </>
                        )}
                      </Button>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>SSL 암호화로 안전하게 결제됩니다</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>멤버십 티어를 선택해주세요</p>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <h4 className="font-medium text-sm">결제 혜택</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• 언제든지 구독 취소 가능</li>
                    <li>• 첫 달 무료 체험 가능</li>
                    <li>• 환불 정책 적용</li>
                    <li>• 24시간 고객 지원</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

