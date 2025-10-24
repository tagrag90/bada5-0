"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Info, Play, Pause, Box, Map, Loader2, Home, PenSquare } from "lucide-react";
import Link from "next/link";
import Canvas3D from "./Canvas3D";
import Canvas2D from "./Canvas2D";
import PostComponent from "@/components/posts/Post";
import BrandSidebar from "@/components/BrandSidebar";
import ConstellationPostEditor from "./ConstellationPostEditor";
import { mockStudios as fallbackStudios, mockPosts as fallbackPosts, generate3DPosition } from "./data";
import { useStudios, useStudioPosts, useStudioItems, useAllUsers, useUserPosts, useCurrentUser } from "./hooks";
import { transformStudioData, transformPostData, transformItemsToProjects, generateConnections, transformUserData } from "./utils";
import { Studio, Post as PostType, PlanetEntity } from "./types";
type ViewMode = "2d" | "3d";

export default function ConstellationHybrid() {
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showBrandSidebar, setShowBrandSidebar] = useState(false);
  const [showPostEditor, setShowPostEditor] = useState(false);
  
  // 2D 전용 상태
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 실제 데이터 fetch
  const { data: apiStudios, isLoading: studiosLoading } = useStudios();
  const { data: apiUsers, isLoading: usersLoading } = useAllUsers();
  const { data: currentUser } = useCurrentUser();
  
  // 선택된 엔티티에 따라 다른 데이터 fetch
  const isUserSelected = selectedId?.startsWith('user-') || false;
  const actualUserId = isUserSelected && selectedId ? selectedId.replace('user-', '') : null;
  
  const { data: apiStudioPosts } = useStudioPosts(isUserSelected ? null : selectedId);
  const { data: apiUserPosts } = useUserPosts(actualUserId);
  const { data: apiItems } = useStudioItems(isUserSelected ? null : selectedId);

  // 실제 데이터 또는 목업 사용 (Studio + User + CurrentUser 합침)
  const studios = useMemo(() => {
    let allPlanets: PlanetEntity[] = [];
    let startIndex = 0;

    console.log('[Cosmos] 데이터 확인:', {
      apiStudios: apiStudios?.length,
      apiUsers: apiUsers?.length,
      currentUser: currentUser?.displayName,
    });

    // 내 행성 (중앙에 배치)
    if (currentUser) {
      const myPlanet: PlanetEntity = {
        id: `user-${currentUser.id}`,
        name: currentUser.displayName + " (나)",
        slug: currentUser.username,
        description: currentUser.bio,
        type: "PERSONAL",
        subscribersCount: currentUser._count?.followers || 0,
        subscribers: currentUser._count?.followers || 0,
        color: "#FFD700", // 골드 색상으로 강조
        position3D: [0, 0, 0], // 중앙
        avatarUrl: currentUser.avatarUrl,
        isVerified: false,
        owner: {
          username: currentUser.username,
          displayName: currentUser.displayName,
        },
        _count: currentUser._count,
        projects: currentUser.skills?.slice(0, 3).map((skill: string, i: number) => ({
          id: `my-skill-${i}`,
          name: skill,
          title: skill,
          color: "#FFC107",
        })) || [],
        entityType: "user",
      };
      allPlanets.push(myPlanet);
      startIndex = 1;
    }

    // Studio 행성
    if (apiStudios && apiStudios.length > 0) {
      const transformedStudios = transformStudioData(apiStudios);
      
      // 선택된 Studio에 프로젝트 추가
      if (selectedId && apiItems && !selectedId.startsWith('user-')) {
        const studio = transformedStudios.find(s => s.id === selectedId);
        if (studio) {
          studio.projects = transformItemsToProjects(apiItems);
        }
      }
      
      allPlanets = [...allPlanets, ...transformedStudios];
      startIndex = allPlanets.length;
    }

    // User 행성
    if (apiUsers && apiUsers.length > 0) {
      console.log('[Cosmos] User 변환 시작:', apiUsers.length, '명');
      const transformedUsers = transformUserData(apiUsers, startIndex);
      console.log('[Cosmos] 변환된 User 행성:', transformedUsers.map(u => u.name));
      allPlanets = [...allPlanets, ...transformedUsers];
    }

    // 데이터 없으면 fallback (로그인 안 한 경우)
    if (allPlanets.length === 0) {
      return fallbackStudios.map((studio, index) => ({
        ...studio,
        position3D: generate3DPosition(index, fallbackStudios.length),
      }));
    }

    console.log('[Cosmos] 최종 행성 목록:', allPlanets.map(p => ({
      name: p.name,
      type: p.entityType,
      position: p.position3D
    })));

    return allPlanets;
  }, [apiStudios, apiUsers, currentUser, selectedId, apiItems]);

  const posts: PostType[] = useMemo(() => {
    // User 선택 시
    if (isUserSelected && apiUserPosts && apiUserPosts.length > 0) {
      return transformPostData(apiUserPosts);
    }
    // Studio 선택 시
    if (!isUserSelected && apiStudioPosts && apiStudioPosts.length > 0) {
      return transformPostData(apiStudioPosts);
    }
    // Fallback
    return fallbackPosts.filter(p => p.studioId === selectedId);
  }, [isUserSelected, apiUserPosts, apiStudioPosts, selectedId]);

  const connections = useMemo(() => {
    return generateConnections(studios);
  }, [studios]);

  const selectedStudio = selectedId ? studios.find((s) => s.id === selectedId) : null;

  // 뷰 모드 변경 시 선택 초기화
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setSelectedId(null);
    setHoveredId(null);
  };

  // localStorage에 선호도 저장
  useEffect(() => {
    const saved = localStorage.getItem('constellation-view-mode');
    if (saved === '2d' || saved === '3d') {
      setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('constellation-view-mode', viewMode);
  }, [viewMode]);

  // 로딩 상태
  if (studiosLoading) {
    return (
      <div className="fixed inset-0 bg-[#000510] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/70">우주를 생성하는 중...</p>
          <p className="text-white/50 text-xs mt-2">
            Studio 로드 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#000510] overflow-hidden">
      <style jsx global>{`
        .constellation-feed .constellation-post {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .constellation-post article,
        .constellation-post .post-card,
        .constellation-post > div {
          background: transparent !important;
          border: none !important;
        }
        
        .constellation-post,
        .constellation-post * {
          color: white !important;
        }
        
        .constellation-post a {
          color: #93C5FD !important;
        }
        
        .constellation-post a:hover {
          color: #DBEAFE !important;
        }
        
        .constellation-post .text-muted-foreground,
        .constellation-post [class*="text-muted"] {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .constellation-post button {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .constellation-post button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        .constellation-post svg {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .constellation-post img {
          border-radius: 8px;
        }
        
        /* 아바타 이미지 동그랗게 */
        .constellation-post img[alt*="avatar"],
        .constellation-post img[src*="avatar"] {
          border-radius: 9999px !important;
        }
        
        /* 좋아요/댓글 버튼 스타일 */
        .constellation-post button[disabled] {
          opacity: 0.7 !important;
          cursor: not-allowed !important;
        }
        
        /* 버튼 클릭 시 로그인 안내 표시 안함 */
        .constellation-post button {
          pointer-events: auto !important;
        }
        
        /* BrandSidebar 색상 반전 */
        .constellation-brand-sidebar {
          background: rgba(0, 0, 0, 0.85) !important;
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .constellation-brand-sidebar * {
          color: white !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .constellation-brand-sidebar a {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .constellation-brand-sidebar a:hover {
          color: white !important;
        }
        
        .constellation-brand-sidebar svg {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .constellation-brand-sidebar svg:hover {
          color: white !important;
        }
        
        .constellation-brand-sidebar .text-stone-600 {
          color: white !important;
        }
        
        .constellation-brand-sidebar .text-gray-500 {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .constellation-brand-sidebar .text-gray-400 {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .constellation-brand-sidebar .border-dotted {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .constellation-brand-sidebar .hover\\:text-foreground:hover {
          color: white !important;
        }
        
        .constellation-brand-sidebar .hover\\:text-stone-700:hover {
          color: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
      {/* 하단 중앙 메뉴 바 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-3 border border-white/20 shadow-2xl">
          {/* View Mode Toggle */}
          <div className="flex gap-1 p-1 bg-black/20 rounded-full">
            <button
              onClick={() => handleViewModeChange("3d")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                viewMode === "3d"
                  ? "bg-white text-black shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Box className="w-4 h-4" />
              <span className="text-sm font-medium">3D</span>
            </button>
            <button
              onClick={() => handleViewModeChange("2d")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                viewMode === "2d"
                  ? "bg-white text-black shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="text-sm font-medium">2D</span>
            </button>
          </div>

          <div className="w-px h-6 bg-white/20" />

          <button
            onClick={() => setShowPostEditor(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="게시물 작성"
          >
            <PenSquare className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => setShowBrandSidebar(!showBrandSidebar)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Studio_bada 정보"
          >
            <Home className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="도움말"
          >
            <Info className="w-5 h-5 text-white" />
          </button>

          {viewMode === "3d" && (
            <>
              <div className="w-px h-6 bg-white/20" />
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title={autoRotate ? "자동 회전 끄기" : "자동 회전 켜기"}
              >
                {autoRotate ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas (조건부 렌더링) */}
      <div className="absolute inset-0 transition-opacity duration-300">
        {viewMode === "3d" ? (
          <Canvas3D
            studios={studios}
            connections={connections}
            hoveredId={hoveredId}
            selectedId={selectedId}
            setHoveredId={setHoveredId}
            setSelectedId={setSelectedId}
            autoRotate={autoRotate}
          />
        ) : (
          <Canvas2D
            studios={studios}
            connections={connections}
            zoom={zoom}
            offset={offset}
            hoveredId={hoveredId}
            selectedId={selectedId}
            setHoveredId={setHoveredId}
            setSelectedId={setSelectedId}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            dragStart={dragStart}
            setDragStart={setDragStart}
            setZoom={setZoom}
            setOffset={setOffset}
          />
        )}
      </div>

      {/* Info Panel - 우측 상단 */}
      {showInfo && !selectedStudio && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 max-w-xs md:max-w-md p-4 md:p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white">
          <h3 className="font-bold text-lg mb-3">
            {viewMode === "3d" ? "3D 인터랙션 가이드" : "2D 인터랙션 가이드"}
          </h3>
          {viewMode === "3d" ? (
            <ul className="space-y-2 text-sm text-white/80">
              <li>🖱️ <strong>드래그</strong>: 카메라 회전</li>
              <li>🔍 <strong>스크롤</strong>: 줌 인/아웃</li>
              <li>👆 <strong>호버</strong>: Studio 정보 미리보기</li>
              <li>✨ <strong>클릭</strong>: 행성으로 줌인 & 상세 정보</li>
              <li>🔄 <strong>다시 클릭</strong>: 원래 뷰로 복귀</li>
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-white/80">
              <li>🖱️ <strong>드래그</strong>: 우주 공간 이동</li>
              <li>🔍 <strong>스크롤</strong>: 줌 인/아웃</li>
              <li>👆 <strong>호버</strong>: Studio 정보 미리보기</li>
              <li>✨ <strong>클릭</strong>: Studio 상세 정보</li>
              <li>🎯 <strong>위성</strong>: 행성 주위 회전하는 프로젝트</li>
            </ul>
          )}
          <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/60">
            {viewMode === "3d" ? "Three.js 3D 렌더링" : "Canvas 2D 렌더링"}
            <br />
            {studios.filter(s => s.entityType === "studio" || !s.entityType).length}개 Studio · {studios.filter(s => s.entityType === "user").length}개 User
            {(apiStudios && apiStudios.length > 0) || (apiUsers && apiUsers.length > 0) ? (
              <span className="ml-2 text-green-400">● 실시간 데이터</span>
            ) : null}
            <br />
            <span className="text-white/40">
              Debug: API Studios={apiStudios?.length || 0}, API Users={apiUsers?.length || 0}, Current={currentUser ? '✓' : '✗'}
            </span>
          </div>
        </div>
      )}

      {/* BrandSidebar - TrendsSidebar 구조 사용 */}
      {showBrandSidebar && (
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 constellation-brand-sidebar rounded-xl shadow-2xl p-5">
          <button
            onClick={() => setShowBrandSidebar(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          >
            ✕
          </button>
          <BrandSidebar />

          <div className="flex flex-col gap-6 mt-5">
            <div className="flex w-full justify-end">
              <div className="flex flex-col justify-end gap-1 text-xs text-gray-400">
                <div className="text-right">
                  Email : teambada1206@gmail.com(only)
                </div>
                <div className="text-right">서비스이용약관</div>
                <Link href="/privacy">
                  <div className="text-right hover:text-foreground transition-colors cursor-pointer">개인정보처리방침</div>
                </Link>
              </div>
            </div>
            <div className="flex w-full justify-end">
              <div className="flex flex-col justify-end gap-1 text-xs">
                <Link
                  href="https://www.vessel.today"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    Vessel
                  </div>
                </Link>

                <Link
                  href="https://www.instagram.com/team_masanbaseball/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    Baseball playlist
                  </div>
                </Link>

                <Link href="/nonexistent-page" className="block">
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    404 탐험하기
                  </div>
                </Link>

                <Link href="/docs" className="block">
                  <div className="text-right text-stone-500 hover:text-stone-700 hover:underline cursor-pointer transition-colors">
                    Docs
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Editor Modal */}
      <ConstellationPostEditor
        isOpen={showPostEditor}
        onClose={() => setShowPostEditor(false)}
      />

      {/* Selected Studio Info - 모바일: 하단 시트, 데스크톱: 우측 패널 */}
      {selectedStudio && (
        <div className="absolute inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 md:w-[600px] max-h-[80vh] md:max-h-[85vh] overflow-y-auto bg-black/90 md:bg-black/80 backdrop-blur-xl rounded-t-2xl md:rounded-xl shadow-2xl border-t md:border border-white/20">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedStudio.name}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedStudio.color, boxShadow: `0 0 10px ${selectedStudio.color}` }}
                  />
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  {selectedStudio.entityType === "user" 
                    ? "개인 프로필" 
                    : selectedStudio.type === "TEAM" ? "팀 스튜디오" : "개인 스튜디오"}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60">
                  {selectedStudio.entityType === "user" ? "팔로워" : "구독자"}
                </p>
                <p className="text-2xl font-bold text-white">{(selectedStudio.subscribers || selectedStudio.subscribersCount || 0).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-white/60">
                  {selectedStudio.entityType === "user" ? "스킬" : "프로젝트"}
                </p>
                <p className="text-2xl font-bold text-white">{selectedStudio.projects?.length || 0}</p>
              </div>
            </div>

            {/* 프로젝트/스킬 목록 */}
            {selectedStudio.projects && selectedStudio.projects.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white/80 mb-2">
                  {selectedStudio.entityType === "user" ? "보유 스킬" : "진행 중인 프로젝트"}
                </h4>
                <div className="space-y-2">
                  {selectedStudio.projects.map((project) => (
                    <div 
                      key={project.id}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div 
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}` }}
                      />
                      <span className="text-sm text-white">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <button className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-medium">
                {selectedStudio.entityType === "user" ? "프로필 방문" : "Studio 방문"}
              </button>
              <button 
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-white"
                style={{ borderColor: selectedStudio.color }}
              >
                {selectedStudio.entityType === "user" ? "팔로우" : "연대하기"}
              </button>
            </div>

            {/* 게시물 피드 */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-white/80 mb-4">최근 게시물</h4>
              <div className="space-y-4 constellation-feed">
                {posts.map((post: any) => (
                  <div 
                    key={post.id} 
                    className="constellation-post"
                    onClick={(e) => {
                      // 클릭 이벤트 전파 방지 (로그인 페이지 이동 방지)
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'BUTTON' || target.closest('button')) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <PostComponent post={post} />
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="text-sm text-white/50 text-center py-8">게시물이 없습니다</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

