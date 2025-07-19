"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/app/(main)/SessionProvider";
import { Loader2, RefreshCw, Users, FileText, Heart, MessageCircle, Bookmark, Bell, TrendingUp } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import kyInstance from "@/lib/ky";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminStats {
  overview: {
    totalUsers: number;
    monthlyActiveUsers: number;
    todaySignups: number;
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalBookmarks: number;
    totalNotifications: number;
  };
  recent: {
    users: Array<{
      username: string;
      displayName: string;
      createdAt: string;
    }>;
    posts: Array<{
      id: string;
      content: string;
      createdAt: string;
      user: {
        username: string;
        displayName: string;
      };
    }>;
  };
  charts: {
    dailyActiveUsers: Array<{
      date: string;
      count: number;
      label: string;
    }>;
  };
  timestamp: string;
}

export default function AdminPage() {
  const { user } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats', refreshKey],
    queryFn: () => kyInstance.get('/api/admin/stats').json<AdminStats>(),
    refetchInterval: 30000, // 30초마다 자동 새로고침
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">어드민 페이지에 접근하려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">어드민 권한이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bada 어드민 대시보드</h1>
          <p className="text-gray-600 mt-2">사용자 통계 및 활동 현황</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">@{user.username}</span>
          <button 
            onClick={handleRefresh} 
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            새로고침
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 사용자</p>
                  <p className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">오늘 가입: {stats.overview.todaySignups}명</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">월간 활성 사용자</p>
                  <p className="text-2xl font-bold">{stats.overview.monthlyActiveUsers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">30일 이내 활동</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 게시글</p>
                  <p className="text-2xl font-bold">{stats.overview.totalPosts.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">전체 게시글 수</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 좋아요</p>
                  <p className="text-2xl font-bold">{stats.overview.totalLikes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">전체 좋아요 수</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 댓글</p>
                  <p className="text-2xl font-bold">{stats.overview.totalComments.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">전체 댓글 수</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 북마크</p>
                  <p className="text-2xl font-bold">{stats.overview.totalBookmarks.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">전체 북마크 수</p>
                </div>
                <Bookmark className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 알림</p>
                  <p className="text-2xl font-bold">{stats.overview.totalNotifications.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">전체 알림 수</p>
                </div>
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* 일간 활성 사용자 수 그래프 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">일간 활성 사용자 수 (DAU)</h3>
                <p className="text-sm text-gray-600">지난 30일간 일별 활성 사용자 현황 (가입, 게시글, 댓글, 북마크 활동 기준)</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.charts.dailyActiveUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `${payload[0].payload.date} (${label})`;
                      }
                      return label;
                    }}
                    formatter={(value) => [`${value}명`, '활성 사용자']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">최근 가입자</h3>
              <p className="text-sm text-gray-600 mb-4">최근 5명의 신규 사용자</p>
              <div className="space-y-3">
                {stats.recent.users.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatRelativeDate(new Date(user.createdAt))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">최근 게시글</h3>
              <p className="text-sm text-gray-600 mb-4">최근 5개의 게시글</p>
              <div className="space-y-3">
                {stats.recent.posts.map((post, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{post.user.displayName}</p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeDate(new Date(post.createdAt))}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 마지막 업데이트 시간 */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              마지막 업데이트: {formatRelativeDate(new Date(stats.timestamp))}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
} 