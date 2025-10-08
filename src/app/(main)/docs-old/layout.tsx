"use client";

import { useEffect } from "react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("hide-right-sidebar");
    document.body.classList.add("hide-bottom-navbar");
    
    return () => {
      document.body.classList.remove("hide-right-sidebar");
      document.body.classList.remove("hide-bottom-navbar");
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* 우측 사이드바 숨기기 */
          body.hide-right-sidebar .sticky.top-5.hidden.h-fit.w-80 {
            display: none !important;
          }
          
          /* 하단 네비바 숨기기 (모바일/데스크톱 모두) */
          body.hide-bottom-navbar .mobile-navbar {
            display: none !important;
          }
          body.hide-bottom-navbar .fixed.bottom-6 {
            display: none !important;
          }
          
          /* Docs 페이지 최대 너비 확장 */
          body.hide-right-sidebar .max-w-3xl {
            max-width: 56rem !important;
          }
        `
      }} />
      <div className="w-full">
        {children}
      </div>
    </>
  );
}

