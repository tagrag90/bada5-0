import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// 어드민 권한 확인 (현재 로그인한 사용자의 username 기준)
const ADMIN_USERS = ['qkrwnstj0401'];

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 어드민 권한 확인
    if (!ADMIN_USERS.includes(user.username)) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    // 현재 시간 기준 계산
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 일별 활성 사용자 데이터 쿼리 준비 (지난 30일)
    const dailyActiveUsersQueries = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      // 해당 날짜에 활동한 사용자 수 계산 (가입, 게시글, 댓글, 북마크 중 하나라도 활동한 사용자)
      dailyActiveUsersQueries.push(
        prisma.user.count({
          where: {
            OR: [
              {
                // 해당 날짜에 가입한 사용자
                createdAt: {
                  gte: startOfDay,
                  lt: endOfDay
                }
              },
              {
                posts: {
                  some: {
                    createdAt: {
                      gte: startOfDay,
                      lt: endOfDay
                    }
                  }
                }
              },
              {
                comments: {
                  some: {
                    createdAt: {
                      gte: startOfDay,
                      lt: endOfDay
                    }
                  }
                }
              },
              {
                bookmarks: {
                  some: {
                    createdAt: {
                      gte: startOfDay,
                      lt: endOfDay
                    }
                  }
                }
              }
            ]
          }
        })
      );
    }

    // 병렬로 모든 통계 쿼리 실행
    const [
      totalUsers,
      monthlyActiveUsers,
      todaySignups,
      totalPosts,
      totalLikes,
      totalComments,
      totalBookmarks,
      totalNotifications,
      recentUsers,
      recentPosts,
      ...dailyActiveUsersResults
    ] = await Promise.all([
      // 총 사용자 수
      prisma.user.count(),
      
      // 월간 활성 사용자 (30일 이내 게시글 작성한 사용자)
      prisma.user.count({
        where: {
          posts: {
            some: {
              createdAt: {
                gte: thirtyDaysAgo
              }
            }
          }
        }
      }),
      
      // 오늘 가입한 사용자 수
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfToday
          }
        }
      }),
      
      // 총 게시글 수
      prisma.post.count(),
      
      // 총 좋아요 수
      prisma.like.count(),
      
      // 총 댓글 수
      prisma.comment.count(),
      
      // 총 북마크 수
      prisma.bookmark.count(),
      
      // 총 알림 수
      prisma.notification.count(),
      
      // 최근 5명 가입자
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          username: true,
          displayName: true,
          createdAt: true
        }
      }),
      
      // 최근 5개 게시글
      prisma.post.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              displayName: true
            }
          }
        }
      }),
      
      // 일별 활성 사용자 수 쿼리들
      ...dailyActiveUsersQueries
    ]);

    // 일별 활성 사용자 데이터 포맷팅
    const dailyActiveUsers = dailyActiveUsersResults.map((count: number, index: number) => {
      const date = new Date(now.getTime() - (29 - index) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD 형식
        count: count,
        label: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
      };
    });

    const stats = {
      overview: {
        totalUsers,
        monthlyActiveUsers,
        todaySignups,
        totalPosts,
        totalLikes,
        totalComments,
        totalBookmarks,
        totalNotifications
      },
      recent: {
        users: recentUsers,
        posts: recentPosts
      },
      charts: {
        dailyActiveUsers: dailyActiveUsers
      },
      timestamp: now.toISOString()
    };

    return Response.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
} 