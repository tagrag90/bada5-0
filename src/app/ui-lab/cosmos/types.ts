// 공통 타입 정의

export type StudioType = "PERSONAL" | "TEAM";

export interface Project {
  id: string;
  name: string;
  title?: string;
  color: string;
  type?: string;
}

export interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  type: StudioType;
  subscribersCount: number;
  subscribers?: number; // 호환성을 위해
  color: string;
  position3D: [number, number, number];
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  isVerified?: boolean;
  projects?: Project[];
  owner?: {
    username: string;
    displayName: string;
  };
  _count?: {
    members: number;
    events: number;
    subscriptions: number;
  };
  entityType?: "studio" | "user"; // Studio vs User 구분
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  skills?: string[];
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}

// Studio와 User를 합친 통합 타입 (행성으로 표시)
export interface PlanetEntity extends Studio {
  entityType: "studio" | "user";
}

export interface Connection {
  from: string;
  to: string;
}

export interface Post {
  id: string | number;
  studioId?: string | null;
  content: string;
  createdAt?: Date | string;
  _count?: {
    likes: number;
    comments: number;
  };
  // 목업 호환
  likes?: number;
  comments?: number;
  time?: string;
  user?: {
    username: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

