import { Studio, Post, Project, User, PlanetEntity } from "./types";
import { assignStudioColor, generate3DPosition } from "./data";

// API 데이터를 Constellation 형식으로 변환
export function transformStudioData(apiStudios: any[]): PlanetEntity[] {
  return apiStudios.map((studio, index) => ({
    id: studio.id,
    name: studio.name,
    slug: studio.slug,
    description: studio.description,
    type: studio.type,
    subscribersCount: studio.subscribersCount || studio._count?.subscriptions || 0,
    subscribers: studio.subscribersCount || studio._count?.subscriptions || 0,
    color: assignStudioColor(index),
    position3D: generate3DPosition(index, apiStudios.length),
    avatarUrl: studio.avatarUrl,
    bannerUrl: studio.bannerUrl,
    isVerified: studio.isVerified,
    owner: studio.owner,
    _count: studio._count,
    projects: [], // 나중에 items로 채움
    entityType: "studio" as const,
  }));
}

// User를 Planet 형식으로 변환
export function transformUserData(apiUsers: any[], startIndex: number): PlanetEntity[] {
  const userColors = [
    "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9", 
    "#6366F1", "#8B5CF6", "#A855F7", "#D946EF"
  ];

  console.log('[Cosmos] 변환 중인 유저들:', apiUsers.map(u => ({
    displayName: u.displayName,
    username: u.username,
    id: u.id
  })));

  return apiUsers.map((user, index) => ({
    id: `user-${user.id}`,
    name: user.displayName,
    slug: user.username,
    description: user.bio,
    type: "PERSONAL" as const,
    subscribersCount: user._count?.followers || 0,
    subscribers: user._count?.followers || 0,
    color: userColors[index % userColors.length],
    position3D: generate3DPosition(startIndex + index, startIndex + apiUsers.length),
    avatarUrl: user.avatarUrl,
    isVerified: false,
    owner: {
      username: user.username,
      displayName: user.displayName,
    },
    _count: {
      members: 0,
      events: 0,
      subscriptions: user._count?.followers || 0,
    },
    projects: user.skills?.slice(0, 3).map((skill: string, i: number) => ({
      id: `skill-${i}`,
      name: skill,
      title: skill,
      color: userColors[(index + i) % userColors.length],
    })) || [],
    entityType: "user",
  }));
}

// StudioItem을 Project 형식으로 변환
export function transformItemsToProjects(items: any[]): Project[] {
  const projectColors = [
    "#A78BFA", "#C4B5FD", "#F472B6", "#FBCFE8", 
    "#60A5FA", "#34D399", "#FBBF24", "#F87171"
  ];

  return items
    .filter(item => item.type === "EVENT" || item.type === "NOTE")
    .slice(0, 5) // 최대 5개만
    .map((item, index) => ({
      id: item.id,
      name: item.title,
      title: item.title,
      color: projectColors[index % projectColors.length],
      type: item.type,
    }));
}

// Post 데이터 변환 - PostData 형식으로 완전히 변환
export function transformPostData(apiPosts: any[]): any[] {
  return apiPosts
    .filter(post => !post.title) // 블로그 글(title 있는 것) 제외
    .map(post => ({
      ...post,
      attachments: post.attachments || [],
      likes: post.likes || [],
      bookmarks: post.bookmarks || [],
      _count: post._count || { likes: 0, comments: 0 },
      user: post.user || {
        id: 'unknown',
        username: 'unknown',
        displayName: '알 수 없음',
        avatarUrl: null,
        bio: null,
        skills: [],
        createdAt: new Date(),
        followers: [],
        following: [],
      },
      studio: post.studio || null,
      title: post.title || null,
      linkPreviews: post.linkPreviews || null,
    }));
}

// 상대 시간 계산
function getRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    return `${diffInDays}일 전`;
  }
}

// Studio 간 연결 관계 생성 (협업 관계 추론)
export function generateConnections(studios: Studio[]): { from: string; to: string }[] {
  const connections: { from: string; to: string }[] = [];
  
  // 간단한 로직: 인접한 Studio끼리 연결
  for (let i = 0; i < studios.length - 1; i += 2) {
    if (i + 1 < studios.length) {
      connections.push({
        from: studios[i].id,
        to: studios[i + 1].id,
      });
    }
  }
  
  return connections;
}

