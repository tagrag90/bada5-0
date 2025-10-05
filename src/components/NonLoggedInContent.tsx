"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NonLoggedInContent() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 히어로 배너 슬라이드 데이터
  const heroSlides = [
    {
      id: 1,
      title: "Join Community 🤝",
      subtitle: "함께 성장하는 커뮤니티",
      description: "서로의 작품에 영감을 주고받으며 함께 발전해요",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      backgroundImage: "/banner-1.jpg",
      hasButton: true,
      decorations: [
        { class: "absolute top-3 right-6 h-18 w-18 rounded-full bg-white/15 blur-lg" },
        { class: "absolute bottom-8 left-4 h-20 w-20 rounded-full bg-white/10 blur-xl" }
      ]
    },
    {
      id: 2,
      title: "Welcome to Bada ✨",
      subtitle: "크리에이터와 함께하는 새로운 시작",
      description: "다양한 크리에이터들과 직접 소통하고 영감을 나누어보세요",
      gradient: "from-purple-600 via-blue-600 to-indigo-700",
      backgroundImage: null,
      hasButton: false,
      decorations: [
        { class: "absolute top-4 right-4 h-20 w-20 rounded-full bg-white/10 blur-xl" },
        { class: "absolute bottom-6 left-6 h-16 w-16 rounded-full bg-white/10 blur-lg" }
      ]
    },
    {
      id: 3,
      title: "Discover Creativity 🎨",
      subtitle: "창의적인 영감을 찾아보세요",
      description: "수많은 크리에이터들의 작품과 아이디어를 만나보세요",
      gradient: "from-pink-500 via-rose-400 to-orange-400",
      backgroundImage: null,
      hasButton: false,
      decorations: [
        { class: "absolute top-6 left-4 h-16 w-16 rounded-full bg-white/20 blur-lg" },
        { class: "absolute bottom-4 right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" }
      ]
    }
  ];

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // 5초마다 변경

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="p-2 md:p-4">
      {/* 히어로 배너 슬라이드 */}
      <div className="relative mb-4 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl shadow-xl">
        {/* 슬라이드 컨테이너 */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div
              key={slide.id}
              className={`w-full flex-shrink-0 relative overflow-hidden bg-gradient-to-br ${slide.gradient} p-4 md:p-6 lg:p-8 text-white aspect-[16/9]`}
              style={slide.backgroundImage ? {
                backgroundImage: `url(${slide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              {/* 1번 배너(hasButton이 true)에서는 오버레이 제거, 2,3번 배너는 유지 */}
              {!slide.hasButton && (
                <div className="absolute inset-0 bg-black/20"></div>
              )}
              
              {/* 1,2번 슬라이드: 텍스트 표시 */}
              {!slide.hasButton && (
                <div className="relative z-10 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto text-center flex flex-col justify-center h-full">
                  <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-3 lg:mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-medium mb-1 md:mb-2 lg:mb-3">
                    {slide.subtitle}
                  </p>
                  <p className="text-sm md:text-base lg:text-lg opacity-90 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              )}
              
              {/* 3번 슬라이드: 우측 하단 시청하기 버튼 */}
              {slide.hasButton && (
                <div className="absolute bottom-4 right-4 z-20">
                  <a
                    href="https://youtu.be/zTyTQrSV5gM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-black font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
                  >
                    <span className="text-sm md:text-base">지금 시청하기</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </a>
                </div>
              )}
              
              {/* 장식 요소 */}
              {slide.decorations.map((decoration, index) => (
                <div key={index} className={decoration.class}></div>
              ))}
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 lg:space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>

        {/* 좌우 네비게이션 버튼 */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1.5 md:p-2 transition-colors"
          aria-label="이전 슬라이드"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1.5 md:p-2 transition-colors"
          aria-label="다음 슬라이드"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 로그인 유도 메시지 */}
      <div className="p-4 md:p-6">
        <div className="max-w-md mx-auto">
          <h2 className="mb-2 text-lg md:text-xl font-semibold">
            크리에이터를 탐색하려면 로그인이 필요합니다
          </h2>
          <p className="mb-4 text-sm md:text-base text-muted-foreground">
            다양한 크리에이터들을 발견하고 직접 소통해보세요.
          </p>
          <Link href="/login">
            <Button className="w-full">로그인하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 