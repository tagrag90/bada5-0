import { Studio, Connection, Post } from "./types";

// Studio 색상 할당 함수
export function assignStudioColor(index: number): string {
  const colors = [
    "#8B5CF6", "#EC4899", "#3B82F6", "#10B981", 
    "#F59E0B", "#EF4444", "#14B8A6", "#A78BFA"
  ];
  return colors[index % colors.length];
}

// 3D 위치 생성 함수 (원형 배치) - 시드 기반으로 고정
export function generate3DPosition(index: number, total: number): [number, number, number] {
  const angle = (index / total) * Math.PI * 2;
  const radius = 20;
  // 시드 기반 높이 (항상 같은 값)
  const seed = index * 12345;
  const height = ((seed % 100) / 100 - 0.5) * 10;
  
  return [
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius,
  ];
}

import { PlanetEntity } from "./types";

// 목업 Studio 데이터
export const mockStudios: PlanetEntity[] = [
  { 
    id: "1", 
    name: "Stellar Arts",
    slug: "stellar-arts",
    type: "PERSONAL", 
    subscribers: 1250,
    subscribersCount: 1250,
    color: "#8B5CF6", 
    position3D: [20, 8, 15],
    projects: [
      { id: "p1", name: "Galaxy Series", title: "Galaxy Series", color: "#A78BFA" },
      { id: "p2", name: "Nebula Collection", title: "Nebula Collection", color: "#C4B5FD" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "2", 
    name: "Cosmic Beats",
    slug: "cosmic-beats",
    type: "TEAM", 
    subscribers: 3400,
    subscribersCount: 3400,
    color: "#EC4899", 
    position3D: [-18, -5, 12],
    projects: [
      { id: "p3", name: "Space Album", title: "Space Album", color: "#F472B6" },
      { id: "p4", name: "Orbit EP", title: "Orbit EP", color: "#FBCFE8" },
      { id: "p5", name: "Starlight Tour", title: "Starlight Tour", color: "#FDA4AF" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "3", 
    name: "Nebula Design",
    slug: "nebula-design",
    type: "PERSONAL",
    subscribers: 890,
    subscribersCount: 890,
    color: "#3B82F6", 
    position3D: [10, -15, -18],
    projects: [
      { id: "p6", name: "Cosmic UI Kit", title: "Cosmic UI Kit", color: "#60A5FA" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "4", 
    name: "Galaxy Studios",
    slug: "galaxy-studios",
    type: "TEAM",
    subscribers: 5200,
    subscribersCount: 5200,
    color: "#10B981", 
    position3D: [-15, 12, -10],
    projects: [
      { id: "p7", name: "Planet Docs", title: "Planet Docs", color: "#34D399" },
      { id: "p8", name: "Star System", title: "Star System", color: "#6EE7B7" },
      { id: "p9", name: "Moon Phase", title: "Moon Phase", color: "#A7F3D0" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "5", 
    name: "Orbit Creative",
    slug: "orbit-creative",
    type: "PERSONAL",
    subscribers: 670,
    subscribersCount: 670,
    color: "#F59E0B", 
    position3D: [18, -10, -15],
    projects: [
      { id: "p10", name: "Solar Campaign", title: "Solar Campaign", color: "#FBBF24" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "6", 
    name: "Supernova Co",
    slug: "supernova-co",
    type: "TEAM",
    subscribers: 2100,
    subscribersCount: 2100,
    color: "#EF4444", 
    position3D: [-12, 15, 18],
    projects: [
      { id: "p11", name: "Red Giant", title: "Red Giant", color: "#F87171" },
      { id: "p12", name: "Dwarf Star", title: "Dwarf Star", color: "#FCA5A5" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "7", 
    name: "Starlight Music",
    slug: "starlight-music",
    type: "PERSONAL",
    subscribers: 1800,
    subscribersCount: 1800,
    color: "#14B8A6", 
    position3D: [15, 5, -20],
    projects: [
      { id: "p13", name: "Aurora Single", title: "Aurora Single", color: "#2DD4BF" },
      { id: "p14", name: "Cosmos Mixtape", title: "Cosmos Mixtape", color: "#5EEAD4" },
    ],
    entityType: "studio" as const,
  },
  { 
    id: "8", 
    name: "Aurora Labs",
    slug: "aurora-labs",
    type: "TEAM",
    subscribers: 4500,
    subscribersCount: 4500,
    color: "#A78BFA", 
    position3D: [-20, -12, 8],
    projects: [
      { id: "p15", name: "Quantum SDK", title: "Quantum SDK", color: "#C4B5FD" },
      { id: "p16", name: "Neural API", title: "Neural API", color: "#DDD6FE" },
    ],
    entityType: "studio" as const,
  },
];

// 연결 관계
export const connections: Connection[] = [
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "4", to: "6" },
  { from: "5", to: "7" },
  { from: "3", to: "8" },
  { from: "1", to: "7" },
];

// 목업 게시물 데이터
export const mockPosts: Post[] = [
  { id: 1, studioId: "1", content: "새로운 Galaxy Series 시작합니다! 🌌", likes: 234, comments: 45, time: "2시간 전" },
  { id: 2, studioId: "1", content: "Nebula Collection 작업 중... 곧 공개될 예정입니다.", likes: 189, comments: 23, time: "1일 전" },
  { id: 3, studioId: "2", content: "Space Album 발매! 많은 관심 부탁드립니다 🎵", likes: 456, comments: 89, time: "3시간 전" },
  { id: 4, studioId: "3", content: "Cosmic UI Kit 업데이트 완료", likes: 123, comments: 18, time: "5시간 전" },
  { id: 5, studioId: "4", content: "Planet Docs 베타 테스터 모집 중!", likes: 567, comments: 112, time: "1시간 전" },
  { id: 6, studioId: "2", content: "Orbit EP 티저 공개! 기대해주세요 ✨", likes: 321, comments: 67, time: "6시간 전" },
  { id: 7, studioId: "7", content: "Aurora Single MV 촬영 완료 📹", likes: 289, comments: 42, time: "1일 전" },
];
