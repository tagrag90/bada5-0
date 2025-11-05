"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MobileStudioContentList from "./MobileStudioContentList";
import { cn } from "@/lib/utils";

interface Studio {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  _count: {
    members: number;
    events: number;
  };
  subscribersCount: number;
}

interface MobileStudioBottomSheetProps {
  studioId: string;
  studioName: string;
  studio?: Studio;
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  isOwner?: boolean;
}

export default function MobileStudioBottomSheet({
  studioId,
  studioName,
  studio,
  selectedTab,
  onTabSelect,
  isOwner,
}: MobileStudioBottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 초기 높이: 스튜디오 정보만 보이는 높이 (약 120px)
  // 네비바 높이 고려 (모바일 하단 네비바는 약 64px)
  const NAVBAR_HEIGHT = 64;
  const MIN_HEIGHT = 120;
  const HEADER_HEIGHT = 120; // 드래그 핸들 + 스튜디오 정보 높이
  const [maxHeight, setMaxHeight] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(MIN_HEIGHT);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0); // 내용물 실제 높이
  
  // 화면 높이 계산 (네비바 높이 제외)
  useEffect(() => {
    const updateMaxHeight = () => {
      // 네비바 높이를 고려한 최대 높이
      setMaxHeight(window.innerHeight * 0.85 - NAVBAR_HEIGHT);
    };
    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  // 내용물 높이 측정
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      // 약간의 지연을 두고 측정 (렌더링 완료 후)
      const timer = setTimeout(() => {
        const updateContentHeight = () => {
          const contentElement = contentRef.current?.querySelector('div') || contentRef.current;
          if (contentElement) {
            const height = contentElement.scrollHeight || 0;
            setContentHeight(height);
          }
        };
        
        // 초기 측정
        updateContentHeight();
        
        // ResizeObserver로 내용물 변화 감지
        const resizeObserver = new ResizeObserver(updateContentHeight);
        if (contentRef.current) {
          resizeObserver.observe(contentRef.current);
        }
        
        return () => {
          resizeObserver.disconnect();
        };
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setContentHeight(0);
    }
  }, [isExpanded]);

  // 최대 높이 계산 (네비바 높이 제외)
  const calculatedMaxHeight = maxHeight || (typeof window !== 'undefined' ? window.innerHeight * 0.85 - NAVBAR_HEIGHT : 0);
  
  // 실제 필요한 높이 계산 (내용물 높이 + 헤더 높이)
  const actualContentHeight = contentHeight + HEADER_HEIGHT;
  // 내용물 높이와 최대 높이 중 작은 값 사용
  const targetHeight = Math.min(actualContentHeight, calculatedMaxHeight);

  // 드래그 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(sheetHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(sheetHeight);
  };

  // 드래그 중
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newY = e.touches[0].clientY;
    const deltaY = startY - newY; // 위로 드래그하면 양수, 아래로 드래그하면 음수
    const newHeight = Math.max(MIN_HEIGHT, Math.min(calculatedMaxHeight, startHeight + deltaY));
    setSheetHeight(newHeight);
    
    // 드래그 중에 확장 상태 업데이트 (실시간 피드백)
    const measuredHeight = contentRef.current?.scrollHeight || contentHeight || 0;
    const targetHeightWithContent = Math.min(measuredHeight + HEADER_HEIGHT, calculatedMaxHeight);
    const expandedHeight = Math.max(targetHeightWithContent - MIN_HEIGHT, 100);
    const threshold = expandedHeight * 0.3;
    
    setIsExpanded(newHeight >= MIN_HEIGHT + threshold);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newY = e.clientY;
    const deltaY = startY - newY; // 위로 드래그하면 양수, 아래로 드래그하면 음수
    const newHeight = Math.max(MIN_HEIGHT, Math.min(calculatedMaxHeight, startHeight + deltaY));
    setSheetHeight(newHeight);
    
    // 드래그 중에 확장 상태 업데이트 (실시간 피드백)
    const measuredHeight = contentRef.current?.scrollHeight || contentHeight || 0;
    const targetHeightWithContent = Math.min(measuredHeight + HEADER_HEIGHT, calculatedMaxHeight);
    const expandedHeight = Math.max(targetHeightWithContent - MIN_HEIGHT, 100);
    const threshold = expandedHeight * 0.3;
    
    setIsExpanded(newHeight >= MIN_HEIGHT + threshold);
  };

  // 드래그 종료
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // 내용물 높이에 맞춘 목표 높이 계산
    const measuredHeight = contentRef.current?.scrollHeight || contentHeight || 0;
    const targetHeightWithContent = Math.min(measuredHeight + HEADER_HEIGHT, calculatedMaxHeight);
    
    // threshold: MIN_HEIGHT에서 확장된 높이의 30% (최소 100px 기준)
    const expandedHeight = Math.max(targetHeightWithContent - MIN_HEIGHT, 100);
    const threshold = expandedHeight * 0.3;
    
    if (sheetHeight >= MIN_HEIGHT + threshold) {
      // 충분히 높게 올렸을 때 - 확장 (내용물 높이에 맞춤)
      setIsExpanded(true);
      setSheetHeight(Math.min(targetHeightWithContent, calculatedMaxHeight));
    } else {
      // 충분히 낮게 내렸을 때 - 축소
      setIsExpanded(false);
      setSheetHeight(MIN_HEIGHT);
    }
    
    setStartY(0);
    setStartHeight(0);
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startY, startHeight, sheetHeight, maxHeight]);

  // 탭 클릭 시 확장
  const handleTabClick = (tab: string) => {
    if (!isExpanded) {
      setIsExpanded(true);
      // 내용물 높이 측정 후 높이 설정
      setTimeout(() => {
        const measuredHeight = contentRef.current?.scrollHeight || 0;
        const totalHeight = measuredHeight + HEADER_HEIGHT;
        setSheetHeight(Math.min(totalHeight, calculatedMaxHeight));
      }, 150);
    }
    onTabSelect(tab);
  };

  return (
    <div
      ref={sheetRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[55] transition-all duration-300 ease-out sm:hidden",
        isDragging && "transition-none"
      )}
      style={{
        height: `${sheetHeight}px`,
        maxHeight: `${calculatedMaxHeight}px`,
        bottom: `${NAVBAR_HEIGHT}px`, // 네비바 위에 위치
        boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.25), 0 -2px 10px rgba(0, 0, 0, 0.15)', // y축 양수 방향 강한 부드러운 shadow
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="h-1 w-12 rounded-full bg-gray-300" />
      </div>

      {/* 스튜디오 정보 (항상 표시) */}
      <div className="px-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* 스튜디오 아바타 */}
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {studio?.avatarUrl ? (
              <Image
                src={studio.avatarUrl}
                alt={studioName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">
                {studioName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 스튜디오 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{studioName}</h3>
            <p className="text-xs text-gray-500 truncate">
              @{studio?.slug || studioName.toLowerCase().replace(/\s+/g, '')}
            </p>
          </div>
        </div>
      </div>

      {/* 확장된 콘텐츠 */}
      <div
        ref={contentRef}
        className={cn(
          "transition-all duration-300",
          isExpanded ? "opacity-100 overflow-y-auto" : "opacity-0 h-0 overflow-hidden"
        )}
        style={{
          height: isExpanded ? `${sheetHeight - HEADER_HEIGHT}px` : '0px',
          maxHeight: isExpanded ? `${calculatedMaxHeight - HEADER_HEIGHT}px` : '0px',
        }}
        onLoad={() => {
          // 내용물 로드 후 높이 측정
          if (isExpanded && contentRef.current) {
            const measuredHeight = contentRef.current.scrollHeight || 0;
            const totalHeight = measuredHeight + HEADER_HEIGHT;
            if (totalHeight < calculatedMaxHeight) {
              setSheetHeight(totalHeight);
            }
          }
        }}
      >
        <div ref={(el) => {
          if (el && isExpanded) {
            // 내용물 높이 측정 및 업데이트
            setTimeout(() => {
              const measuredHeight = el.scrollHeight || 0;
              const totalHeight = measuredHeight + HEADER_HEIGHT;
              if (totalHeight < calculatedMaxHeight && totalHeight !== sheetHeight) {
                setSheetHeight(totalHeight);
                setContentHeight(measuredHeight);
              }
            }, 100);
          }
        }}>
          <MobileStudioContentList
            studioId={studioId}
            studioName={studioName}
            studio={studio}
            selectedTab={selectedTab}
            onTabSelect={handleTabClick}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}
