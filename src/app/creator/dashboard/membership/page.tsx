"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  BarChart3,
  Calendar,
  Settings
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// 모의 데이터 - 실제로는 API에서 가져올 것
const mockCreatorStats = {
  totalEarnings: 2450000,
  monthlyEarnings: 185000,
  subscriberCount: 855,
  growthRate: 12.5,
};

const mockTiers = [
  {
    id: "tier1",
    name: "브론즈",
    price: 4900,
    subscriberCount: 450,
    earnings: 220500,
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "tier2",
    name: "실버",
    price: 9900,
    subscriberCount: 320,
    earnings: 316800,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    recommended: true,
  },
  {
    id: "tier3",
    name: "골드",
    price: 19900,
    subscriberCount: 85,
    earnings: 169150,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
];

const mockSubscribers = [
  {
    id: "user1",
    username: "fan_artist1",
    displayName: "팬 아티스트1",
    avatarUrl: "/avatars/default-1.png",
    tier: "골드",
    joinedDate: "2024-01-15",
    lastPayment: "2024-09-01",
    totalPaid: 19900,
  },
  {
    id: "user2",
    username: "art_lover",
    displayName: "아트 러버",
    avatarUrl: "/avatars/default-2.png",
    tier: "실버",
    joinedDate: "2024-03-20",
    lastPayment: "2024-09-01",
    totalPaid: 9900,
  },
  {
    id: "user3",
    username: "creative_soul",
    displayName: "크리에이티브 소울",
    avatarUrl: "/avatars/default-3.png",
    tier: "브론즈",
    joinedDate: "2024-06-10",
    lastPayment: "2024-09-01",
    totalPaid: 4900,
  },
];

export default function CreatorMembershipDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleCreateTier = () => {
    alert("새 티어 생성 기능은 추후 구현 예정입니다.");
  };

  const handleEditTier = (tierId: string) => {
    alert(`${tierId} 티어 수정 기능은 추후 구현 예정입니다.`);
  };

  const handleDeleteTier = (tierId: string) => {
    alert(`${tierId} 티어 삭제 기능은 추후 구현 예정입니다.`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="h-8 w-8 text-primary" />
                멤버십 관리
              </h1>
              <p className="text-muted-foreground mt-1">
                구독자 관리와 수익 분석을 한 곳에서
              </p>
            </div>
            <Button onClick={handleCreateTier} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              새 티어 만들기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 수익</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{mockCreatorStats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{mockCreatorStats.growthRate}%</span> 전월 대비
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달 수익</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{mockCreatorStats.monthlyEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                목표 달성률 <span className="font-medium">78%</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 구독자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCreatorStats.subscriberCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15명</span> 이번 달
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 구독료</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩8,450</div>
              <p className="text-xs text-muted-foreground">
                티어별 평균
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 탭 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              개요
            </TabsTrigger>
            <TabsTrigger value="tiers" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              티어 관리
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              구독자 관리
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 티어별 수익 분포 */}
              <Card>
                <CardHeader>
                  <CardTitle>티어별 수익 분포</CardTitle>
                  <CardDescription>각 티어의 수익 기여도</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTiers.map((tier) => (
                    <div key={tier.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{tier.name}</span>
                        <span>₩{tier.earnings.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(tier.earnings / mockCreatorStats.totalEarnings) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {tier.subscriberCount}명의 구독자
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 최근 활동 */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 활동</CardTitle>
                  <CardDescription>구독자 관련 최근 업데이트</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">새 구독자 3명</p>
                      <p className="text-xs text-muted-foreground">실버 티어</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2시간 전</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">결제 완료 ₩29,700</p>
                      <p className="text-xs text-muted-foreground">브론즈+실버 티어</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5시간 전</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">구독 취소 1건</p>
                      <p className="text-xs text-muted-foreground">브론즈 티어</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1일 전</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 티어 관리 탭 */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid gap-6">
              {mockTiers.map((tier) => (
                <Card key={tier.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tier.color}`}>
                          <Crown className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {tier.name}
                            {tier.recommended && (
                              <Badge variant="secondary">추천</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            ₩{tier.price.toLocaleString()}/월 • {tier.subscriberCount}명의 구독자
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₩{tier.earnings.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">총 수익</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTier(tier.id)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTier(tier.id)}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        삭제
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 구독자 관리 탭 */}
          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>구독자 목록</CardTitle>
                <CardDescription>
                  총 {mockSubscribers.length}명의 구독자를 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>구독자</TableHead>
                      <TableHead>티어</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead>마지막 결제</TableHead>
                      <TableHead>총 결제금액</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={subscriber.avatarUrl} />
                              <AvatarFallback>{subscriber.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{subscriber.displayName}</div>
                              <div className="text-sm text-muted-foreground">@{subscriber.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{subscriber.tier}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(subscriber.joinedDate).toLocaleDateString('ko-KR')}
                          </div>
                        </TableCell>
                        <TableCell>{subscriber.lastPayment}</TableCell>
                        <TableCell className="font-medium">
                          ₩{subscriber.totalPaid.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

