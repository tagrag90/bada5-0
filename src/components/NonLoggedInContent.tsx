"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { 
  ArrowRight
} from "lucide-react";

export default function NonLoggedInContent() {

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="Divetobada"
                width={28}
                height={28}
                className="rounded-full sm:w-8 sm:h-8"
              />
              <span className="text-lg sm:text-xl font-bold text-white">Divetobada</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/docs">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                  문서
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="min-h-screen flex items-center justify-center py-20 sm:py-24 md:py-32 lg:py-40 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight px-2 sm:px-4 break-words text-white">
            For New culture-flow<br />between creator and fan
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-400 mb-6 sm:mb-8 md:mb-10 max-w-2xl px-2 sm:px-4">
            팬들을 위한 자유로운 놀이터
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-start px-2 sm:px-4 max-w-md sm:max-w-none">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-xs sm:text-sm md:text-base h-10 sm:h-11 md:h-12">
                시작하기
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-xs sm:text-sm md:text-base border-gray-700 text-white hover:bg-gray-900 h-10 sm:h-11 md:h-12">
                문서 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="relative min-h-screen flex items-center justify-center py-20 sm:py-24 md:py-32 lg:py-40 px-2 sm:px-4 md:px-6 lg:px-8 text-white overflow-hidden">
        {/* 배경 비디오 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ pointerEvents: 'none' }}
        >
          <source src="/cta-background.mov" type="video/quicktime" />
          <source src="/cta-background.mov" type="video/mp4" />
          {/* 비디오를 지원하지 않는 브라우저를 위한 폴백 */}
        </video>
        {/* 어두운 오버레이 (비디오 위에 텍스트 가독성 향상) */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="relative w-full text-center z-20">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 px-4">
            지금 시작해보세요
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 text-blue-100 px-4 max-w-2xl mx-auto">
            무료로 가입하고 워크스페이스의 강력함을 경험하세요
          </p>
          <div className="px-4 max-w-md sm:max-w-none mx-auto sm:mx-0">
            <Link href="/login" className="inline-block w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-xs sm:text-sm md:text-base h-10 sm:h-11 md:h-12">
                무료로 시작하기
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-black">
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* 로고 */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <Image
              src={Logo}
              alt="Studio_bada"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>

          {/* 링크 섹션 */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8">
            <Link href="/docs" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/docs/workspace" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
              Workspace
            </Link>
            <Link href="/privacy" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <a 
              href="https://www.vessel.today" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
            >
              Vessel
            </a>
            <span className="text-sm sm:text-base text-gray-400">
              teambada1206@gmail.com
            </span>
            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@Divetobada1105" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a 
              href="https://x.com/divetobada_twt" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/divetobada_insta/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* Threads */}
            <a 
              href="https://www.threads.net/@divetobada_insta" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Threads"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                aria-label="Threads"
                fill="currentColor"
                height="20"
                role="img"
                viewBox="0 0 192 192"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
              </svg>
            </a>
          </div>

          {/* 저작권 정보 */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
            <p>© 2025 Studio_bada. All rights reserved.</p>
          </div>

          {/* Studio_bada 초대형 텍스트 - 하단 */}
          <div className="mt-8 sm:mt-12 text-center w-full">
            <h2 className="text-9xl sm:text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-bold text-white leading-none tracking-tight">
              Studio_bada
            </h2>
          </div>
        </div>
      </footer>
    </div>
  );
}
