"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  CreditCard,
  Calendar,
  Receipt,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  MessageSquare,
  Heart
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";

// 모의 데이터 - 실제로는 API에서 가져올 것
const mockSubscriptions = [
  {
    id: "sub1",
    creator: {
      id: "creator1",
      username: "artist_jun",
      displayName: "준 아티스트",
      avatarUrl: "/avatars/default-1.png",
    },
    tier: {
      id: "tier2",
      name: "실버",
      price: 9900,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
    status: "active",
    startDate: "2024-08-01",
    nextBillingDate: "2024-10-01",
    totalPaid: 19800,
    autoRenew: true,
  },
  {
    id: "sub2",
    creator: {
      id: "creator2",
      username: "designer_min",
      displayName: "민 디자이너",
      avatarUrl: "/avatars/default-2.png",
    },
    tier: {
      id: "tier1",
      name: "브론즈",
      price: 4900,
      color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    status: "active",
    startDate: "2024-07-15",
    nextBillingDate: "2024-10-15",
    totalPaid: 9800,
    autoRenew: true,
  },
  {
    id: "sub3",
    creator: {
      id: "creator3",
      username: "photographer_lee",
      displayName: "이 포토그래퍼",
      avatarUrl: "/avatars/default-3.png",
    },
    tier: {
      id: "tier3",
      name: "골드",
      price: 19900,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    status: "cancelled",
    startDate: "2024-06-01",
    endDate: "2024-09-01",
    totalPaid: 59700,
    autoRenew: false,
  },
];

const mockPaymentHistory = [
  {
    id: "pay1",
    creatorName: "준 아티스트",
    tierName: "실버",
    amount: 9900,
    date: "2024-09-01",
    status: "completed",
    method: "신용카드",
  },
  {
    id: "pay2",
    creatorName: "민 디자이너",
    tierName: "브론즈",
    amount: 4900,
    date: "2024-09-15",
    status: "completed",
    method: "신용카드",
  },
  {
    id: "pay3",
    creatorName: "이 포토그래퍼",
    tierName: "골드",
    amount: 19900,
    date: "2024-09-01",
    status: "completed",
    method: "신용카드",
  },
  {
    id: "pay4",
    creatorName: "준 아티스트",
    tierName: "실버",
    amount: 9900,
    date: "2024-08-01",
    status: "completed",
    method: "신용카드",
  },
];

export default function UserSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("active");

  const handleCancelSubscription = (subscriptionId: string) => {
    alert(`${subscriptionId} 구독 취소 기능은 추후 구현 예정입니다.`);
  };

  const handleToggleAutoRenew = (subscriptionId: string, autoRenew: boolean) => {
    alert(`${subscriptionId} 자동 갱신 ${autoRenew ? '활성화' : '비활성화'} 기능은 추후 구현 예정입니다.`);
  };

  const handleDownloadReceipt = (paymentId: string) => {
    alert(`${paymentId} 영수증 다운로드 기능은 추후 구현 예정입니다.`);
  };

  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active');
  const cancelledSubscriptions = mockSubscriptions.filter(sub => sub.status === 'cancelled');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'cancelled':
        return '취소됨';
      default:
        return '대기중';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="h-8 w-8 text-primary" />
                내 구독 관리
              </h1>
              <p className="text-muted-foreground mt-1">
                멤버십 구독을 쉽게 관리하세요
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
              <div className="text-sm text-muted-foreground">활성 구독</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">월간 구독료</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₩{activeSubscriptions.reduce((sum, sub) => sum + sub.tier.price, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                다음 결제까지 15일 남음
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 구독자 수</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSubscriptions.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeSubscriptions.length}개 활성, {cancelledSubscriptions.length}개 취소됨
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 결제금액</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₩{mockSubscriptions.reduce((sum, sub) => sum + sub.totalPaid, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                누적 결제 금액
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 메인 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              활성 구독 ({activeSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              결제 내역
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              취소된 구독 ({cancelledSubscriptions.length})
            </TabsTrigger>
          </TabsList>

          {/* 활성 구독 탭 */}
          <TabsContent value="active" className="space-y-6">
            {activeSubscriptions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Crown className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">아직 구독 중인 멤버십이 없어요</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    좋아하는 크리에이터의 멤버십을 구독하고<br />
                    독점 콘텐츠를 즐겨보세요!
                  </p>
                  <Button asChild>
                    <Link href="/explore">크리에이터 찾기</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {activeSubscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            avatarUrl={subscription.creator.avatarUrl}
                            userId={subscription.creator.id}
                            size={48}
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{subscription.creator.displayName}</h3>
                              <Badge variant="secondary" className={subscription.tier.color}>
                                {subscription.tier.name}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              ₩{subscription.tier.price.toLocaleString()}/월 •
                              다음 결제: {subscription.nextBillingDate}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(subscription.status)}
                            <span className="text-sm font-medium">
                              {getStatusText(subscription.status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            총 ₩{subscription.totalPaid.toLocaleString()} 결제
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">자동 갱신</span>
                            <Badge variant={subscription.autoRenew ? "default" : "secondary"}>
                              {subscription.autoRenew ? "켜짐" : "꺼짐"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleAutoRenew(subscription.id, !subscription.autoRenew)}
                          >
                            {subscription.autoRenew ? "자동 갱신 끄기" : "자동 갱신 켜기"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            구독 취소
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/users/${subscription.creator.username}`}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              메시지
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 결제 내역 탭 */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>결제 내역</CardTitle>
                <CardDescription>
                  모든 멤버십 결제 기록을 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>크리에이터</TableHead>
                      <TableHead>티어</TableHead>
                      <TableHead>결제일</TableHead>
                      <TableHead>결제수단</TableHead>
                      <TableHead>금액</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPaymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.creatorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.tierName}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {payment.date}
                          </div>
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="font-medium">
                          ₩{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <span className="text-sm capitalize">{getStatusText(payment.status)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 취소된 구독 탭 */}
          <TabsContent value="cancelled" className="space-y-6">
            {cancelledSubscriptions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">취소된 구독이 없어요</h3>
                  <p className="text-muted-foreground text-center">
                    구독을 취소한 기록이 없습니다.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    취소된 구독은 서비스 종료일까지 혜택을 이용하실 수 있습니다.
                    재구독을 원하시면 언제든지 다시 구독하실 수 있습니다.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {cancelledSubscriptions.map((subscription) => (
                    <Card key={subscription.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <UserAvatar
                              avatarUrl={subscription.creator.avatarUrl}
                              userId={subscription.creator.id}
                              size={48}
                            />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{subscription.creator.displayName}</h3>
                                <Badge variant="destructive">취소됨</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {subscription.tier.name} 티어 • 서비스 종료: {subscription.endDate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              총 ₩{subscription.totalPaid.toLocaleString()} 결제
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" size="sm" className="w-full">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          다시 구독하기
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

